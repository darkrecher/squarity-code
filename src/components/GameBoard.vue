<template>
  <div class="game-board">
    <p>{{ msg }}</p>
    <p>{{ message}}</p>

    <canvas id="c"></canvas>

    <div>
      <button @click="drawRect">Add Rect</button>
      <button @click="subWidth">-</button>
      <button @click="addWidth">+</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import BoardModel from '../classes/BoardModel'

// Inspiration globale :
// https://codepen.io/integrateus/pen/dyyVbJZ

export default Vue.extend({
  name: 'GameBoard',
  props: {
    msg: String
  },

  data: function () {
    return {
      message: 'Vue + Canvas API',
      vueCanvas: null as CanvasRenderingContext2D | null,
      boardModel: new BoardModel(),
      rectWidth: 200,
      tileWidth: 20,
      tileHeight: 20
    }
  },

  mounted () {
    const c = document.getElementById('c') as HTMLCanvasElement
    const ctx = c.getContext('2d')
    this.vueCanvas = ctx as CanvasRenderingContext2D
    this.boardModel = new BoardModel()
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de desin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // TODO : il faudra quand même l'adapter à la taille de la fenêtre,
    //        et aux proportions du BoardModel aussi.
    c.width = 600
    c.height = 400
    this.drawRect()
  },

  methods: {

    drawRect () {
      // TODO : ça va être super relou si faut checker le not null pour chaque objet.
      // Surtout si c'est des objets qu'on est sûr qu'ils sont pas null,
      // puisque initialisés comme il faut dès l'exécution de "mounted"
      if (this.vueCanvas != null) {
        // clear canvas
        this.vueCanvas.fillStyle = '#000000'
        this.vueCanvas.fillRect(0, 0, 600, 400)
        let canvasX = 0
        let canvasY = 0

        for (let y = 0; y < this.boardModel.h; y++) {
          for (let x = 0; x < this.boardModel.w; x++) {
            this.vueCanvas.fillStyle = '#' + String((x + 1) * (y + 1) * 9)
            this.vueCanvas.fillRect(canvasX, canvasY, this.tileWidth, this.tileHeight)
            canvasX += this.tileWidth
          }
          canvasX = 0
          canvasY += this.tileHeight
        }
      }
    },

    addWidth () {
      this.rectWidth += 10
      this.drawRect()
      console.log(this.boardModel.getTheA() * 2)
    },

    subWidth () {
      this.rectWidth -= 10
      this.drawRect()
    }

  }

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #c {
    width: 600px;
    height: 400px;
    border: 1px solid gray;
  }

</style>
