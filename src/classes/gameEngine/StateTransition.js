class StateTransition  {

  constructor(timeStart, isAppliedInGame) {
    this.timeStart = timeStart;
    this.isAppliedInGame = isAppliedInGame;
    // Pour gérer des champs qui fonctionnent ensemble, par exemple les coordonnées (x, y).
    this.linkedTransition = null;
  }

  setLinkedTransition(linkedTransition) {
    this.linkedTransition = linkedTransition;
  }

  getCurrentVal(timeNow) {}

  getFinalVal() {}

  isTimeEnded() {}

  getTimeEnd() {}

}


export class StateTransitionProgressive extends StateTransition {

  // isAppliedInGame n'est pas forcément false au départ.
  // Lorsque c'est une transition que l'on crée suite à une détection de changement d'une valeur,
  // c'est déjà appliqué dans le jeu.
  constructor(timeStart, timeEnd, valStart, valEnd, isAppliedInGame) {
    super(timeStart, isAppliedInGame);
    this.timeEnd = timeEnd;
    this.valStart = valStart;
    this.valEnd = valEnd;
    this.valRange = valEnd - valStart;
    this.timeRange = timeEnd - timeStart;
  }


  isTimeEnded(timeNow) {
    return timeNow >= this.timeEnd
  }


  getCurrentVal(timeNow) {
    // FUTURE: et bien sûr, il faudra des ease_in, ease_out, etc.
    if (timeNow < this.timeStart) {
      return this.valStart;
    }
    if (timeNow >= this.timeEnd) {
      return this.valEnd;
    }
    return this.valStart + this.valRange * (timeNow - this.timeStart) / this.timeRange;
  }


  getFinalVal() {
    return this.valEnd;
  }


  getTimeEnd() {
    return this.timeEnd;
  }

}


export class StateTransitionImmediate extends StateTransition {

  constructor(timeStart, val, isAppliedInGame) {
    super(timeStart, isAppliedInGame);
    this.val = val;
  }


  isTimeEnded(timeNow) {
    return timeNow >= this.timeStart
  }


  getCurrentVal(timeNow) {
    return this.val;
  }


  getFinalVal() {
    return this.val;
  }


  getTimeEnd() {
    return this.timeStart;
  }

}
