import { StateTransitionProgressive } from './StateTransition.js';

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
    this.PythonComponent = this.gameObject.image_modifier;
    // TODO : on est d'accord que c'est dégueu et qu'il faudra génériquifier tout ça.
    this.areaOffsetX = this.PythonComponent.area_offset_x;
    this.areaOffsetXFinal = this.areaOffsetX;
    this.areaOffsetXStateTransitioners = [];
    this.areaOffsetY = 0;
  }

  addTransitionsFromNewState(transitionDelay, currentTimeStart) {
    // TODO : peut-être qu'on n'a pas besoin de cette variable.
    let somethingChanged = false;
    if (this.areaOffsetXFinal != this.PythonComponent.area_offset_x) {
      const transitionToAdd = new StateTransitionProgressive(
        "area_offset_x",
        currentTimeStart, currentTimeStart + transitionDelay,
        this.areaOffsetXFinal,
        this.PythonComponent.area_offset_x,
        true
      );
      this.areaOffsetXStateTransitioners.push(transitionToAdd);
      this.areaOffsetXStateTransitioners.sort((tr1, tr2) => tr1.timeStart - tr2.timeStart);
      this.areaOffsetXFinal = this.PythonComponent.area_offset_x
      somethingChanged = true;
    }
    return (this.areaOffsetXStateTransitioners.length > 0);
  }

  updateState(timeNow) {
    if (this.areaOffsetXStateTransitioners.length > 0) {
      const firstTransition = this.areaOffsetXStateTransitioners[0];
      this.areaOffsetX = firstTransition.getCurrentVal(timeNow);
    }
  }

  updateTransitions(timeNow) {
    let hasAnyTransitionLeft = false;
    let endedOneTransitionList = false;
    if (this.areaOffsetXStateTransitioners.length !== 0) {
      const firstTransition = this.areaOffsetXStateTransitioners[0];
      if ((timeNow >= firstTransition.timeStart) && (!firstTransition.isAppliedInGame)) {
        this.applyTransition(firstTransition);
      }
      if (firstTransition.isTimeEnded(timeNow)) {
        firstTransition.isDone = true;
        this.areaOffsetXStateTransitioners.shift();
        if (this.areaOffsetXStateTransitioners.length > 0) {
          endedOneTransitionList = true;
        }
      } else {
        hasAnyTransitionLeft = true;
      }
    }
    const endedAllTransition = endedOneTransitionList && (!hasAnyTransitionLeft);
    if (endedAllTransition) {
      console.log("endedAllTransition !!!!");
    }
  }

  // TODO : bof. Faut renvoyer ça dans le updateTransitions
  hasAnyTransitionLeft() {
    return this.areaOffsetXStateTransitioners.length > 0;
  }

  // TODO : faut une espèce de callback dans la transition elle-même. Mais là, bon voilà...
  applyTransition(transition) {
    if (transition.fieldName == "area_offset_x") {
      this.areaOffsetXFinal = transition.getFinalVal();
      transition.isAppliedInGame = true;
    }
  }

}
