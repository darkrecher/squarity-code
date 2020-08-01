<template>
  <div class="game-user-code">
    <div>
      Url de l'image tileset.
    </div>
    <div>
      <input
        ref="urltileset"
        type="text"
      >
    </div>
    <div>
      Coordonnées des images du tileset (en JSON).
    </div>
    <div>
      <textarea
        ref="coordstileset"
        cols="100"
        rows="10"
        spellcheck="false"
      />
    </div>
    <div>
      Le code du jeu.
    </div>
    <div>
      <textarea
        ref="usercode"
        cols="100"
        rows="35"
        spellcheck="false"
      />
    </div>
    <div>
      <button @click="sendCode">
        &lt;&lt;&lt; Envoyer le code
      </button>
    </div>
  </div>
</template>

<script>

import gameExamples from '../classes/gameExamples';

// Je suis obligé de mettre ça la, parce que je peux pas appeler require dans gameExamples.js
// Et je peux pas définir l'url relative ailleurs, parce que require nécessite
// obligatoirement des strings literals.
// Cochonnerie de javascript en vrac qui met du bazar partout.
const GAME_MAGICIAN_URL_TILESET = require('../assets/dungeon_tiles_2.png');

export default {
  name: 'GameUserCode',

  props: {
  },

  mounted() {
    this.$refs.urltileset.value = GAME_MAGICIAN_URL_TILESET;
    this.$refs.coordstileset.value = gameExamples.GAME_MAGICIAN_COORDS_TILESET;
    this.$refs.usercode.value = gameExamples.GAME_MAGICIAN_USER_CODE;
  },

  methods: {
    sendCode() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/6535686-emit-events-to-parent-components
      // TODO : est-ce que la fonction $emit envoie l'événement à tout le monde,
      // ou uniquement au component parent ?
      // Je me suis cassé les fesses à organiser les composents GameBoard et GameUserCode
      // en hiérarchie parent-enfant.
      // je trouve ça un peu étrange. Si j'ai fait ça pour rien, c'est naze.
      this.$emit(
        'update-user-code',
        this.$refs.urltileset.value,
        this.$refs.coordstileset.value,
        this.$refs.usercode.value,
      );
    },

  },
};
</script>

<style scoped>
  textarea {
    background-color: #202020;
    color: #C0C0C0;
    margin-bottom: 1em;
  }
</style>
