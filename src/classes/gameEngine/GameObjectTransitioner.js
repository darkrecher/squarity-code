import { isNonePython } from '../common/SimpleFunctions.js';
import { StateTransitionImmediate } from './StateTransition.js';
import GameUpdateResult from './GameUpdateResult.js';
import { transitionsLeft, mergeTransitionsLeft } from './TransitionableField.js';
import ComponentImageModifier from './ComponentImageModifier.js';
import ComponentGobjBase from './ComponentGobjBase.js';


// FUTURE : ce serait peut-être plus simple que tous les champs soit des objets StateTransition,
// qui évoluent ou pas. Au lieu d'avoir un nombre de StateTransition variable dans
// une liste, contenant uniquement les transitions qui bougent.
export default class GameObjectTransitioner {
  /*
   * Contient des transitions, avec le field concerné, time start time end, val start val end.
   * Si il y a des fades, des rotations, des changements de couleurs, etc.
   * il faudra les mettre là-dedans.
   */

  // TODO : plus besoin des x,y. Et dans addTransitionsFromNewState non plus.
  constructor(gameModel, x, y, gameObject, timeNow) {
    // On a besoin du gameModel uniquement pour récupérer la valeur transition_delay.
    // C'est pas génial. On a trimbalé ce gros truc depuis le game engine jusqu'ici,
    // en passant par les layers, tout ça pour récupérer un nombre.
    // J'ai pas de meilleur méthode, car il faut pouvoir prendre en compte une modif de ce nombre.
    // Si jamais le gameCode modifie transition_delay, on doit le prendre en compte ici.
    this.gameModel = gameModel;
    // Cette liste contiendra des objets StateTransitionImmediate.
    // C'est un peu bizarre, mais c'est un objet qui stocke un délai et une valeur quelconque,
    // alors ça passe. (La valeur quelconque sera donc une fonction callback du code python)
    this.plannedCallbacks = [];
    this.gameObject = gameObject;
    this.compGobjBase = new ComponentGobjBase(this.gameObject, timeNow);
    if (!isNonePython(this.gameObject.image_modifier)) {
      this.compImageModifier = new ComponentImageModifier(this.gameObject, timeNow);
    } else {
      this.compImageModifier = null;
    }
  }


  clearAllTransitions() {
    // On vire toutes les transitions en cours. Boum !!
    // TODO : à retester
    this.plannedCallbacks = [];
    this.compGobjBase.clearAllTransitions();
    if (this.compImageModifier !== null) {
      this.compImageModifier.clearAllTransitions();
    }
    this.plannedCallbacks = [];
    this.gameObject.ack_cleared_all_transitions();
  }


