import { StateTransitionProgressive, StateTransitionImmediate } from './StateTransition.js';
import GobjState from './GobjState.js';
import TransitionUpdateResult from './TransitionUpdateResult.js'


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

  constructor(x, y, gameObject) {
    this.currentTransitions = [];
    this.gameObject = gameObject;
    this.gobjState = new GobjState(x, y, gameObject.sprite_name);
  }


  addTransitionsFromNewState(x, y ,gameObject, timeNow) {
    let somethingChanged = false;
    if (this.gobjState.x != x) {
      // arbtrairement, 300 ms de transition. On fera mieux plus tard.
      const transition = new StateTransitionProgressive("x", timeNow, timeNow + 300, this.gobjState.x, x, true);
      this.currentTransitions.push(transition);
      somethingChanged = true;
    }
    if (this.gobjState.y != y) {
      const transition = new StateTransitionProgressive("y", timeNow, timeNow + 300, this.gobjState.y, y, true);
      this.currentTransitions.push(transition);
      somethingChanged = true;
    }
    if (this.gobjState.sprite_name != gameObject.sprite_name) {
      // FUTURE: Pas de transition pour le champ sprite_name,
      // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
      somethingChanged = true;
    }
    if (somethingChanged) {
      this.currentTransitions.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      this.gobjState = new GobjState(x, y, gameObject.sprite_name);
      // TODO WIP log
      for (let transition of this.currentTransitions) {
        console.log("change from new state", transition.fieldName, transition.timeStart, transition.timeEnd, transition.valStart, transition.valEnd);
      }
    }
    return (this.currentTransitions.length > 0);
  }


  addTransitionsFromRecords(timeNow) {
    for (let transitionSteps of this.gameObject._transitions_to_record) {
      let currentTime = timeNow;
      let currentGobjState = this.gobjState.clone()
      console.log("recording", transitionSteps.field_name);
      if (transitionSteps.field_name === "coord") {
        for (let step of transitionSteps.steps) {
          let [delay, value] = step;
          const transitionX = new StateTransitionProgressive("x", currentTime, currentTime + delay, currentGobjState.x, value.x, false);
          this.currentTransitions.push(transitionX);
          currentGobjState.x = value.x;
          const transitionY = new StateTransitionProgressive("y", currentTime, currentTime + delay, currentGobjState.y, value.y, false);
          this.currentTransitions.push(transitionY);
          currentGobjState.y = value.y;
          currentTime += delay;
        }
      } else if (transitionSteps.field_name === "sprite_name") {
        for (let step of transitionSteps.steps) {
          let [delay, value] = step;
          const transitionImg = new StateTransitionImmediate("sprite_name", currentTime + delay, value, false);
          this.currentTransitions.push(transitionImg);
          currentGobjState.sprite_name = value;
          currentTime += delay;
        }
      }
    }
    this.currentTransitions.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
    this.gameObject.cancel_transitions();
    // TODO WIP log
    console.log("log transition from records");
    for (let transition of this.currentTransitions) {
      console.log(transition.fieldName, transition.timeStart, transition.timeEnd, transition.valStart, transition.valEnd, transition.val);
    }
  }


  updateTransitions(timeNow) {
    if (this.currentTransitions.length === 0) {
      return null;
    }
    let endedAllTransition = true;
    let hasDoneAtLeastOneTransition = false;
    for (let transition of this.currentTransitions) {
      if (timeNow >= transition.timeStart) {
        if (!transition.isAppliedInGame) {
          this.applyTransitionInGame(transition);
        }
        // TODO : c'est ici qu'on chopera les callback inside transi, si y'en a.
        if (transition.isTimeEnded(timeNow)) {
          console.log("ended", transition.fieldName, transition.timeStart)
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
      console.log("endedAllTransition timeNow", timeNow);
      // On enlève toutes les transitions et on indique qu'il faudra appeler la callback de end des transitions.
      this.currentTransitions = [];
      const transiUpdateResult = new TransitionUpdateResult();
      // On détecte si y'a une callback de fin de transition à appeler.
      // Et on la met dans le result, pour dire au game engine de les appeler.
      if (!isNonePython(this.gameObject.callback_end_transi)) {
        transiUpdateResult.callbackEndTransi.push(this.gameObject.callback_end_transi);
      }
      return transiUpdateResult;
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
      const transiUpdateResult = new TransitionUpdateResult();
      transiUpdateResult.hasAnyTransition = true;
      return transiUpdateResult;
    }
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


  // private
  applyTransitionInGame(transition) {
    // un peu bof, tous ces if.
    // Mais je me dis que ça mérite pas de créer 36000 sous-classe juste pour ça.
    // TODO: fusionner l'application en x et en y, of course.
    const finalVal = transition.getFinalVal();
    if (transition.fieldName == "x") {
      this.gameObject.move_to_xy(finalVal, this.gameObject.coord.y);
      this.gobjState.x = finalVal;
    } else if (transition.fieldName == "y") {
      this.gameObject.move_to_xy(this.gameObject.coord.x, finalVal);
      this.gobjState.y = finalVal;
    } else if (transition.fieldName == "sprite_name") {
      this.gameObject.sprite_name = finalVal;
      this.gobjState.sprite_name = finalVal;
    }
    transition.isAppliedInGame = true;
  }

}
