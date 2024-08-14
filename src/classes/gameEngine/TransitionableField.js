import { StateTransitionProgressive, StateTransitionImmediate } from './StateTransition.js';

// TODO : trouver un autre nom que transitionsLeft.
// (Andouille d'anglais qui utilise le même mot pour "laisser" et pour "gauche").
export const transitionsLeft = {
  NO_TRANSITIONS: 0,
  JUST_ENDED_ALL_TRANSITIONS: 1,
  HAS_TRANSITIONS: 2,
}


export function mergeTransitionsLeft(transi1, transi2) {
  if (
    (transi1 == transitionsLeft.HAS_TRANSITIONS)
    || (transi2 == transitionsLeft.HAS_TRANSITIONS)
  ) {
    return transitionsLeft.HAS_TRANSITIONS;
  }
  if (
    (transi1 == transitionsLeft.JUST_ENDED_ALL_TRANSITIONS)
    || (transi2 == transitionsLeft.JUST_ENDED_ALL_TRANSITIONS)
  ) {
    return transitionsLeft.JUST_ENDED_ALL_TRANSITIONS;
  }
  return transitionsLeft.NO_TRANSITIONS;
}


export class TransitionableField {

  constructor(pythonFieldName, getValFromPython, setValToPython, useTransitionProgressive) {
    // Le nom que l'on utilise dans le code python,
    // quand on crée un objet squarity.TransitionSteps.
    // TODO : et que si ça se trouve on n'en a pas besoin.
    this.pythonFieldName = pythonFieldName;

    this.getValFromPython = getValFromPython;
    this.setValToPython = setValToPython;
    this.useTransitionProgressive = useTransitionProgressive;
    // La valeur courante. Celle qui évolue progressivement quand il y a une transition en cours.
    // C'est cette valeur qu'on utilise pour faire le rendu dans l'aire de jeu.
    // Les objets bougent, ils grossissent, etc,
    this.fieldValue = this.getValFromPython();
    // La valeur que l'on aura lorsque la transition en cours sera terminée.
    this.fieldValueFinal = this.fieldValue;
    // Liste de transition, rangée chronologiquement.
    // On vide cette liste au fur et à mesure que le temps avance.
    // On y ajoute des éléments à la fin, lorsque la valeur python change,
    // ou que l'on enregistre explicitement des transitions.
    this.stateTransitioners = [];
    // Indique si on est vraiment dans la première transition, ou si elle arrivera plus tard.
    this.doingATransition = false;
  }

  addTransitionFromNewState(transitionDelay, currentTimeStart) {
    const valFromPython = this.getValFromPython();
    if (this.fieldValueFinal != valFromPython) {
      let transitionToAdd = null;
      if (this.useTransitionProgressive) {
        transitionToAdd = new StateTransitionProgressive(
          "osef", // TODO.
          currentTimeStart, currentTimeStart + transitionDelay,
          this.fieldValueFinal, valFromPython,
          true
        );
      } else {
        transitionToAdd = new StateTransitionImmediate(
          "osef", // TODO.
          currentTimeStart + transitionDelay,
          valFromPython,
          true
        );
      }
      this.stateTransitioners.push(transitionToAdd);
      this.stateTransitioners.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      return true;
    } else {
      return false;
    }
  }

  addTransitionsFromRecords(currentTimeStart, transitionsToRecord) {
    /* transitionsToRecord doit être un liste, dont chaque élément
     * est une sous-liste de 2 valeurs.
     *  - int. Délai, en millisecondes.
     *  - any. La valeur du champ à la fin de ce step de transition.
     */
    console.log("addTransitionsFromRecords zut", currentTimeStart, this.pythonFieldName)
    let timeOfTransitions = currentTimeStart;
    // TODO : pas besoin de faire ça si on est une transition immediate
    let fieldValueRecord = this.fieldValueFinal;
    if (this.stateTransitioners.length) {
      const lastTransition = this.stateTransitioners.slice(-1)[0];
      fieldValueRecord = lastTransition.getFinalVal();
    }

    for (let step of transitionsToRecord) {
      let [delay, value] = step;
      let transitionToAdd = null;
      if (this.useTransitionProgressive) {
        transitionToAdd = new StateTransitionProgressive(
          "osef", // TODO.
          timeOfTransitions, timeOfTransitions + delay,
          fieldValueRecord, value,
          false
        );
      } else {
        transitionToAdd = new StateTransitionImmediate(
          "osef", // TODO.
          timeOfTransitions + delay,
          value,
          false
        );
      }
      this.stateTransitioners.push(transitionToAdd);
      fieldValueRecord = value;
      timeOfTransitions += delay;
    }
    this.stateTransitioners.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
    console.log(this.pythonFieldName);
    for (let transi of this.stateTransitioners) {
      console.log(transi.timeStart, transi.timeEnd, transi.valStart, transi.valEnd);
    }
    console.log("--------- returning ", timeOfTransitions);
    return timeOfTransitions;
  }

  updateState(timeNow) {
    if (this.stateTransitioners.length) {
      const firstTransition = this.stateTransitioners[0];
      this.fieldValue = firstTransition.getCurrentVal(timeNow);
    }
  }

  updateTransitions(timeNow) {
    let transiLeft = transitionsLeft.NO_TRANSITIONS;
    if (this.stateTransitioners.length) {

      transiLeft = transitionsLeft.HAS_TRANSITIONS;
      const firstTransition = this.stateTransitioners[0];

      if ((!this.doingATransition) && (timeNow >= firstTransition.timeStart)) {
        // On modifie les champs dans cet objet, et dans l'objet python, dès le début de la transition.
        this.fieldValueFinal = firstTransition.getFinalVal();
        this.doingATransition = true;
        if (!firstTransition.isAppliedInGame) {
          this.setValToPython(this.fieldValueFinal);
          firstTransition.isAppliedInGame = true;
        }
      }

      if (firstTransition.isTimeEnded(timeNow)) {
        // À priori, les deux valeurs sont déjà égales suite aux appels à updateState,
        // mais on redéfinit une dernière fois, pour être sûr.
        this.fieldValue = this.fieldValueFinal;
        // TODO : on n'a peut-être plus besoin de ce truc. (isDone)
        firstTransition.isDone = true;
        this.stateTransitioners.shift();
        if (!this.stateTransitioners.length) {
          transiLeft = transitionsLeft.JUST_ENDED_ALL_TRANSITIONS;
        }
        this.doingATransition = false;
      }

    }
    if (transiLeft == transitionsLeft.JUST_ENDED_ALL_TRANSITIONS) {
      console.log("endedAllTransition on one field !!!!");
    }
    return transiLeft;
  }

  getTimeEnd() {
    /*
     * Ça va planter si cette fonction est exécutée sur un TransitionableField
     * qui n'a pas de transition en cours.
     * Faut le vérifier avant, avec la condition this.stateTransitioners.length > 0
     */
    const lastTransition = this.stateTransitioners.slice(-1)[0];
    return lastTransition.getTimeEnd();
  }

  clearAllTransitions() {
    // Paf, on vide la liste direct.
    this.stateTransitioners = [];
    this.doingATransition = false;
  }

}
