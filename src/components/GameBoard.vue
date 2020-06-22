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
      tileWidth: 20,
      tileHeight: 20,
      oneImage: new Image(30, 30)
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

    drawRect () {

      // clear canvas
      this.ctxCanvas.fillStyle = '#000000'
      this.ctxCanvas.fillRect(0, 0, 600, 400)
      let canvasX = 0
      let canvasY = 0

      for (let y = 0; y < this.boardModel.h; y++) {
        for (let x = 0; x < this.boardModel.w; x++) {
          if (this.boardModel.getTile(x, y)) {
            this.ctxCanvas.fillStyle = '#00A000'
          } else {
            this.ctxCanvas.fillStyle = '#B00000'
          }
          this.ctxCanvas.fillRect(canvasX, canvasY, this.tileWidth, this.tileHeight)
          canvasX += this.tileWidth
        }
        canvasX = 0
        canvasY += this.tileHeight
      }

      // TODO : asynchronisme à la con qu'il va falloir gérer mieux que ça.
      this.oneImage.onload = () => {
        console.log('bordel onload zz')
        this.ctxCanvas.drawImage(this.oneImage, 0, 0, 50, 50)
      }
      this.oneImage.src = require('../assets/logo.png')

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
