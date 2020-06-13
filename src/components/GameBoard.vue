<template>
  <div class="game-board">
    <h1>{{ msg }}</h1>
    <div>{{ message}}</div>
    <!-- Canvas -->
    <canvas id="c"></canvas>
    <!-- Add Rectangle Button -->
    <div>
      <button @click="drawRect">Add Rect</button>
      <button @click="subWidth">-</button>
      <button @click="addWidth">+</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// Inspiration globale :
// https://codepen.io/integrateus/pen/dyyVbJZ

export default Vue.extend({
  name: 'GameBoard',
  props: {
    msg: String
  },

  // TODO : ça fait plein d'erreurs dans les logs du serveur web. Je regarderais ça demain.
  // Mais sinon, ça marche quand même.

  data: function () {
    return {
      message: 'Vue + Canvas API',
      vueCanvas: CanvasRenderingContext2D,
      rectWidth: 200
    }
  },

  mounted () {
    const c = document.getElementById('c') as HTMLCanvasElement
    const ctx = c.getContext('2d')
    this.vueCanvas = ctx
  },

  methods: {
    drawRect () {
      // clear canvas
      this.vueCanvas.clearRect(0, 0, 400, 200)
      // draw rect
      this.vueCanvas.beginPath()
      this.vueCanvas.rect(20, 20, this.rectWidth, 100)
      this.vueCanvas.stroke()
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

})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .game-board {
    padding: 20px;
    margin: 20px;
  }

  #c {
    height: 200px;
    width: 400px;
    border: 1px solid gray;
  }

</style>
