import { StateTransitionProgressive } from './StateTransition.js';


export const transitionsLeft = {
  noTransitions: 0,
  justEndedAllTransitions: 1,
  hasTransitions: 2,
}


export class TransitionableField {

  constructor(pythonFieldName, getValFromPython, setValToPython) {
    // Le nom que l'on utilise dans le code python,
    // quand on crée un objet squarity.TransitionSteps.
    this.pythonFieldName = pythonFieldName;
    this.getValFromPython = getValFromPython;
    this.setValToPython = setValToPython;
    // La valeur courante. Celle qui évolue progressivement quand il y a une transition en cours.
    // C'est cette valeur qu'on utilise pour faire le rendu de l'aire de jeu,
    // et donc ça fait bouger les objets.
    this.fieldValue = this.getValFromPython();
    // La valeur que l'on aura lorsque la transition en cours sera terminée.
    this.fieldValueFinal = this.fieldValue;
    // Liste de transition, rangée chronologiquement.
    // On vide cette liste au fur et à mesure que le temps avance.
    // Et on y ajoute des éléments à la fin, lorsque la valeur python change,
    // ou que l'on enregistre explicitement des transitions.
    this.stateTransitioners = [];
    // Est-ce qu'on est vraiment dans la première transition, ou est-ce qu'elle arrivera plus tard.
    this.doingATransition = false;
  }

  addTransitionFromNewState(transitionDelay, currentTimeStart) {
    // TODO : peut-être qu'on n'a pas besoin de cette variable.
    let somethingChanged = false;
    const valFromPython = this.getValFromPython();
    if (this.fieldValueFinal != valFromPython) {
      const transitionToAdd = new StateTransitionProgressive(
        "osef", // TODO.
        currentTimeStart, currentTimeStart + transitionDelay,
        this.fieldValueFinal, valFromPython,
        true
      );
      this.stateTransitioners.push(transitionToAdd);
      this.stateTransitioners.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      somethingChanged = true;
    }
    return this.stateTransitioners.length > 0;
  }

  addTransitionsFromRecords(currentTimeStart, transiToRecord) {
    let currentTime = currentTimeStart;
    let fieldValueRecord = this.fieldValueFinal;
    if (this.stateTransitioners.length) {
      lastTransition = this.stateTransitioners.slice(-1)[0];
      fieldValueRecord = lastTransition.getFinalVal();
    }
    for (let step of transiToRecord.steps) {
      let [delay, value] = step;
      const transition = new StateTransitionProgressive(
        "osef",
        currentTime, currentTime + delay,
        fieldValueRecord, value,
        false
      );
      this.stateTransitioners.push(transition);
      fieldValueRecord = value;
      currentTime += delay;
    }
    this.stateTransitioners.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
  }

  updateState(timeNow) {
    if (this.stateTransitioners.length) {
      const firstTransition = this.stateTransitioners[0];
      this.fieldValue = firstTransition.getCurrentVal(timeNow);
    }
  }

  updateTransitions(timeNow) {
    let transiLeft = transitionsLeft.noTransitions;
    if (this.stateTransitioners.length) {

      transiLeft = transitionsLeft.hasTransitions;
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
        // TODO : on n'a peut-être plus besoin de ce truc.
        firstTransition.isDone = true;
        this.stateTransitioners.shift();
        if (!this.stateTransitioners.length) {
          transiLeft = transitionsLeft.justEndedAllTransitions;
        }
        this.doingATransition = false;
      }

    }
    if (transiLeft == transitionsLeft.justEndedAllTransitions) {
      console.log("endedAllTransition on one field !!!!");
    }
    return transiLeft;
  }

  // TODO : bof. Faut renvoyer ça dans le updateTransitions
  hasAnyTransitionLeft() {
    return this.stateTransitioners.length > 0;
  }

}
