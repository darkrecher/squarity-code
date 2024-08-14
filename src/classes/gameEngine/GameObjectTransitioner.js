import { isNonePython } from '../common/SimpleFunctions.js';
import { StateTransitionImmediate } from './StateTransition.js';
import GobjState from './GobjState.js';
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

  constructor(gameModel, x, y, gameObject) {
    // On a besoin du gameModel uniquement pour récupérer la valeur transition_delay.
    // C'est pas génial. On a trimbalé ce gros truc depuis le game engine jusqu'ici,
    // en passant par les layers, tout ça pour récupérer un nombre.
    // J'ai pas de meilleur méthode, car il faut pouvoir prendre en compte une modif de ce nombre.
    // Si jamais le gameCode modifie transition_delay, on doit le prendre en compte ici.
    this.gameModel = gameModel;
    this.currentTransitions = [];
    // Cette liste contiendra des objets StateTransitionImmediate.
    // C'est un peu bizarre, mais c'est un objet qui stocke un délai et une valeur quelconque,
    // alors ça passe.
    this.plannedCallbacks = [];
    this.gameObject = gameObject;
    this.compGobjBase = new ComponentGobjBase(this.gameObject);
    this.gobjState = new GobjState(x, y, gameObject.sprite_name);
    if (!isNonePython(this.gameObject.image_modifier)) {
      this.compImageModifier = new ComponentImageModifier(this.gameObject);
    } else {
      this.compImageModifier = null;
    }
  }


  clearRecordedTransitions() {
    // On vire toutes les transitions en cours. Boum !!
    this.currentTransitions = [];
    this.gameObject.ack_recorded_transitions_cleared();
    if (this.compImageModifier !== null) {
      // TODO : mince, j'ai pas la fonction pour ça.
    }
  }


  addTransitionsFromNewState(x, y, timeNow) {

    let somethingChanged = false;
    let currentTimeStart;
    if (this.currentTransitions.length === 0) {
      currentTimeStart = timeNow;
    } else {
      currentTimeStart = this.getEndTransitionTime(timeNow);
    }

    const transitionDelay = this.getCurrentTransitionDelay();
    let oneShotCallback = this.gameObject._one_shot_callback;
    if (!isNonePython(oneShotCallback)) {
      this.gameObject.reset_one_shot_callback();
    } else {
      oneShotCallback = null;
    }

    let hasCurrentTransitions = false;

    if (!transitionDelay) {
      // Le délai de transition est 0. On applique tout de suite les changements,
      // on enregistre rien dans currentTransitions.
      this.gobjState = new GobjState(x, y, this.gameObject.sprite_name);
    } else {
      let transitionX = null;
      let transitionY = null;
      /* WIP TODO
      if (this.gobjState.x != x) {
        transitionX = new StateTransitionProgressive(
          "x",
          currentTimeStart, currentTimeStart + transitionDelay,
          this.gobjState.x, x,
          true
        );
        this.currentTransitions.push(transitionX);
        somethingChanged = true;
      }
      */
      if (this.compGobjBase.addTransitionsFromNewState(transitionDelay, currentTimeStart)) {
        hasCurrentTransitions = true;
      }
      /* WIP TODO

      if (this.gobjState.y != y) {
        transitionY = new StateTransitionProgressive(
          "y",
          currentTimeStart, currentTimeStart + transitionDelay,
          this.gobjState.y, y,
          true
        );
        this.currentTransitions.push(transitionY);
        somethingChanged = true;
      }
        */
      if ((transitionX != null) && (transitionY != null)) {
        transitionY.setLinkedTransition(transitionX);
        transitionX.setLinkedTransition(transitionY);
      }
      /*
      if (this.gobjState.spriteName != this.gameObject.sprite_name) {
        // FUTURE: Pas de transition pour le champ sprite_name,
        // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
        somethingChanged = true;
      }*/
    }

    if (oneShotCallback != null) {
      const transitionCallback = new StateTransitionImmediate(
        "callback",
        currentTimeStart + transitionDelay,
        oneShotCallback,
        false
      );
      this.currentTransitions.push(transitionCallback);
    }
    if (somethingChanged) {
      this.currentTransitions.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      this.gobjState = new GobjState(x, y, this.gameObject.sprite_name);
    }

    hasCurrentTransitions = hasCurrentTransitions || (this.currentTransitions.length > 0);
    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromNewState(transitionDelay, currentTimeStart)) {
        hasCurrentTransitions = true;
      }
    }
    return hasCurrentTransitions;
  }


  addTransitionsFromRecords(timeNow) {
    let hasAnyTransition = false;
    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromRecords(timeNow)) {
        hasAnyTransition = true;
      }
    }

    // TODO WIP crap ???
    let currentTimeStart;
    let currentGobjStateStart;
    if (this.currentTransitions.length === 0) {
      currentTimeStart = timeNow;
      currentGobjStateStart = this.gobjState;
    } else {
      // Ça, c'est juste pour récupérer la valeur finale des champs, qu'il y aura à la fin des transitions existantes.
      // (Et c'est bourrin).
      currentTimeStart = this.getEndTransitionTime(timeNow);
      currentGobjStateStart = this.gobjState.clone();
      for (let transition of this.currentTransitions) {
        this.applyTransition(transition, currentGobjStateStart, false);
      }
    }

    if (this.compGobjBase.addTransitionsFromRecords(timeNow)) {
      hasAnyTransition = true;
    }

    // TODO : il faut un Component spécial pour ça, dans le JS.
    console.log(this.gameObject.back_caller);
    if (!isNonePython(this.gameObject.back_caller)) {
      console.log("zuuuuut !!")
      if (this.gameObject.back_caller._callbacks_to_record.length) {
        console.log("on va eregistrar de la calbcakss. !!");
        for (let delayedCallBack of this.gameObject.back_caller._callbacks_to_record) {
          const transitionCallback = new StateTransitionImmediate("callback", currentTimeStart + delayedCallBack.delay, delayedCallBack.callback, false);
          this.plannedCallbacks.push(transitionCallback);
          console.log("V'la une callback enregistray !!");
          console.log(delayedCallBack.callback);
          hasAnyTransition = true;
        }
        this.plannedCallbacks.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
        this.gameObject.back_caller.clear_callbacks();
      }
    }

    /* TODO WIP BIG crap.

    for (let transi of this.gameObject._transitions_to_record) {
      let currentTime = currentTimeStart;
      let currentGobjState = currentGobjStateStart.clone()
      // FUTURE: je suis pas fan de ce truc, qui va être exécuté plein de fois et qui est un peu lent.
      // (rechercher une chaîne dans une autre chaîne).
      // TODO : faut pas que ce soit la même liste.
      // Il doit y avoir _transitions_to_record et _callbacks_to_record, dans chaque GameObject.
      if (transi.__class__.toString().includes("TransitionSteps")) {
        if (transi.field_name === "coord") {
          for (let step of transi.steps) {
            let [delay, value] = step;
            let transitionX = null;
            let transitionY = null;
            /* TODO WIP crap.
            if (currentGobjState.x != value.x) {
              transitionX = new StateTransitionProgressive("x", currentTime, currentTime + delay, currentGobjState.x, value.x, false);
              this.currentTransitions.push(transitionX);
              currentGobjState.x = value.x;
            }
            if (currentGobjState.y != value.y) {
              transitionY = new StateTransitionProgressive("y", currentTime, currentTime + delay, currentGobjState.y, value.y, false);
              this.currentTransitions.push(transitionY);
              currentGobjState.y = value.y;
            }* /
            if ((transitionX != null) && (transitionY != null)) {
              transitionY.setLinkedTransition(transitionX);
              transitionX.setLinkedTransition(transitionY);
            }
            currentTime += delay;
          }
        } else if (transi.field_name === "sprite_name") {
          /* TODO WIP crap.
          for (let step of transi.steps) {
            let [delay, value] = step;
            const transitionImg = new StateTransitionImmediate("sprite_name", currentTime + delay, value, false);
            this.currentTransitions.push(transitionImg);
            currentGobjState.spriteName = value;
            currentTime += delay;
          }* /
        }
      } else {
        const transitionCallback = new StateTransitionImmediate("callback", currentTime + transi.delay, transi.callback, false);
        this.plannedCallbacks.push(transitionCallback);
        console.log("V'la une callback enregistray !!");
        console.log(transi.callback);
      }
    }
    */
    this.currentTransitions.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
    // TODO : ce truc ne va pas ici. Et faut appeler les fonctions python de clear uniquement quand c'est nécessaire.
    // Pour tous les components.
    this.gameObject.clear_new_transitions();
    hasAnyTransition = true;
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

    return gameUpdateResult;

    // TODO WIP crap.

    if (this.currentTransitions.length === 0) {
      return gameUpdateResult;
    }

    let endedAllTransition = true;
    let hasDoneAtLeastOneTransition = false;
    for (let transition of this.currentTransitions) {
      if (timeNow >= transition.timeStart) {
        if (!transition.isAppliedInGame) {
          this.applyTransition(transition, this.gobjState, true);
        }
        if (transition.isTimeEnded(timeNow)) {
          if (transition.fieldName === "callback") {
            // C'est une transition de callback. On récupère cette callback.
            gameUpdateResult.callbackInsideTransi.push(transition.getFinalVal());
          }
          transition.isDone = true;
          hasDoneAtLeastOneTransition = true;
        } else {
          endedAllTransition = false;
        }
      } else {
        endedAllTransition = false;
      }
    }
    if (endedAllTransition) {
      // On enlève toutes les transitions et on indique qu'il faudra appeler la callback de end des transitions.
      this.currentTransitions = [];
      // On détecte si y'a une callback de fin de transition à appeler.
      // Et on la met dans le result, pour dire au game engine de les appeler.
      if (!isNonePython(this.gameObject._callback_end_transi)) {
        gameUpdateResult.callbackEndTransi.push(this.gameObject._callback_end_transi);
      }
    } else {
      if (hasDoneAtLeastOneTransition) {
        // On enlève seulement les transitions qui sont finies.
        this.currentTransitions = this.currentTransitions.filter(
          (transition) => (!transition.isDone)
        );
      }
      gameUpdateResult.hasAnyTransition = true;
      gameUpdateResult.PlockTransi = this.gameObject.plock_transi;
    }
    return gameUpdateResult;
  }


  getCurrentState(timeNow) {
    /* Renvoie un gobjState avec les champs à jour,
     * en fonction des transitions en cours et d'un time donné.
     */
    this.compGobjBase.updateState(timeNow);
    if (this.compImageModifier !== null) {
      this.compImageModifier.updateState(timeNow);
    }

    if (this.currentTransitions.length === 0) {
      return this.gobjState;
    }
    const gobjStateCurrent = this.gobjState.clone();
    for (let transition of this.currentTransitions) {
      if (timeNow >= transition.timeStart) {
        gobjStateCurrent[transition.fieldName] = transition.getCurrentVal(timeNow);
      }
    }
    return gobjStateCurrent;
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
        // TODO : à vérifier, mais c'est pas le bon nom. Faut que ce soit sprite_name.
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


  // private
  getEndTransitionTime(timeNow) {
    let endTransitionTimes = [timeNow];
    for (let transition of this.currentTransitions) {
      endTransitionTimes.push(transition.getTimeEnd())
    }
    return Math.max(...endTransitionTimes);
  }

}
