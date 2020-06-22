<template>
  <div class="gameboard">
    <p>{{ msg}}</p>
    <p>{{ message }}</p>

    <canvas id="c"></canvas>
    <div>
      <button @click="drawRect">Add Rect</button>
      <button @click="subWidth">-</button>
      <button @click="addWidth">+</button>
    </div>

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
      tileWidth: 40,
      tileHeight: 40,
      oneImage: null
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
    nodeCanvas.height = 400
    this.drawRect()
  },

  methods: {

    async drawRect () {

      // clear canvas
      this.ctxCanvas.fillStyle = '#000000'
      this.ctxCanvas.fillRect(0, 0, 600, 400)
      let canvasX = 0
      let canvasY = 0

      this.oneImage = await loadImage(require('../assets/logo.png'))

      for (let y = 0; y < this.boardModel.h; y++) {
        for (let x = 0; x < this.boardModel.w; x++) {
          if (this.boardModel.getTile(x, y)) {
            this.ctxCanvas.fillStyle = '#007000'
          } else {
            this.ctxCanvas.fillStyle = '#B00000'
          }
          this.ctxCanvas.fillRect(canvasX, canvasY, this.tileWidth, this.tileHeight)
          if (this.boardModel.getTile(x, y)) {
            this.ctxCanvas.drawImage(this.oneImage, canvasX, canvasY, this.tileWidth, this.tileHeight)
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
