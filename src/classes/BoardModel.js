class BoardModel {

  constructor (width = 12, height = 10) {
    this.w = width
    this.h = height

    this.tiles = []
    for (let y = 0; y < this.h; y++) {
      this.tiles[y] = []
      for (let x = 0; x < this.w; x++) {
        this.tiles[y][x] = (x + y) % 2
      }
    }
  }

  getTile (x, y) {
    return this.tiles[y][x]
  }

}

export default BoardModel
