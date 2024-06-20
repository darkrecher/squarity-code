import { StateTransitionProgressive, StateTransitionImmediate } from './StateTransition.js';
import GobjState from './GobjState.js';
import GameUpdateResult from './GameUpdateResult.js'


// TODO : factoriser et foutre dans un autre fichier.
function isNonePython(val) {
  // Quand du code python renvoie None, la variable javascript prend la valeur "undefined"

  // https://www.tutorialrepublic.com/faq/how-to-determine-if-variable-is-undefined-or-null-in-javascript.php
  // La manière de vérifier si une variable est "undefined" en javascript est
  // vraiment dégueulasse, mais tout le monde fait comme ça.
  // "undefined" est un mot-clé de base du javascript, mais pour tester cette valeur,
  // il faut passer par un typeof et une comparaison de chaîne de caractères.
  // Tu te fous vraiment de ma gueule, javascript.
  return typeof val === 'undefined';
}


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
    this.gameObject = gameObject;
    this.gobjState = new GobjState(x, y, gameObject.sprite_name);
  }


  clearRecordedTransitions() {
    // On vire toutes les transitions en cours. Boum !!
    this.currentTransitions = [];
    this.gameObject.ack_recorded_transitions_cleared();
  }


  addTransitionsFromNewState(x, y ,gameObject, timeNow) {

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

    if (!transitionDelay) {
      // Le délai de transition est 0. On applique tout de suite les changements,
      // on enregistre rien dans currentTransitions.
      this.gobjState = new GobjState(x, y, gameObject.sprite_name);
    } else {
      let transitionX = null;
      let transitionY = null;
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
      if ((transitionX != null) && (transitionY != null)) {
        transitionY.setLinkedTransition(transitionX);
        transitionX.setLinkedTransition(transitionY);
      }
      if (this.gobjState.spriteName != gameObject.sprite_name) {
        // FUTURE: Pas de transition pour le champ sprite_name,
        // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
        somethingChanged = true;
      }
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
      this.gobjState = new GobjState(x, y, gameObject.sprite_name);
    }
    return (this.currentTransitions.length > 0);
  }


  addTransitionsFromRecords(timeNow) {
    let currentTimeStart;
    let currentGobjStateStart;
    if (this.currentTransitions.length === 0) {
      currentTimeStart = timeNow;
      currentGobjStateStart = this.gobjState;
    } else {
      currentTimeStart = this.getEndTransitionTime(timeNow);
      currentGobjStateStart = this.gobjState.clone();
      for (let transition of this.currentTransitions) {
        this.applyTransition(transition, currentGobjStateStart, false);
      }
    }

    for (let transi of this.gameObject._transitions_to_record) {
      let currentTime = currentTimeStart;
      let currentGobjState = currentGobjStateStart.clone()
      // FUTURE: je suis pas fan de ce truc, qui va être exécuté plein de fois et qui est un peu lent.
      // (rechercher une chaîne dans une autre chaîne).
      if (transi.__class__.toString().includes("TransitionSteps")) {
        if (transi.field_name === "coord") {
          for (let step of transi.steps) {
            let [delay, value] = step;
            let transitionX = null;
            let transitionY = null;
            if (currentGobjState.x != value.x) {
              transitionX = new StateTransitionProgressive("x", currentTime, currentTime + delay, currentGobjState.x, value.x, false);
              this.currentTransitions.push(transitionX);
              currentGobjState.x = value.x;
            }
            if (currentGobjState.y != value.y) {
              transitionY = new StateTransitionProgressive("y", currentTime, currentTime + delay, currentGobjState.y, value.y, false);
              this.currentTransitions.push(transitionY);
              currentGobjState.y = value.y;
            }
            if ((transitionX != null) && (transitionY != null)) {
              transitionY.setLinkedTransition(transitionX);
              transitionX.setLinkedTransition(transitionY);
            }
            currentTime += delay;
          }
        } else if (transi.field_name === "sprite_name") {
          for (let step of transi.steps) {
            let [delay, value] = step;
            const transitionImg = new StateTransitionImmediate("sprite_name", currentTime + delay, value, false);
            this.currentTransitions.push(transitionImg);
            currentGobjState.spriteName = value;
            currentTime += delay;
          }
        }
      } else {
        const transitionCallback = new StateTransitionImmediate("callback", currentTime + transi.delay, transi.callback, false);
        this.currentTransitions.push(transitionCallback);
      }
    }
    this.currentTransitions.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
    this.gameObject.clear_new_transitions();
  }


  updateTransitions(timeNow) {
    if (this.currentTransitions.length === 0) {
      return null;
    }
    const gameUpdateResult = new GameUpdateResult();
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
        // TODO : c'est un peu dégueu de reconstruire une liste juste pour filtrer des trucs.
        // Si le JS peut faire mieux, je suis preneur.
        // Pour info: pour supprimer un élément dans un tableau, c'est splice.
        const newCurrentTransitions = [];
        for (let transition of this.currentTransitions) {
          if (!transition.isDone) {
            newCurrentTransitions.push(transition);
          }
        }
        this.currentTransitions = newCurrentTransitions;
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
        this.gameObject.move_to_xy(finalVal, this.gameObject.coord.y);
        transition.isAppliedInGame = true;
      }
      gobjStateDest.x = finalVal;
    } else if (transition.fieldName == "y") {
      if (applyInGame) {
        this.gameObject.move_to_xy(this.gameObject.coord.x, finalVal);
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


  // private
  getEndTransitionTime(timeNow) {
    let endTransitionTimes = [timeNow];
    for (let transition of this.currentTransitions) {
      endTransitionTimes.push(transition.getTimeEnd())
    }
    return Math.max(...endTransitionTimes);
  }

}
