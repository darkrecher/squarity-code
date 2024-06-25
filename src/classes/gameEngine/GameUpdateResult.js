import { PlayerLockTransi } from '../common/Constants.js';

export default class GameUpdateResult {

  /*
   * Cette classe contient les informations
   * renvoyées lorsqu'on met à jour l'affichage de l'aire de jeu,
   * soit parce qu'il y a eu un event (clic, touches, callback, ...)
   * soit parce qu'on est en train d'afficher des transitions.
   */
  constructor() {
    this.hasAnyTransition = false;
    this.PlockTransi = PlayerLockTransi.NoLock
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

