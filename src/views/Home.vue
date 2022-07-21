<template>
  <div class="home">
    <GameBoard />
  </div>
</template>

<script>
// @ is an alias to /src.
// Sauf qu'avec moi, ça marche pas, alors je mets un "../" de gros dégeulâsse.
import GameBoard from '../components/GameBoard.vue';

export default {
  name: 'Home',
  components: {
    GameBoard,
  },
};
</script>
