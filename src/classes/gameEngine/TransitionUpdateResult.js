export default class TransitionUpdateResult {
    /*
     */
    constructor() {
      this.hasAnyTransition = false;
      this.callbackInsideTransi = []
      this.callbackEndTransi = []
    }

    merge(other) {
      this.hasAnyTransition |= other.hasAnyTransition;
      this.callbackInsideTransi.push.apply(this.callbackInsideTransi, other.callbackInsideTransi);
      this.callbackEndTransi.push.apply(this.callbackEndTransi, other.callbackEndTransi);
    }

  }
