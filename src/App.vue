<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <GameBoard msg="Ici il y a mon board" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import GameBoard from './components/GameBoard.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    GameBoard,
  },
};
</script>

<style>

body {
  background-color: #101010;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #C0C0C0;
  margin-top: 10px;
  background-color: #101010;
}

a {
  color: #A0A0D0;
}

</style>
