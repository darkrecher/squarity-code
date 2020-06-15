<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App. Yipiii !"/>
    <GameBoard msg="Ici il y a mon board"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import GameBoard from './components/GameBoard.vue'
import BoardModel from './classes/BoardModel'

const bm = new BoardModel()
const x = bm.getTheA() + bm.testVetur()
// console.log(bm.getTheA())
console.log(x)

export default Vue.extend({
  name: 'App',
  components: {
    HelloWorld,
    GameBoard
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
