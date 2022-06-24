<template>
  <div class="home">
    <GameBoard />
    <router-link to="/about">
      Lien vers la future roadmap, yeah !!
    </router-link>
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