  addTransitionsFromNewState(x, y, timeNow) {

    let hasCurrentTransitions = false;
    let timeStartTransition = this.getTimeEndTransitions(timeNow);
    const transitionDelay = this.getCurrentTransitionDelay();

    if (this.compGobjBase.addTransitionsFromNewState(transitionDelay, timeStartTransition)) {
      hasCurrentTransitions = true;
    }
    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromNewState(transitionDelay, timeStartTransition)) {
        hasCurrentTransitions = true;
      }
    }

    let oneShotCallback = this.gameObject._one_shot_callback;
    if (!isNonePython(oneShotCallback)) {
      const transitionCallback = new StateTransitionImmediate(
        "callback", // TODO : osef de ce champ.
        timeStartTransition,
        oneShotCallback,
        false
      );
      this.plannedCallbacks.push(transitionCallback);
      this.plannedCallbacks.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      this.gameObject.reset_one_shot_callback();
    }

    return hasCurrentTransitions;
  }


  addTransitionsFromRecords(timeNow) {

    let hasAnyTransition = false;
    // TODO : currentTimeStart c'est pas clair comme nom. À changer partout.
    // TODO : c'est bourrin d'appeler cette fonction à chaque fois, qui est un peu longue à exécuter.
    //        faut faire comme les components: on stocke une variable this.timeEndTransitions.
    //        on la met à jour quand c'est nécessaire (faut trouver quand).
    //        et pour connaître le time des prochaines transitions, on reprend juste cette variable.
    let timeStartTransition = this.getTimeEndTransitions(timeNow);
    if (this.compGobjBase.addTransitionsFromRecords(timeStartTransition)) {
      hasAnyTransition = true;
    }
    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromRecords(timeStartTransition)) {
        hasAnyTransition = true;
      }
    }

    // TODO : il faut un Component spécial pour les plannedCallbacks, dans le JS.
    if (!isNonePython(this.gameObject.back_caller)) {
      if (this.gameObject.back_caller._callbacks_to_record.length) {
        for (let delayedCallBack of this.gameObject.back_caller._callbacks_to_record) {
          const transitionCallback = new StateTransitionImmediate(
            "callback",  // osef
            timeStartTransition + delayedCallBack.delay,
            delayedCallBack.callback,
            false
          );
          this.plannedCallbacks.push(transitionCallback);
        }
        this.plannedCallbacks.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
        this.gameObject.back_caller.clear_callbacks_to_record();
        hasAnyTransition = true;
      }
    }

    return hasAnyTransition;
  }


  updateTransitions(timeNow) {

    const gameUpdateResult = new GameUpdateResult();
    let transiLeft = this.compGobjBase.updateTransitions(timeNow);

    if (this.compImageModifier !== null) {
      const newTransiLeft = this.compImageModifier.updateTransitions(timeNow);
      transiLeft = mergeTransitionsLeft(transiLeft, newTransiLeft);
    }

    if (transiLeft == transitionsLeft.HAS_TRANSITIONS) {
      gameUpdateResult.hasAnyTransition = true;
      gameUpdateResult.PlockTransi = this.gameObject.plock_transi;
    }

    if (transiLeft == transitionsLeft.JUST_ENDED_ALL_TRANSITIONS) {
      // On détecte si y'a une callback de fin de transition à appeler.
      // Et on la met dans le result, pour dire au game engine de les appeler.
      if (!isNonePython(this.gameObject._callback_end_transi)) {
        gameUpdateResult.callbackEndTransi.push(this.gameObject._callback_end_transi);
      }
    }

    // TODO : il faut un Component spécial pour ça, dans le JS.
    if (this.plannedCallbacks.length) {
      const firstTransiCallback = this.plannedCallbacks[0];
      // On exécute une seule callback à la fois. Si il faut en faire plus d'une,
      // elles seront faites aux prochains appels de updateTransitions et pis c'est tout.
      if (firstTransiCallback.isTimeEnded(timeNow)) {
        // On indique au reste du moteur qu'il faudra exécuter cette callback.
        gameUpdateResult.callbackInsideTransi.push(firstTransiCallback.getFinalVal());
        this.plannedCallbacks.shift();
      }
      if (this.plannedCallbacks.length) {
        gameUpdateResult.hasAnyTransition = true;
      }
    }

    return gameUpdateResult;

  }


  updateState(timeNow) {
    /* Met à jour tous les transitionable fields, dans les différents composants,
     * en fonction du temps actuel (timeNow).
     */
    this.compGobjBase.updateState(timeNow);
    if (this.compImageModifier !== null) {
      this.compImageModifier.updateState(timeNow);
    }
  }


  getCurrentTransitionDelay() {
    /* Récupère le délai de transition dans le cas d'une transition
     * suite à un changement d'état.
     */
    let transitionDelay = this.gameObject._one_shot_transition_delay
    if (!isNonePython(transitionDelay)) {
      this.gameObject.reset_one_shot_transition_delay();
      return transitionDelay;
    }
    transitionDelay = this.gameObject._transition_delay
    if (!isNonePython(transitionDelay)) {
      return transitionDelay;
    }
    return this.gameModel.transition_delay;
  }


  // private
  /* TODO WIP crap big.
  applyTransition(transition, gobjStateDest, applyInGame) {
    // un peu bof, tous ces if.
    // Mais je me dis que ça mérite pas de créer 36000 sous-classe juste pour ça.
    if (this.tryApplyTransitionXY(transition, gobjStateDest, applyInGame)) {
      return;
    }

    const finalVal = transition.getFinalVal();
    if (transition.fieldName == "x") {
      if (applyInGame) {
        this.gameObject.move_to_xy(finalVal, this.gameObject._coord.y);
        transition.isAppliedInGame = true;
      }
      gobjStateDest.x = finalVal;
    } else if (transition.fieldName == "y") {
      if (applyInGame) {
        this.gameObject.move_to_xy(this.gameObject._coord.x, finalVal);
        transition.isAppliedInGame = true;
      }
      gobjStateDest.y = finalVal;
    } else if (transition.fieldName == "sprite_name") {
      if (applyInGame) {
        this.gameObject.spriteName = finalVal;
        transition.isAppliedInGame = true;
      }
      gobjStateDest.spriteName = finalVal;
    }
  }


  // private
  tryApplyTransitionXY(transition, gobjStateDest, applyInGame) {
    // On fusionne l'application en x et en y, si c'est possible.
    if (transition.linkedTransition == null) {
      return false;
    }
    const linkedTransition = transition.linkedTransition;
    if (!((transition.fieldName == "x") ^ (linkedTransition.fieldName == "x"))) {
      return false;
    }
    if (!((transition.fieldName == "y") ^ (linkedTransition.fieldName == "y"))) {
      return false;
    }
    let finalValX;
    let finalValY;
    if (transition.fieldName == "x") {
      finalValX = transition.getFinalVal();
      finalValY = linkedTransition.getFinalVal();
    } else {
      finalValX = linkedTransition.getFinalVal();
      finalValY = transition.getFinalVal();
    }
    if (applyInGame) {
      this.gameObject.move_to_xy(finalValX, finalValY);
      transition.isAppliedInGame = true;
      linkedTransition.isAppliedInGame = true;
    }
    gobjStateDest.x = finalValX;
    gobjStateDest.y = finalValY;
    return true;
  }
    */


  // private
  getTimeEndTransitions(timeNow) {
    let endTransitionTimesAll = [timeNow];
    endTransitionTimesAll.push(this.compGobjBase.getTimeEndTransitions());
    if (this.compImageModifier !== null) {
      endTransitionTimesAll.push(this.compImageModifier.getTimeEndTransitions());
    }
    // TODO. foutre les plannedCallbacks dans un component à part.
    if (this.plannedCallbacks.length) {
      const lastCallback = this.plannedCallbacks.slice(-1)[0];
      endTransitionTimesAll.push(lastCallback.getTimeEnd());
    }
    return Math.max(...endTransitionTimesAll);
  }

}
