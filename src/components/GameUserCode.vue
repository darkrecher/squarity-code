<template>
  <div class="game-user-code">
    <div>
      Le code du jeu
    </div>
    <div>
      <textarea
        ref="usercode"
        name=""
        cols="100"
        rows="35"
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

export default {
  name: 'GameUserCode',

  props: {
  },

  mounted() {
    this.$refs.usercode.value = gameExamples.GAME_EXEMPLE_MAGICIAN;
  },

  methods: {
    sendCode() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/6535686-emit-events-to-parent-components
      // TODO : est-ce que la fonction $emit envoie l'événement à tout le monde,
      // ou uniquement au component parent ?
      // Je me suis cassé les fesses à organiser les composents GameBoard et GameUserCode
      // en hiérarchie parent-enfant.
      // je trouve ça un peu étrange. Si j'ai fait ça pour rien, c'est naze.
      this.$emit('update-user-code', this.$refs.usercode.value);
    },

  },
};
</script>

<style scoped>
/* TODO : zone de texte en fond gris avec texte blanc.
          Un marge en bas pour s'espacer avec le bouton d'envoi du code. */
</style>
