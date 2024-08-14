import { StateTransitionProgressive } from './StateTransition.js';
import { transitionsLeft, mergeTransitionsLeft, TransitionableField } from './TransitionableField.js';


export default class ComponentGobjBase {

  constructor(gameObject) {
    this.gameObject = gameObject;
    // Trop bizarre cette histoire de bind, mais ça semble marcher.
    // https://www.w3schools.com/js/js_function_bind.asp
    const getValFromPythonCoordX = this.getValFromPythonCoordX.bind(this);
    const setValToPythonCoordX = this.setValToPythonCoordX.bind(this);
    this.coordX = new TransitionableField("coord.x", getValFromPythonCoordX, setValToPythonCoordX, true);
    const getValFromPythonCoordY = this.getValFromPythonCoordY.bind(this);
    const setValToPythonCoordY = this.setValToPythonCoordY.bind(this);
    this.coordY = new TransitionableField("coord.y", getValFromPythonCoordY, setValToPythonCoordY, true);
    const getValFromPythonSpriteName = this.getValFromPythonSpriteName.bind(this);
    const setValToPythonSpriteName = this.setValToPythonSpriteName.bind(this);
    this.spriteName = new TransitionableField("sprite_name", getValFromPythonSpriteName, setValToPythonSpriteName, false);
  }

  addTransitionsFromNewState(transitionDelay, currentTimeStart) {
    let hasAnyTransition = false;
    hasAnyTransition = (
      this.coordX.addTransitionFromNewState(transitionDelay, currentTimeStart)
      || this.coordY.addTransitionFromNewState(transitionDelay, currentTimeStart)
      || this.spriteName.addTransitionFromNewState(transitionDelay, currentTimeStart)
    );
    return hasAnyTransition;
  }

  addTransitionsFromRecords(timeNow) {
    let currentTime = timeNow;
    for (let transi of this.gameObject._transitions_to_record) {

      if (transi.field_name === "coord") {
        let transiToRecordX = []
        let transiToRecordY = []
        for (let step of transi.steps) {
          let [delay, value] = step;
          transiToRecordX.push([delay, value.x]);
          transiToRecordY.push([delay, value.y]);
        }
        this.coordX.addTransitionsFromRecords(currentTime, transiToRecordX);
        this.coordY.addTransitionsFromRecords(currentTime, transiToRecordY);
      } else if (transi.field_name === "sprite_name") {
        /* TODO ça aussi
        for (let step of transi.steps) {
          let [delay, value] = step;
          const transitionImg = new StateTransitionImmediate("sprite_name", currentTime + delay, value, false);
          this.currentTransitions.push(transitionImg);
          currentGobjState.spriteName = value;
          currentTime += delay;
        }
          */
        let transiToRecordSpriteName = []
        for (let step of transi.steps) {
          let [delay, value] = step;
          transiToRecordSpriteName.push([delay, value]);
        }
        this.spriteName.addTransitionsFromRecords(currentTime, transiToRecordSpriteName);
      }

    }
  }

  updateState(timeNow) {
    this.coordX.updateState(timeNow);
    this.coordY.updateState(timeNow);
    this.spriteName.updateState(timeNow);
  }

  updateTransitions(timeNow) {
    let transiLeft = transitionsLeft.NO_TRANSITIONS;

    // TODO : moche, mais ce n'est que "localement" moche.
    let newTransiLeft = this.coordX.updateTransitions(timeNow);
    transiLeft = mergeTransitionsLeft(transiLeft, newTransiLeft);

    newTransiLeft = this.coordY.updateTransitions(timeNow);
    transiLeft = mergeTransitionsLeft(transiLeft, newTransiLeft);

    newTransiLeft = this.spriteName.updateTransitions(timeNow);
    transiLeft = mergeTransitionsLeft(transiLeft, newTransiLeft);

    return transiLeft;
  }

  getTransitionTimeEnd(timeNow) {
    let endTransitionTimes = [timeNow];

    if (this.coordX.stateTransitioners.length) {
      endTransitionTimes.push(this.coordX.getTimeEnd())
    }
    if (this.coordY.stateTransitioners.length) {
      endTransitionTimes.push(this.coordY.getTimeEnd())
    }
    if (this.spriteName.stateTransitioners.length) {
      endTransitionTimes.push(this.coordY.getTimeEnd())
    }

    return Math.max(...endTransitionTimes);
  }


  // --- Les fonctions d'interfaçage entre le code python et le code javascript,
  //     pour ce composant du game object. ---

  getValFromPythonCoordX() {
    return this.gameObject._coord.x;
  }
  setValToPythonCoordX(val) {
    // TODO : faut s'arranger pour appeler ça qu'une seule fois,
    // même si on change les deux coordonnées X et Y en même temps.
    const currentY = this.gameObject._coord.y
    this.gameObject.move_to_xy(val, currentY);
  }

  getValFromPythonCoordY() {
    return this.gameObject._coord.y;
  }
  setValToPythonCoordY(val) {
    const currentX = this.gameObject._coord.x
    this.gameObject.move_to_xy(currentX, val);
  }

  getValFromPythonSpriteName() {
    return this.gameObject.sprite_name;
  }
  setValToPythonSpriteName(val) {
    this.gameObject.sprite_name = val;
  }

}
