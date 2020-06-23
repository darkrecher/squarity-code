class BoardModel {

  constructor (width = 20, height = 14) {
    this.w = width
    this.h = height

    this.tiles = []
    for (let y = 0; y < this.h; y++) {
      this.tiles[y] = []
      for (let x = 0; x < this.w; x++) {
        this.tiles[y][x] = ' '
      }
    }
    // TODO : c'est moche, mais c'est pas grave.
    this.tiles[7] =  ' 70000001           '.split('')
    this.tiles[8] =  ' 588888881          '.split('')
    this.tiles[9] =  '  688888881         '.split('')
    this.tiles[10] = '  6888888881        '.split('')
    this.tiles[11] = ' 78888888882        '.split('')
    this.tiles[12] = ' 54888888843        '.split('')
    this.tiles[13] = '   5444443          '.split('')
  }

  getTile (x, y) {
    return this.tiles[y][x]
  }

}

export default BoardModel
