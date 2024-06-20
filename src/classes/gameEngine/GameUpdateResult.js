export default class GameUpdateResult {

  /*
   * Cette classe contient les informations
   * renvoyées lorsqu'on met à jour l'affichage de l'aire de jeu,
   * soit parce qu'il y a eu un event (clic, touches, callback, ...)
   * soit parce qu'on est en train d'afficher des transitions.
   */
  constructor() {
    this.hasAnyTransition = false;
    this.PlockTransi = GameUpdateResult.PLOCK_TRANSI_NO_LOCK;
    this.callbackInsideTransi = []
    this.callbackEndTransi = []
  }

  merge(other) {
    this.hasAnyTransition |= other.hasAnyTransition;
    if (this.PlockTransi < other.PlockTransi) {
      this.PlockTransi = other.PlockTransi;
    }
    this.callbackInsideTransi.push.apply(this.callbackInsideTransi, other.callbackInsideTransi);
    this.callbackEndTransi.push.apply(this.callbackEndTransi, other.callbackEndTransi);
  }

}

// TODO : Et peut-être que ça devrait aller dans un truc méga-générique. Parce que même le GameBoard s'en sert, de ce truc.
// https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
Object.defineProperty(GameUpdateResult, 'PLOCK_TRANSI_NO_LOCK', {
  value: 0,
  writable : false,
  enumerable : false,
  configurable : false
});
Object.defineProperty(GameUpdateResult, 'PLOCK_TRANSI_INVISIBLE', {
  value: 1,
  writable : false,
  enumerable : false,
  configurable : false
});
Object.defineProperty(GameUpdateResult, 'PLOCK_TRANSI_LOCK', {
  value: 2,
  writable : false,
  enumerable : false,
  configurable : false
});
