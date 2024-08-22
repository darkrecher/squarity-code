import { remainingTransi, mergeRemTransi, TransitionableField } from './TransitionableField.js';


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
    // FUTURE: Pour l'instant, pas de transition pour le champ sprite_name.
    // (On declare TransitionableField avec useTransitionProgressive=false)
    // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
    const getValFromPythonSpriteName = this.getValFromPythonSpriteName.bind(this);
    const setValToPythonSpriteName = this.setValToPythonSpriteName.bind(this);
    this.spriteName = new TransitionableField("sprite_name", getValFromPythonSpriteName, setValToPythonSpriteName, false);
    this.pythonCoordXToSet = null;
  }

  addTransitionsFromNewState(transitionDelay, timeStartTransition) {
    const addedX = this.coordX.addTransitionFromNewState(transitionDelay, timeStartTransition);
    const addedY = this.coordY.addTransitionFromNewState(transitionDelay, timeStartTransition);
    // Pour spriteName, on applique la modif tout de suite. Donc transitionDelay = 0.
    const addedSprite = this.spriteName.addTransitionFromNewState(0, timeStartTransition);
    const addedTransition = addedX || addedY || addedSprite;
    if (addedTransition) {
      this.timeEndTransitions = timeStartTransition + transitionDelay;
    }
    return addedTransition;
  }

  addTransitionsFromRecords(timeStartTransition) {
    if (!this.gameObject._transitions_to_record) {
      return false;
    }

    for (let transi of this.gameObject._transitions_to_record) {
      if (transi.field_name === "coord") {
        let transiToRecordX = []
        let transiToRecordY = []
        for (let step of transi.steps) {
          let [delay, value] = step;
          transiToRecordX.push([delay, value.x]);
          transiToRecordY.push([delay, value.y]);
        }
        let newTimeEndTransitions = this.coordX.addTransitionsFromRecords(timeStartTransition, transiToRecordX);
        if (this.timeEndTransitions < newTimeEndTransitions) {
          this.timeEndTransitions = newTimeEndTransitions;
        }
        newTimeEndTransitions = this.coordY.addTransitionsFromRecords(timeStartTransition, transiToRecordY);
        if (this.timeEndTransitions < newTimeEndTransitions) {
          this.timeEndTransitions = newTimeEndTransitions;
        }
      } else if (transi.field_name === "sprite_name") {
        let newTimeEndTransitions = this.spriteName.addTransitionsFromRecords(timeStartTransition, transi.steps);
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
    let transiLeft = remainingTransi.NO_TRANSITIONS;
    // Il faut obligatoirement updater la coordonnée X avant la coordonnée Y.
    // (Voir commentaires dans les fonctions "SetValToPythonCoord")
    let newTransiLeft = this.coordX.updateTransitions(timeNow);
    transiLeft = mergeRemTransi(transiLeft, newTransiLeft);
    newTransiLeft = this.coordY.updateTransitions(timeNow);
    transiLeft = mergeRemTransi(transiLeft, newTransiLeft);
    newTransiLeft = this.spriteName.updateTransitions(timeNow);
    transiLeft = mergeRemTransi(transiLeft, newTransiLeft);
    return transiLeft;
  }

  clearAllTransitions(timeNow) {
    this.coordX.clearAllTransitions();
    this.coordY.clearAllTransitions();
    this.spriteName.clearAllTransitions();
    this.timeEndTransitions = timeNow;
  }

  getNbUndoneTransitions() {
    return (
      this.coordX.stateTransitioners.length
      + this.coordY.stateTransitioners.length
      + this.spriteName.stateTransitioners.length
    );
  }

  // --- Les fonctions d'interfaçage entre le code python et le code javascript,
  //     pour ce composant du game object. ---
  // Je mets des "return true" dans tous les set, à cause de ça :
  // https://stackoverflow.com/questions/72355462/uncaught-typeerror-proxy-set-handler-returned-false-for-property-length

  getValFromPythonCoordX() {
    return this.gameObject._coord.x;
  }
  setValToPythonCoordX(val) {
    // On n'écrit pas la valeur dans l'objet python. On la garde pour plus tard.
    // Elle sera écrite lorsqu'on s'occupera de la coordonnée Y.
    // Ça veut dire qu'après avoir appelé cette fonction, il faut obligatoirement
    // appeler setValToPythonCoordY.
    // Sinon ça va tout mettre en vrac dans les gameObject python.
    this.pythonCoordXToSet = val;
  }

  getValFromPythonCoordY() {
    return this.gameObject._coord.y;
  }
  setValToPythonCoordY(val) {
    // On récupère la coordonnée X à définir, qui a été préalablement enregistrée
    // lors de l'exécution de setValToPythonCoordX.
    let coordX;
    if (this.pythonCoordXToSet !== null) {
      coordX = this.pythonCoordXToSet;
      this.pythonCoordXToSet = null;
    } else {
      // Si y'en a pas, on prend la valeur courante par défaut.
      coordX = this.gameObject._coord.x;
    }
    // Et maintenant, on peut appeler cette fonction python.
    // Cette bidouille de transfert de la coordonnée X permet d'appeler la fonction move_to_xy
    // une seule fois, pour X et Y. Au lieu de l'appeler une première fois pour X
    // puis une seconde pour Y. Ça fonctionnerait, mais ce serait un peu bizarre.
    // Il faut limiter les interactions python <-> JS.
    this.gameObject.move_to_xy(coordX, val);
  }

  getValFromPythonSpriteName() {
    return this.gameObject.sprite_name;
  }
  setValToPythonSpriteName(val) {
    Reflect.set(this.gameObject, "sprite_name", val);
  }

}
