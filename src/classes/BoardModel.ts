class BoardModel {
  private a: number
  readonly w: number
  readonly h: number
  private tiles: number[][]

  constructor (width = 12, height = 10) {
    this.w = width
    this.h = height
    this.a = 7

    this.tiles = []
    for (let y = 0; y < this.h; y++) {
      this.tiles[y] = []
      for (let x = 0; x < this.w; x++) {
        this.tiles[y][x] = (x + y) % 2
      }
    }
  }

  getTile (x: number, y: number) {
    return this.tiles[y][x]
  }

  getA () {
    return this.a
  }

  getTheA () {
    return this.a * 2
  }

  testVetur () {
    return 'pouet'
  }
}

export default BoardModel
