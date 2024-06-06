export default class GameUpdateResult {

  /*
   * Cette classe contient les informations
   * renvoyées lorsqu'on met à jour l'affichage de l'aire de jeu,
   * soit parce qu'il y a eu un event (clic, touches, callback, ...)
   * soit parce qu'on est en train d'afficher des transitions.
   */
  constructor() {
    this.hasAnyTransition = false;
    this.uiBlock = GameUpdateResult.UI_NO_BLOCK;
    this.isBlockingTransitionInvisible = false;
    this.callbackInsideTransi = []
    this.callbackEndTransi = []

    //const UI_NO_BLOCK = 0;
  }

  merge(other) {
    this.hasAnyTransition |= other.hasAnyTransition;
    if (this.uiBlock < other.uiBlock) {
      this.uiBlock = other.uiBlock;
    }
    this.callbackInsideTransi.push.apply(this.callbackInsideTransi, other.callbackInsideTransi);
    this.callbackEndTransi.push.apply(this.callbackEndTransi, other.callbackEndTransi);
  }

}

// https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
Object.defineProperty(GameUpdateResult, 'UI_NO_BLOCK', {
  value: 0,
  writable : false,
  enumerable : false,
  configurable : false
});
Object.defineProperty(GameUpdateResult, 'UI_BLOCK', {
  value: 1,
  writable : false,
  enumerable : false,
  configurable : false
});
Object.defineProperty(GameUpdateResult, 'UI_INVISIBLE_BLOCK', {
  value: 2,
  writable : false,
  enumerable : false,
  configurable : false
});
