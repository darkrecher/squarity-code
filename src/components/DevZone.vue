<template>
  <div
    ref="devzone"
    class="devzone"
  >
    <div>
      <button @click="example_magician">
        Ex 1 : Le magicien faiseur de ponts
      </button>
      &nbsp;&nbsp;
      <button @click="example_h2o">
        Ex 2 : Les aventures de H2O
      </button>
    </div>
    <div class="doc-link">
      <a
        href="https://github.com/darkrecher/squarity-doc/blob/master/user_manual/main_page.md"
        target="_blank"
      >
        Comment créer ses jeux.
      </a>
    </div>
    <div>
      Url de l'image tileset :
      <input
        ref="urltileset"
        type="text"
      >
    </div>
    <div>
      Config du jeu (en JSON).
    </div>
    <div>
      <textarea
        ref="jsonconf"
        cols="100"
        rows="8"
        spellcheck="false"
      />
    </div>
    <div>
      Le code du jeu (en python).
    </div>
    <div>
      <textarea
        ref="gamecode"
        cols="100"
        rows="22"
        spellcheck="false"
      />
    </div>
    <div>
      <button @click="send_game_spec">
        &lt;&lt;&lt; Exécuter le jeu
      </button>
    </div>
  </div>
</template>

<script>

import gameExamples from '../classes/gameExamples';
import gameSpecLoader from '../classes/gameSpecLoader';

// Je suis obligé de mettre ça là, parce que je peux pas appeler require dans gameExamples.js
// Et je peux pas définir l'url relative ailleurs, parce que require nécessite
// obligatoirement des strings literals.
// Cochonnerie de javascript en vrac qui met du bazar partout.
const MAGICIAN_URL_TILESET = require('../assets/dungeon_tiles_2.png');
const H2O_URL_TILESET = require('../assets/h2o_tileset2.png');

export default {
  name: 'DevZone',

  props: {
  },

  mounted() {
    this.$refs.devzone.addEventListener('keydown', this.on_key_down);
  },

  destroyed() {
    const elemDevZone = this.$refs.devzone;
    if (elemDevZone) {
      elemDevZone.removeEventListener('keydown', this.on_key_down);
    }
  },

  methods: {

    activate_current_game_spec() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/6535686-emit-events-to-parent-components
      this.$emit(
        'update-game-spec',
        this.$refs.urltileset.value,
        this.$refs.jsonconf.value,
        this.$refs.gamecode.value,
      );
    },

    send_game_spec() {
      this.activate_current_game_spec();
    },

    example_magician() {
      this.$refs.urltileset.value = MAGICIAN_URL_TILESET;
      this.$refs.jsonconf.value = gameExamples.MAGICIAN_JSON_CONF;
      this.$refs.gamecode.value = gameExamples.MAGICIAN_GAME_CODE;
      this.activate_current_game_spec();
    },

    example_h2o() {
      this.$refs.urltileset.value = H2O_URL_TILESET;
      this.$refs.jsonconf.value = gameExamples.H2O_JSON_CONF;
      this.$refs.gamecode.value = gameExamples.H2O_GAME_CODE;
      this.activate_current_game_spec();
    },

    async fetch_game_spec_from_loc_hash() {
      // Pour tester :
      // http://localhost:8080/#fetchez_githubgist_darkrecher/bd49300f9c480b789a70315155571e9d/raw/gamecode.txt
      const locHash = window.location.hash;
      if (!locHash) {
        this.example_magician();
        return;
      }
      if (locHash === '#fetchez_example_h2o') {
        this.example_h2o();
        return;
      }
      const urlGameSpec = gameSpecLoader.url_game_spec_from_loc_hash(locHash);
      if (urlGameSpec === null) {
        console.log('Le hash de l\'url ne correspond pas à un lien vers une définition de jeu.');
      } else {
        const gameSpec = await gameSpecLoader.fetch_game_spec(urlGameSpec);
        if (gameSpec === null) {
          console.log('Le texte récupéré ne correspond pas à une définition de jeu.');
        } else {
          this.$refs.urltileset.value = gameSpec.urlTileset;
          this.$refs.jsonconf.value = gameSpec.jsonConf;
          this.$refs.gamecode.value = gameSpec.gameCode;
          this.activate_current_game_spec();
        }
      }
    },

    on_key_down(e) {
      // L'événement sera déclenché plusieurs fois si on reste appuyé sur les touches Ctrl+Entrée.
      // C'est pourri. Mais osef.
      // (Quand même pas de ma faute si le javascript a une gestion d'appuis de touches de prolo).
      //
      // https://stackoverflow.com/questions/905222/enter-key-press-event-in-javascript
      if (e.ctrlKey && e.key === 'Enter') {
        this.activate_current_game_spec();
        e.preventDefault();
      }
    },

  },
};
</script>

<style scoped>
  .doc-link {
    padding-bottom: 1em;
  }

  textarea {
    background-color: #202020;
    color: #C0C0C0;
    margin-bottom: 1em;
    font-family: monospace;
  }
</style>
