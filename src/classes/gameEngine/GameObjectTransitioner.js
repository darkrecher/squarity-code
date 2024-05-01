import StateTransition from './StateTransition.js';
import GobjState from './GobjState.js';


export default class GameObjectTransitioner {
  /*
   * Contient des transitions, avec le field concerné, time start time end, val start val end.
   * Si il y a des fades, des rotations, des changements de couleurs, etc.
   * il faudra les mettre là-dedans.
   */

  constructor(x, y, gameObject) {
    this.currentTransitions = [];
    this.gobjState = new GobjState(x, y, gameObject.sprite_name);
  }

  addTransitions(x, y ,gameObject, timeNow) {
    let somethingChanged = false;
    if (this.gobjState.x != x) {
      // arbtrairement, 300 ms de transition. On fera mieux plus tard.
      const transition = new StateTransition("x", timeNow, timeNow + 300, this.gobjState.x, x);
      this.currentTransitions.push(transition);
      somethingChanged = true;
    }
    if (this.gobjState.y != y) {
      const transition = new StateTransition("y", timeNow, timeNow + 300, this.gobjState.y, y);
      this.currentTransitions.push(transition);
      somethingChanged = true;
    }
    if (this.gobjState.sprite_name != gameObject.sprite_name) {
      // FUTURE: Pas de transition pour le champ sprite_name,
      // mais on pourrait imaginer des fades ou une suite d'image prédéfinie.
      somethingChanged = true;
    }
    if (somethingChanged) {
      this.gobjState = new GobjState(x, y, gameObject.sprite_name);
    }
  }

  clearEndedTransitions(timeNow) {
    // On vire pas progressivement les transitions passées.
    // Si y'en a plus, on vide le tableau. Sinon, on garde tout.
    // FUTURE: On fera mieux plus tard.
    // Pour info: pour supprimer un élément dans un tableau, c'est splice.
    if (this.currentTransitions.length === 0) {
      return;
    }
    let allEnded = true;
    for (let transition of this.currentTransitions) {
      if (!transition.hasEnded(timeNow)) {
        allEnded = false;
      }
    }
    if (allEnded) {
      this.currentTransitions = [];
    }
  }

  hasTransitions() {
    /* Indique si l'objet a des transitions en cours. */
    return this.currentTransitions.length > 0;
  }

  getCurrentState(timeNow) {
    /* Renvoie un gobjState avec les champs à jour,
     * en fonction des transitions en cours et d'une time donné.
     */
    if (this.currentTransitions.length === 0) {
      return this.gobjState;
    }
    const gobjStateCurrent = this.gobjState.clone();
    for (let transition of this.currentTransitions) {
      if (!transition.hasEnded(timeNow)) {
        gobjStateCurrent[transition.fieldName] = transition.getCurrentVal(timeNow);
      }
    }
    return gobjStateCurrent;
  }

}
