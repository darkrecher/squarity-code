<template>
  <div ref="devZone" class="dev-zone">
    <div class="dev-field-url">
      Url de l'image :&nbsp;
      <input ref="urlTileset" type="text">
      <button @click="sendGameSpec">
        Exécuter &#x25B6;
      </button>
    </div>
    <div class="dev-field-label">
      Config du jeu (en JSON) :
    </div>
    <div class="dev-field-json">
      <textarea ref="jsonConf" spellcheck="false" />
    </div>
    <div class="dev-field-label">
      Le code du jeu (en python) :
    </div>
    <div class="dev-field-python">
      <textarea ref="gameCode" spellcheck="false" />
    </div>
  </div>
</template>

<script>

// TODO: si l'url de l'image n'est pas absolue,
// on ajoute manuellement le nom de domaine dans la zone de texte.
// Ça permet de montrer clairement que c'est une url et qu'on peut
// en mettre une autre, hébergée sur un autre site.

import gameSpecLoader from '../classes/GameSpecLoader';

export default {
  name: 'DevZone',

  props: {
  },

  mounted() {
    this.$refs.devZone.addEventListener('keydown', this.onKeyDown);
  },

  unmounted() {
    const elemDevZone = this.$refs.devZone;
    if (elemDevZone) {
      elemDevZone.removeEventListener('keydown', this.onKeyDown);
    }
  },

  methods: {

    activateCurrentGameSpec() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/
      // 6535686-emit-events-to-parent-components
      this.$emit(
        'updateGameSpec',
        this.$refs.urlTileset.value,
        this.$refs.jsonConf.value,
        this.$refs.gameCode.value,
      );
    },

    sendGameSpec() {
      this.activateCurrentGameSpec();
    },

    async fetchGameSpecFromLocHash() {

      const locHash = window.location.hash;
      let urlGameSpec;
      if (!locHash) {
        urlGameSpec = gameSpecLoader.getDefaultGameSpecUrl();
      } else {
        urlGameSpec = gameSpecLoader.urlGameSpecFromLocHash(locHash);
      }

      if (urlGameSpec === null) {
        console.log('Le hash de l\'url ne correspond pas à un lien vers une définition de jeu.');
      } else {
        const gameSpec = await gameSpecLoader.fetchGameSpec(urlGameSpec);
        if (gameSpec === null) {
          console.log('Le texte récupéré ne correspond pas à une définition de jeu.');
        } else {
          this.$refs.urlTileset.value = gameSpec.urlTileset;
          this.$refs.jsonConf.value = gameSpec.jsonConf;
          this.$refs.gameCode.value = gameSpec.gameCode;
          this.activateCurrentGameSpec();
        }
      }

    },

    onKeyDown(e) {
      // L'événement sera déclenché plusieurs fois si on reste appuyé sur les touches Ctrl+Entrée.
      // C'est pourri. Mais osef.
      // (Quand même pas de ma faute si le javascript a une gestion d'appuis de touches de prolo).
      //
      // https://stackoverflow.com/questions/905222/enter-key-press-event-in-javascript
      if (e.ctrlKey && e.key === 'Enter') {
        this.activateCurrentGameSpec();
        e.preventDefault();
      }
    },

  },
};
</script>

<style scoped>
.dev-zone {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding-left: 0.2em;
  padding-right: 2em;
}

.dev-field-url {
  display: flex;
  padding-top: 0.6em;
}

.dev-field-url input {
  background-color: #202020;
  color: #C0C0C0;
  font-family: monospace;
  border: 1px solid #808080;
  flex: 1 1 auto;
  margin-right: 0.6em;
}

.dev-field-label {
  text-align: left;
  margin-top: 0.6em;
}

.dev-field-python {
  flex: 3 1 auto;
}

.dev-field-json {
  flex: 1 1 auto;
}

textarea {
  width: 100%;
  height: 100%;
  background-color: #202020;
  color: #C0C0C0;
  font-family: monospace;
  border: 1px solid #808080;
}

button {
  background-color: #909090;
  color: black;
  padding: 3px 3px 0px 3px;
}

</style>
