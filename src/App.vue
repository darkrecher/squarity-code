<template>
  <div id="app">
    <MainTitle />
    <GameBoard />
  </div>
</template>

<script>
import MainTitle from './components/MainTitle.vue';
import GameBoard from './components/GameBoard.vue';

export default {
  name: 'App',
  components: {
    MainTitle,
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
}

a {
  color: #A0A0D0;
}

</style>
