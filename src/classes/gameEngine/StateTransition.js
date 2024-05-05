export default class StateTransition {

  constructor(fieldName, timeStart, timeEnd, valStart, valEnd, isAppliedInGame) {
    this.fieldName = fieldName;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.valStart = valStart;
    this.valEnd = valEnd;
    this.valRange = valEnd - valStart;
    this.timeRange = timeEnd - timeStart;
    this.isAppliedInGame = isAppliedInGame;
    this.isDone = false;
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

}
