import { isNonePython } from '../common/SimpleFunctions.js';
import { StateTransitionImmediate } from './StateTransition.js';


export default class ComponentBackCaller {

  constructor(gameObject, timeNow) {
    this.gameObject = gameObject;
    this.timeEndTransitions = timeNow;
    // Cette liste contiendra des objets StateTransitionImmediate.
    // C'est un peu bizarre, mais c'est un objet qui stocke un délai et une valeur quelconque,
    // alors ça passe. (La valeur quelconque sera donc une fonction callback du code python)
    this.plannedCallbacks = [];
    this.pythonBackCaller = this.gameObject.back_caller;
    this.hasPythonBackCaller = !isNonePython(this.pythonBackCaller);
  }


  addTransitionsFromRecords(timeStartTransition) {
    if (!this.hasPythonBackCaller) {
      return false;
    }
    if (!this.gameObject.back_caller._callbacks_to_record.length) {
      return false;
    }

    for (let delayedCallBack of this.gameObject.back_caller._callbacks_to_record) {
      const transitionCallback = new StateTransitionImmediate(
        timeStartTransition + delayedCallBack.delay,
        delayedCallBack.callback,
        false
      );
      this.plannedCallbacks.push(transitionCallback);
    }
    this.plannedCallbacks.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
    this.gameObject.back_caller.clear_callbacks_to_record();
    const lastCallback = this.plannedCallbacks.slice(-1)[0];
    const timeEndCallbacks = lastCallback.getTimeEnd();
    this.timeEndTransitions = timeEndCallbacks;
    return true;
  }


  updateTransitions(timeNow) {
    /* Renvoie null, ou bien une fonction de callback python,
     * qui devra être appelée par le moteur du jeu.
     * On renvoie une seule callback à la fois. Si il faut en faire plus d'une,
     * elles seront faites aux prochains appels de updateTransitions et pis c'est tout.
     */
    if (!this.plannedCallbacks.length) {
      return null;
    }
    const firstTransiCallback = this.plannedCallbacks[0];
    if (!firstTransiCallback.isTimeEnded(timeNow)) {
      return null;
    }
    this.plannedCallbacks.shift();
    return firstTransiCallback.getFinalVal();
  }


  clearAllTransitions(timeNow) {
    this.plannedCallbacks = [];
    this.timeEndTransitions = timeNow;
  }


  getNbUndoneTransitions() {
    return this.plannedCallbacks.length;
  }


}
