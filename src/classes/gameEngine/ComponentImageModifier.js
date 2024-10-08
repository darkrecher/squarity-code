import { remainingTransi, mergeRemTransi, TransitionableField } from './TransitionableField.js';

/*
Réflexions sur des trucs:
ce serait beaucoup plus pratique si chaque champ du GameObjectTransitioner
et du ComponentImageModifier était un objet StateTransition, avec une fonction getCurrentValue.
Mais si on fait ça, ça risque d'être super lent, même avec des objets n'ayant
aucune transition en cours.
Parce qu'on va appeler 3 fois (voire bien plus) la fonction getCurrentValue, pour
chaque objet, chaque réaffichage. Tout ça pour que ça renvoie des valeurs
qui changent pas.

Et en plus on va avoir un ComponentImageModifier qui contient aussi des StateTransition.
C'est bizarre comme situation. On a plein de champs qui doivent tous être gérés de la
même manière (avec des transitioner), mais ces champs sont disséminés dans des objets
et des sous-objets. Je sais pas comment implémenter ça de manière simple.

Sauf que j'avais géré mes transitions dans une liste pour pouvoir les définir à l'avance.
Exemple: l'objet va en x=5, puis en x=3, et finalement en x=15.
Si on a une transition par champ, on peut plus faire ça.

Faudrait que les transitions aient un "pointeur" sur le champ qu'elle modifie.

On va le tester pour le ComponentImageModifier:
 - chaque champ a une variable (la valeur courante) et une liste de transition (qui peut être vide)
 - quand on update, on modifie la variable avec la valeur calculée par le 1er elem de la liste
 - on supprime les transitions terminées de la liste.
 - il faut parcourir toutes les listes pour savoir si on a une transition en cours, mais c'est pas long.
 - il faudra une petite fonction de callback définissant ce qu'il faut faire à chaque fin de transition
   (en général, modifier la valeur correspondante dans l'objet python)
 */

export default class ComponentImageModifier {

  constructor(gameObject, timeNow) {
    this.gameObject = gameObject;
    this.timeEndTransitions = timeNow;
    this.pythonComponent = this.gameObject.image_modifier;
    this.transiFields = new Map();

    // Trop bizarre cette histoire de bind, mais ça semble marcher.
    // https://www.w3schools.com/js/js_function_bind.asp
    const getValFromPythonAOX = this.getValFromPythonAOX.bind(this);
    const setValToPythonAOX = this.setValToPythonAOX.bind(this);
    this.areaOffsetX = new TransitionableField("area_offset_x", getValFromPythonAOX, setValToPythonAOX, true);
    const getValFromPythonAOY = this.getValFromPythonAOY.bind(this);
    const setValToPythonAOY = this.setValToPythonAOY.bind(this);
    this.areaOffsetY = new TransitionableField("area_offset_y", getValFromPythonAOY, setValToPythonAOY, true);
    const getValFromPythonASX = this.getValFromPythonASX.bind(this);
    const setValToPythonASX = this.setValToPythonASX.bind(this);
    this.areaScaleX = new TransitionableField("area_scale_x", getValFromPythonASX, setValToPythonASX, true);
    const getValFromPythonASY = this.getValFromPythonASY.bind(this);
    const setValToPythonASY = this.setValToPythonASY.bind(this);
    this.areaScaleY = new TransitionableField("area_scale_y", getValFromPythonASY, setValToPythonASY, true);

    this.transiFields.set("area_offset_x", this.areaOffsetX);
    this.transiFields.set("area_offset_y", this.areaOffsetY);
    this.transiFields.set("area_scale_x", this.areaScaleX);
    this.transiFields.set("area_scale_y", this.areaScaleY);

    const getValFromPythonIOX = this.getValFromPythonIOX.bind(this);
    const setValToPythonIOX = this.setValToPythonIOX.bind(this);
    this.imgOffsetX = new TransitionableField("img_offset_x", getValFromPythonIOX, setValToPythonIOX, true);
    const getValFromPythonIOY = this.getValFromPythonIOY.bind(this);
    const setValToPythonIOY = this.setValToPythonIOY.bind(this);
    this.imgOffsetY = new TransitionableField("img_offset_y", getValFromPythonIOY, setValToPythonIOY, true);
    const getValFromPythonISX = this.getValFromPythonISX.bind(this);
    const setValToPythonISX = this.setValToPythonISX.bind(this);
    this.imgSizeX = new TransitionableField("img_size_x", getValFromPythonISX, setValToPythonISX, true);
    const getValFromPythonISY = this.getValFromPythonISY.bind(this);
    const setValToPythonISY = this.setValToPythonISY.bind(this);
    this.imgSizeY = new TransitionableField("img_size_y", getValFromPythonISY, setValToPythonISY, true);

    this.transiFields.set("img_offset_x", this.imgOffsetX);
    this.transiFields.set("img_offset_y", this.imgOffsetY);
    this.transiFields.set("img_size_x", this.imgSizeX);
    this.transiFields.set("img_size_y", this.imgSizeY);

  }

