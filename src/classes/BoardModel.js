class BoardModel {
  static moveFromDir = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0],
  };

  constructor(width = 20, height = 14) {
    this.w = width;
    this.h = height;

    // TODO : Le Linter ne gueule pas alors que j'ai mis du snake case ? WTF ?
    this.magician_x = 4;
    this.magician_y = 3;

    const strTiles = [
      '     701     70001  ',
      '     682-----68882  ',
      '     543     54443  ',
      '     V|V     WDDVV  ',
      '     v|v     543vv  ',
      '      |      yyy    ',
      '    7001            ',
      ' 70068821           ',
      ' 588544381          ',
      ' y68WsWW8801        ',
      ' 78888888882----71  ',
      ' 54888888843    53  ',
      ' yy5444443yy    yy  ',
      '   yyyyyyy          ',
    ];

    this.tiles = [];
    for (let y = 0; y < this.h; y += 1) {
      this.tiles[y] = strTiles[y].split('');
    }
  }

  getTile(x, y) {
    if ((x === this.magician_x) && (y === this.magician_y)) {
      return 'M';
    }
    return this.tiles[y][x];
  }

  sendGameAction(actionType) {
    // TODO : un enum avec actionType, mais je sais pas comment on fait ça en JS.
    if (actionType in BoardModel.moveFromDir) {
      const moveCoord = BoardModel.moveFromDir[actionType];
      console.log(moveCoord);
      const MagicianNewCoordX = this.magician_x + moveCoord[0];
      const MagicianNewCoordY = this.magician_y + moveCoord[1];
      // Le in-bounds sera de toute façon géré par le code spécifique du jeu.
      // Donc on laisse ce code moche ici, puisqu'il partira.
      if (
        (MagicianNewCoordX >= 0) && (MagicianNewCoordX < this.w)
        && (MagicianNewCoordY >= 0) && (MagicianNewCoordY < this.h)
      ) {
        this.magician_x = MagicianNewCoordX;
        this.magician_y = MagicianNewCoordY;
      }
    }
  }
}

export default BoardModel;
