import { isNonePython } from '../common/SimpleFunctions.js';
import GameUpdateResult from './GameUpdateResult.js';
import { remainingTransi, mergeRemTransi } from './TransitionableField.js';
import ComponentImageModifier from './ComponentImageModifier.js';
import ComponentGobjBase from './ComponentGobjBase.js';
import ComponentBackCaller from './ComponentBackCaller.js';


export default class GameObjectTransitioner {
  /*
   * Contient des transitions, avec le field concerné, time start time end, val start val end.
   * Si il y a des fades, des rotations, des changements de couleurs, etc.
   * il faudra les mettre là-dedans.
   */
  constructor(gameModel, gameObject, timeNow) {
    // On a besoin du gameModel uniquement pour récupérer la valeur transition_delay.
    // C'est pas génial. On a trimbalé ce gros truc depuis le game engine jusqu'ici,
    // en passant par les layers, tout ça pour récupérer un nombre.
    // J'ai pas de meilleur méthode, car il faut pouvoir prendre en compte une modif de ce nombre.
    // Si jamais le gameCode modifie transition_delay, on doit le prendre en compte ici.
    this.gameModel = gameModel;
    this.gameObject = gameObject;
    this.timeEndTransitions = timeNow;
    this.compGobjBase = new ComponentGobjBase(this.gameObject, timeNow);
    if (!isNonePython(this.gameObject.image_modifier)) {
      this.compImageModifier = new ComponentImageModifier(this.gameObject, timeNow);
    } else {
      this.compImageModifier = null;
    }
    this.compBackCaller = new ComponentBackCaller(this.gameObject, timeNow);
  }


  clearAllTransitions(timeNow) {
    // On vire toutes les transitions en cours. Boum !!
    this.compGobjBase.clearAllTransitions(timeNow);
    if (this.compImageModifier !== null) {
      this.compImageModifier.clearAllTransitions(timeNow);
    }
    this.compBackCaller.clearAllTransitions(timeNow);
    this.gameObject.ack_cleared_all_transitions();
  }


