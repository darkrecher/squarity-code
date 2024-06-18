export default class GobjState {
  /*
   * Cette classe contient toutes les caractéristiques pour dessiner un objet à un instant donné.
   * Les caractéristiques peuvent être modifiées par des transitions.
   */
  constructor(x, y, spriteName) {
    this.x = x;
    this.y = y;
    this.spriteName = spriteName;
  }

  clone() {
    return new GobjState(this.x, this.y, this.spriteName);
  }

}
