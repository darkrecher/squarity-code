<template>
  <div class="gameboard">
    <p>{{ msg}} - {{ message }}</p>

    <canvas id="c"></canvas>
    <div>
      <button @click="drawRect">Add Rect</button>
      <button @click="subWidth">-</button>
      <button @click="addWidth">+</button>
    </div>

    <p>
      Tileset créé par Buch :
      <br>
      <a href="https://opengameart.org/users/buch">https://opengameart.org/users/buch</a>
    </p>

  </div>
</template>

<script>

import BoardModel from '../classes/BoardModel'

// https://stackoverflow.com/questions/46399223/async-await-in-image-loading
// https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5577676-gerez-du-code-asynchrone
// TODO : dans une lib de code générique ?
function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default {
  name: 'GameBoard',

  props: {
    msg: String
  },

  data: function () {
    return {
      message: 'Vue + Canvas API',
      ctxCanvas: null,
      boardModel: new BoardModel(),
      rectWidth: 200,
      tileWidth: 32,
      tileHeight: 32,
      tileAtlas: null,
      coordImgFromData: {
        '0': [48, 32],
        '1': [96, 32],
        '2': [96, 48],
        '3': [96, 96],
        '4': [48, 96],
        '5': [32, 96],
        '6': [32, 48],
        '7': [32, 32],
        '8': [48, 48],
        'W': [88, 208],
        '|': [165, 132],
        '-': [142, 132],
        'V': [32, 336],
        'v': [32, 352],
        'y': [32, 143],
        's': [216, 64],
        'D': [156, 212],
      }
    }
  },

  mounted () {
    const nodeCanvas = document.getElementById('c')
    this.ctxCanvas = nodeCanvas.getContext('2d')
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de dessin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // TODO : il faudra quand même l'adapter à la taille de la fenêtre,
    //        et aux proportions du BoardModel aussi.
    nodeCanvas.width = 600
    nodeCanvas.height = 448
    this.drawRect()
  },

  methods: {

    async drawRect () {

      // clear canvas
      this.ctxCanvas.fillStyle = '#000000'
      this.ctxCanvas.fillRect(0, 0, 640, 448)
      let canvasX = 0
      let canvasY = 0

      this.tileAtlas = await loadImage(require('../assets/dungeon_tiles_2.png'))

      for (let y = 0; y < this.boardModel.h; y++) {
        for (let x = 0; x < this.boardModel.w; x++) {
          let tileData = this.boardModel.getTile(x, y)
          if (tileData != ' ') {
            let coordImg = this.coordImgFromData[tileData]
            // console.log("coordImg", coordImg)
            this.ctxCanvas.drawImage(this.tileAtlas, coordImg[0], coordImg[1], 16, 16, canvasX, canvasY, this.tileWidth, this.tileHeight)
          }
          canvasX += this.tileWidth
        }
        canvasX = 0
        canvasY += this.tileHeight
      }

    },

    addWidth () {
      this.rectWidth += 10
      this.drawRect()
    },

    subWidth () {
      this.rectWidth -= 10
      this.drawRect()
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #c {
    width: 600px;
    height: 400px;
    border: 1px solid gray;
  }

</style>
