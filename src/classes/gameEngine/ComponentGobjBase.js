import { StateTransitionProgressive } from './StateTransition.js';
import { transitionsLeft, mergeTransitionsLeft, TransitionableField } from './TransitionableField.js';


export default class ComponentGobjBase {

  constructor(gameObject, timeNow) {
    this.gameObject = gameObject;
    this.timeEndTransitions = timeNow;
    // Trop bizarre cette histoire de bind, mais ça semble marcher.
    // https://www.w3schools.com/js/js_function_bind.asp
    const getValFromPythonCoordX = this.getValFromPythonCoordX.bind(this);
    const setValToPythonCoordX = this.setValToPythonCoordX.bind(this);
    this.coordX = new TransitionableField("coord.x", getValFromPythonCoordX, setValToPythonCoordX, true);
    const getValFromPythonCoordY = this.getValFromPythonCoordY.bind(this);
    const setValToPythonCoordY = this.setValToPythonCoordY.bind(this);
    this.coordY = new TransitionableField("coord.y", getValFromPythonCoordY, setValToPythonCoordY, true);
    // FUTURE: Pas de transition pour le champ sprite_name.
    // (On declare TransitionableField avec useTransitionProgressive=false)
    // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
    const getValFromPythonSpriteName = this.getValFromPythonSpriteName.bind(this);
    const setValToPythonSpriteName = this.setValToPythonSpriteName.bind(this);
    this.spriteName = new TransitionableField("sprite_name", getValFromPythonSpriteName, setValToPythonSpriteName, false);
  }

  addTransitionsFromNewState(transitionDelay, timeStartTransition) {
    const addedOneTransition = (
      this.coordX.addTransitionFromNewState(transitionDelay, timeStartTransition)
      || this.coordY.addTransitionFromNewState(transitionDelay, timeStartTransition)
      // TODO : euh... C'est sûr qu'on doit faire comme ça pour le spriteName ?
      || this.spriteName.addTransitionFromNewState(transitionDelay, timeStartTransition)
    );
    if (addedOneTransition) {
      this.timeEndTransitions = timeStartTransition + transitionDelay;
    }
    const hasAnyTransition = (
      (this.coordX.stateTransitioners.length > 0)
      || (this.coordY.stateTransitioners.length > 0)
      || (this.spriteName.stateTransitioners.length > 0)
    );
    return hasAnyTransition;
  }

  addTransitionsFromRecords(timeNow) {
    if (!this.gameObject._transitions_to_record) {
      return false;
    }

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
        let newTimeEndTransitions = this.coordX.addTransitionsFromRecords(currentTime, transiToRecordX);
        if (this.timeEndTransitions < newTimeEndTransitions) {
          this.timeEndTransitions = newTimeEndTransitions;
        }
        newTimeEndTransitions = this.coordY.addTransitionsFromRecords(currentTime, transiToRecordY);
        if (this.timeEndTransitions < newTimeEndTransitions) {
          this.timeEndTransitions = newTimeEndTransitions;
        }
      } else if (transi.field_name === "sprite_name") {
        // TODO : Meuh. On doit pouvoir faire comme dans le image modifier.
        let transiToRecordSpriteName = []
        for (let step of transi.steps) {
          let [delay, value] = step;
          transiToRecordSpriteName.push([delay, value]);
        }
        let newTimeEndTransitions = this.spriteName.addTransitionsFromRecords(currentTime, transiToRecordSpriteName);
        if (this.timeEndTransitions < newTimeEndTransitions) {
          this.timeEndTransitions = newTimeEndTransitions;
        }
      }
    }
    this.gameObject.clear_transitions_to_record()
    return true;
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

    // TODO : vérifier que les recorded transitions mettent bien à jour le sprite_name dans le python.
    // parce que le code d'avant ne le faisait pas, à priori.
    newTransiLeft = this.spriteName.updateTransitions(timeNow);
    transiLeft = mergeTransitionsLeft(transiLeft, newTransiLeft);

    return transiLeft;
  }

  getTimeEndTransitions(timeNow) {
    return this.timeEndTransitions;
  }

  clearAllTransitions() {
    this.coordX.clearAllTransitions();
    this.coordY.clearAllTransitions();
    this.spriteName.clearAllTransitions();
    // C'est pas top de redéfinir la date de fin des transitions en utilisant performance,
    // plutôt qu'avec un paramètre timeNow. Mais bon, ça va bien.
    this.timeEndTransitions = performance.now();
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
