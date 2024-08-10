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
    const getValFromPython = this.getValFromPython.bind(this);
    const setValToPython = this.setValToPython.bind(this);
    this.areaOffsetX = new TransitionableField("area_offset_x", getValFromPython, setValToPython);
    this.areaOffsetY = 0;
  }

  getValFromPython() {
    return this.pythonComponent.area_offset_x;
  }

  setValToPython(val) {
    this.pythonComponent.area_offset_x = val;
  }

  addTransitionsFromNewState(transitionDelay, currentTimeStart) {
    return this.areaOffsetX.addTransitionFromNewState(transitionDelay, currentTimeStart);
  }

  addTransitionsFromRecords(timeNow) {
    if (!this.pythonComponent._transitions_to_record.length) {
      return false;
    }

    // TODO : faut calculer ça en fonction des transitions en cours dans le bazar.
    let currentTimeStart = timeNow;

    for (let transiToRecord of this.pythonComponent._transitions_to_record) {
      if (transiToRecord.field_name === "area_offset_x") {
        this.areaOffsetX.addTransitionsFromRecords(timeNow, transiToRecord);
      }
    }
    this.pythonComponent.clear_new_transitions();
    return true;
  }

  updateState(timeNow) {
    this.areaOffsetX.updateState(timeNow);
  }

  updateTransitions(timeNow) {
    this.areaOffsetX.updateTransitions(timeNow);
  }

  // TODO : bof. Faut renvoyer ça dans le updateTransitions
  hasAnyTransitionLeft() {
    return this.areaOffsetX.hasAnyTransitionLeft();
  }

}
