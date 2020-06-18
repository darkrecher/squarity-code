class BoardModel {
  private a: number
  readonly w: number
  readonly h: number

  constructor (width = 12, height = 10) {
    this.w = width
    this.h = height
    this.a = 7
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
