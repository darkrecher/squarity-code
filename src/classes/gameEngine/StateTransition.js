class StateTransition  {

  constructor(timeStart, isAppliedInGame) {
    this.timeStart = timeStart;
    this.isAppliedInGame = isAppliedInGame;
    this.isDone = false;
  }

  getCurrentVal(timeNow) {}

  getFinalVal() {}

  isTimeEnded() {}

  getTimeEnd() {}

}


export class StateTransitionProgressive extends StateTransition {

  // TODO: isAppliedInGame n'a peut-être pas besoin d'être défini en paramètre.
  // À priori, c'est False tout le temps, au départ.
  constructor(fieldName, timeStart, timeEnd, valStart, valEnd, isAppliedInGame) {
    super(timeStart, isAppliedInGame);
    this.fieldName = fieldName;
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

  constructor(fieldName, timeStart, val, isAppliedInGame) {
    super(timeStart, isAppliedInGame);
    this.fieldName = fieldName;
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
