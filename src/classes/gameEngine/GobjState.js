export default class GobjState {
  /*
   * Cette classe contient toutes les caractéristiques pour dessiner un objet à un instant donné.
   * Les caractéristiques peuvent être modifiées par des transitions.
   */
  constructor(x, y, sprite_name) {
    this.x = x;
    this.y = y;
    this.sprite_name = sprite_name;
  }

  clone() {
    return new GobjState(this.x, this.y, this.sprite_name);
  }

}
