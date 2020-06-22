<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <GameBoard msg="Ici il y a mon board"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import GameBoard from './components/GameBoard.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    GameBoard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
