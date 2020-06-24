class BoardModel {

  constructor (width = 20, height = 14) {

    this.w = width
    this.h = height

    let strTiles = [
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
    ]

    this.tiles = []
    for (let y = 0; y < this.h; y++) {
      this.tiles[y] = strTiles[y].split('')
    }

  }

  getTile (x, y) {
    return this.tiles[y][x]
  }

}

export default BoardModel