  addTransitionsFromNewState(transitionDelay, timeStartTransition) {
    let addedTransition = false;
    for (let transiField of this.transiFields.values()) {
      if (transiField.addTransitionFromNewState(transitionDelay, timeStartTransition)) {
        addedTransition = true;
      }
    }
    if (addedTransition) {
      this.timeEndTransitions = timeStartTransition + transitionDelay;
    }
    return addedTransition;
  }

  addTransitionsFromRecords(timeStartTransition) {
    if (!this.pythonComponent._transitions_to_record.length) {
      return false;
    }
    for (let transiToRecord of this.pythonComponent._transitions_to_record) {
      const transiField = this.transiFields.get(transiToRecord.field_name);
      const newTimeEndTransitions = transiField.addTransitionsFromRecords(timeStartTransition, transiToRecord.steps);
      if (this.timeEndTransitions < newTimeEndTransitions) {
        this.timeEndTransitions = newTimeEndTransitions;
      }
    }
    this.pythonComponent.clear_transitions_to_record();
    return true;
  }

  updateState(timeNow) {
    for (let transiField of this.transiFields.values()) {
      transiField.updateState(timeNow);
    }
  }

  updateTransitions(timeNow) {
    let transiLeft = remainingTransi.NO_TRANSITIONS;
    for (let transiField of this.transiFields.values()) {
      const newTransiLeft = transiField.updateTransitions(timeNow);
      transiLeft = mergeRemTransi(transiLeft, newTransiLeft);
    }
    return transiLeft;
  }

  clearAllTransitions(timeNow) {
    for (let transiField of this.transiFields.values()) {
      transiField.clearAllTransitions();
    }
    this.timeEndTransitions = timeNow;
  }

  getNbUndoneTransitions() {
    let nbUndoneTransitions = 0;
    for (let transiField of this.transiFields.values()) {
      nbUndoneTransitions += transiField.stateTransitioners.length;
    }
    return nbUndoneTransitions;
  }

  // --- Attention, ça va être dégueulasse !! ---
  // Mais j'ai pas trouvé de meilleur moyen de faire ça.
  //
  // Et en plus, j'ai besoin de mettre des Reflect partout, à cause de ce truc idiot:
  // https://stackoverflow.com/questions/72355462/uncaught-typeerror-proxy-set-handler-returned-false-for-property-length
  // Sans les Reflect, quand je définis img_offset_x à 0,
  // ça lève une exception "proxy set handler returned false for property" dans le javascript.

  getValFromPythonAOX() {
    return this.pythonComponent.area_offset_x;
  }
  setValToPythonAOX(val) {
    Reflect.set(this.pythonComponent, "area_offset_x", val);
  }

  getValFromPythonAOY() {
    return this.pythonComponent.area_offset_y;
  }
  setValToPythonAOY(val) {
    Reflect.set(this.pythonComponent, "area_offset_y", val);
  }

  getValFromPythonASX() {
    return this.pythonComponent.area_scale_x;
  }
  setValToPythonASX(val) {
    Reflect.set(this.pythonComponent, "area_scale_x", val);
  }

  getValFromPythonASY() {
    return this.pythonComponent.area_scale_y;
  }
  setValToPythonASY(val) {
    Reflect.set(this.pythonComponent, "area_scale_y", val);
  }

  getValFromPythonIOX() {
    return this.pythonComponent.img_offset_x;
  }
  setValToPythonIOX(val) {
    Reflect.set(this.pythonComponent, "img_offset_x", val);
  }

  getValFromPythonIOY() {
    return this.pythonComponent.img_offset_y;
  }
  setValToPythonIOY(val) {
    Reflect.set(this.pythonComponent, "img_offset_y", val);
  }

  getValFromPythonISX() {
    return this.pythonComponent.img_size_x;
  }
  setValToPythonISX(val) {
    Reflect.set(this.pythonComponent, "img_size_x", val);
  }

  getValFromPythonISY() {
    return this.pythonComponent.img_size_y;
  }
  setValToPythonISY(val) {
    Reflect.set(this.pythonComponent, "img_size_y", val);
  }

}
