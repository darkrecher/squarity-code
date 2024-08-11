import { transitionsLeft, TransitionableField } from './TransitionableField.js';

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

  constructor(gameObject) {
    this.gameObject = gameObject;
    this.pythonComponent = this.gameObject.image_modifier;

    // Trop bizarre cette histoire de bind, mais ça semble marcher.
    // https://www.w3schools.com/js/js_function_bind.asp
    const getValFromPythonAOX = this.getValFromPythonAOX.bind(this);
    const setValToPythonAOX = this.setValToPythonAOX.bind(this);
    this.areaOffsetX = new TransitionableField("area_offset_x", getValFromPythonAOX, setValToPythonAOX);
    const getValFromPythonAOY = this.getValFromPythonAOY.bind(this);
    const setValToPythonAOY = this.setValToPythonAOY.bind(this);
    this.areaOffsetY = new TransitionableField("area_offset_y", getValFromPythonAOY, setValToPythonAOY);
    const getValFromPythonASX = this.getValFromPythonASX.bind(this);
    const setValToPythonASX = this.setValToPythonASX.bind(this);
    this.areaScaleX = new TransitionableField("area_scale_x", getValFromPythonASX, setValToPythonASX);
    const getValFromPythonASY = this.getValFromPythonASY.bind(this);
    const setValToPythonASY = this.setValToPythonASY.bind(this);
    this.areaScaleY = new TransitionableField("area_scale_y", getValFromPythonASY, setValToPythonASY);

    this.transiFields = new Map();
    this.transiFields.set("area_offset_x", this.areaOffsetX);
    this.transiFields.set("area_offset_y", this.areaOffsetY);
    this.transiFields.set("area_scale_x", this.areaScaleX);
    this.transiFields.set("area_scale_y", this.areaScaleY);
  }

  addTransitionsFromNewState(transitionDelay, currentTimeStart) {
    let hasAnyTransition = false;
    for (let transiField of this.transiFields.values()) {
      hasAnyTransition = transiField.addTransitionFromNewState(transitionDelay, currentTimeStart) || hasAnyTransition;
    }
    return hasAnyTransition;
  }

  addTransitionsFromRecords(timeNow) {
    if (!this.pythonComponent._transitions_to_record.length) {
      return false;
    }

    // TODO : faut calculer ça en fonction des transitions en cours dans le bazar.
    let currentTimeStart = timeNow;

    for (let transiToRecord of this.pythonComponent._transitions_to_record) {
      const transiField = this.transiFields.get(transiToRecord.field_name);
      transiField.addTransitionsFromRecords(timeNow, transiToRecord);
    }
    this.pythonComponent.clear_new_transitions();
    return true;
  }

  updateState(timeNow) {
    for (let transiField of this.transiFields.values()) {
      transiField.updateState(timeNow);
    }
  }

  updateTransitions(timeNow) {
    for (let transiField of this.transiFields.values()) {
      transiField.updateTransitions(timeNow);
    }
  }

  // TODO : bof. Faut renvoyer ça dans le updateTransitions
  hasAnyTransitionLeft() {
    let hasAnyTransition = false;
    for (let transiField of this.transiFields.values()) {
      hasAnyTransition = transiField.hasAnyTransitionLeft() || hasAnyTransition;
    }
    return hasAnyTransition;
  }

  // --- Attention, ça va être dégueulasse !! ---
  // Mais j'ai pas trouvé de meilleur moyen de faire ça.

  getValFromPythonAOX() {
    return this.pythonComponent.area_offset_x;
  }
  setValToPythonAOX(val) {
    this.pythonComponent.area_offset_x = val;
  }

  getValFromPythonAOY() {
    return this.pythonComponent.area_offset_y;
  }
  setValToPythonAOY(val) {
    this.pythonComponent.area_offset_y = val;
  }

  getValFromPythonASX() {
    return this.pythonComponent.area_scale_x;
  }
  setValToPythonASX(val) {
    this.pythonComponent.area_scale_x = val;
  }

  getValFromPythonASY() {
    return this.pythonComponent.area_scale_y;
  }
  setValToPythonASY(val) {
    this.pythonComponent.area_scale_y = val;
  }


}