  addTransitionsFromNewState(timeNow) {
    /* Renvoie true si on a ajouté de nouvelles transitions.
     * Si il y avait déjà des transitions existantes, mais que l'on n'en rajoute aucune,
     * la fonction renvoie false.
     */

    let addedTransitions = false;
    // Au départ, la date de démarrage des éventuelles nouvelles transitions est
    // égale à "maintenant", ou bien à la date de fin des transitions existantes.
    // Comme ça, on met les transitions bout à bout.
    let timeStartTransition = Math.max(timeNow, this.timeEndTransitions);
    const transitionDelay = this.getCurrentTransitionDelay();

    if (this.compGobjBase.addTransitionsFromNewState(transitionDelay, timeStartTransition)) {
      if (this.timeEndTransitions < this.compGobjBase.timeEndTransitions) {
        console.log("old this.timeEndTransitions", this.timeEndTransitions, "new ", this.compGobjBase.timeEndTransitions);
        this.timeEndTransitions = this.compGobjBase.timeEndTransitions;
      }
      addedTransitions = true;
    }
    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromNewState(transitionDelay, timeStartTransition)) {
        if (this.timeEndTransitions < this.compImageModifier.timeEndTransitions) {
          this.timeEndTransitions = this.compImageModifier.timeEndTransitions;
        }
        addedTransitions = true;
      }
    }

    // Ce code rajoute l'éventuelle callback qui est dans _one_shot_callback.
    // Elle doit être exécutée à ... zut. C'est pas ça du tout.
    // WIP TODO crap.
    /*
    if (this.compBackCaller.addTransitionsFromNewState(transitionDelay, timeStartTransition)) {
      if (this.timeEndTransitions < this.compBackCaller.timeEndTransitions) {
        this.timeEndTransitions = this.compBackCaller.timeEndTransitions;
      }
      addedTransitions = true;
    }*/

    return addedTransitions;
  }


  addTransitionsFromRecords(timeNow) {
    /* Renvoie true si on a ajouté de nouvelles transitions.
     * Si il y avait déjà des transitions existantes, mais que l'on n'en rajoute aucune,
     * la fonction renvoie false.
     */
    let addedTransition = false;
    let timeStartTransition = Math.max(timeNow, this.timeEndTransitions);

    if (this.compGobjBase.addTransitionsFromRecords(timeStartTransition)) {
      if (this.timeEndTransitions < this.compGobjBase.timeEndTransitions) {
        this.timeEndTransitions = this.compGobjBase.timeEndTransitions;
      }
      addedTransition = true;
    }

    if (this.compImageModifier !== null) {
      if (this.compImageModifier.addTransitionsFromRecords(timeStartTransition)) {
        if (this.timeEndTransitions < this.compImageModifier.timeEndTransitions) {
          this.timeEndTransitions = this.compImageModifier.timeEndTransitions;
        }
        addedTransition = true;
      }
    }

    if (this.compBackCaller.addTransitionsFromRecords(timeStartTransition)) {
      if (this.timeEndTransitions < this.compBackCaller.timeEndTransitions) {
        this.timeEndTransitions = this.compBackCaller.timeEndTransitions;
      }
      addedTransition = true;
    }

    return addedTransition;
  }


  updateTransitions(timeNow) {

    // gameUpdateResult est null au départ. On l'instancie seulement
    // si on a besoin de mettre des choses dedans. Dans la suite du code, il y a plein de fois
    // la condition vérifiant si gameUpdateResult est null.
    // C'est un peu bizarre de répéter ça tout le temps. Mais la plupart du temps,
    // et pour la plupart des objets, il se passe rien.
    // Quand il se passe rien, vaut mieux renvoyer null, ça évite au code extérieur de
    // merger un gameUpdateResult. C'est une opération qui prend un peu de temps,
    // et qui ne servirait à rien du tout si le gameUpdateResult n'a rien d'intéressant dedans.
    let gameUpdateResult = null;
    let transiLeft = this.compGobjBase.updateTransitions(timeNow);

    if (this.compImageModifier !== null) {
      const newTransiLeft = this.compImageModifier.updateTransitions(timeNow);
      transiLeft = mergeRemTransi(transiLeft, newTransiLeft);
    }

    if (transiLeft == remainingTransi.HAS_TRANSITIONS) {
      if (gameUpdateResult === null) {
        gameUpdateResult = new GameUpdateResult();
      }
      gameUpdateResult.hasAnyTransition = true;
      gameUpdateResult.PlockTransi = this.gameObject.plock_transi;
    }

    // BIG TODO : lorsqu'on termine une transition qui locke, et qui déclenche une callback de end transition qui locke aussi,
    // on récupère quand même les inputs du player entre les deux transitions. Ça met le bazar, faut pas récupérer ces inputs.
    if (transiLeft == remainingTransi.JUST_ENDED_ALL_TRANSITIONS) {
      // On détecte si y'a une callback de fin de transition à appeler (soit en one_shot, soit celle habituelle).
      // Et on la met dans le result, pour dire au game engine de les appeler.
      let callBackEndTransiToAdd = this.gameObject._one_shot_callback;
      if (!isNonePython(callBackEndTransiToAdd)) {
        this.gameObject.reset_one_shot_callback();
      } else {
        callBackEndTransiToAdd = this.gameObject._callback_end_transi;
      }
      if (!isNonePython(callBackEndTransiToAdd)) {
        if (gameUpdateResult === null) {
          gameUpdateResult = new GameUpdateResult();
        }
        gameUpdateResult.callbackEndTransi.push(callBackEndTransiToAdd);
      }
    }

    const pythonCallBack = this.compBackCaller.updateTransitions(timeNow);
    if (pythonCallBack !== null) {
      // On indique au reste du moteur qu'il faudra exécuter cette callback.
      if (gameUpdateResult === null) {
        gameUpdateResult = new GameUpdateResult();
      }
      gameUpdateResult.callbackInsideTransi.push(pythonCallBack);
    }
    if (this.compBackCaller.getNbUndoneTransitions()) {
      if (gameUpdateResult === null) {
        gameUpdateResult = new GameUpdateResult();
      }
      gameUpdateResult.hasAnyTransition = true;
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


  getNbUndoneTransitions() {
    let nbUndoneTransitions = this.compGobjBase.getNbUndoneTransitions();
    if (this.compImageModifier !== null) {
      nbUndoneTransitions += this.compImageModifier.getNbUndoneTransitions();
    }
    nbUndoneTransitions += this.compBackCaller.getNbUndoneTransitions();
    return nbUndoneTransitions;
  }

}
