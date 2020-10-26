<template>
  <div
    class="dev-zone"
    ref="devzone"
  >
    <div>
      <button @click="example_magician">
        Ex 1 : Le magicien faiseur de ponts
      </button>
      &nbsp;&nbsp;
      <button @click="example_h2o">
        Ex 2 : Les aventures de H2O
      </button>
      <br> <!-- TODO : arrêter de faire nimp' avec les BR. -->
      <a
        href="https://github.com/darkrecher/squarity-doc/blob/master/user_manual/main_page.md"
        target="_blank"
      >
        Comment créer ses jeux.
      </a>
    </div>
    <br>
    <div>
      Url de l'image tileset :
      <!--
        TODO : c'est quoi la préconisation pour les noms de ref ?
        Camel case ? lower case ?
        Je peux faire ce que je veux ?
      -->
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
        &lt;&lt;&lt; Envoyer le jeu
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
const H2O_URL_TILESET = require('../assets/h2o_tileset.png');

export default {
  name: 'DevZone',

  props: {
  },

  mounted() {
    console.log('juste pour dire coucou');

    const elemDevZone = this.$refs.devzone;
    elemDevZone.addEventListener('keydown', this.on_key_down);
  },

  destroyed() {
    // TODO : duplicate code avec le composant GameBoard.vue.
    // Et c'est tellement un truc à la con que ce serait bien de trouver un moyen de factoriser ça.
    // Au moins, j'aurais ce truc à la con à un seul endroit, et pas dans tous mes components.
    const elemDevZone = this.$refs.devzone;
    if (elemDevZone) {
      elemDevZone.removeEventListener('keydown', this.on_key_down);
    }
  },

  methods: {

    activate_current_game_spec() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/6535686-emit-events-to-parent-components
      // TODO : est-ce que la fonction $emit envoie l'événement à tout le monde,
      // ou uniquement au component parent ?
      // Je me suis cassé les fesses à organiser les composents GameBoard et DevZone
      // en hiérarchie parent-enfant alors que je trouvais ça étrange.
      // Si j'ai fait ça pour rien, c'est naze.
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
      // http://localhost:8080/#fetchez_pastebin_2QjANjCU
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
        // TODO : Mettre ce message dans la console du jeu, quand y'en aura une.
        console.log('Le hash de l\'url ne correspond pas à un lien vers une définition de jeu.');
      } else {
        const gameSpec = await gameSpecLoader.fetch_game_spec(urlGameSpec);
        if (gameSpec === null) {
          // TODO : Mettre ce message dans la console du jeu, quand y'en aura une.
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
      // (Quand même pas de ma faute si le javascript une gestion d'appuis de touches de prolo).
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
  textarea {
    background-color: #202020;
    color: #C0C0C0;
    margin-bottom: 1em;
    font-family: monospace;
  }
</style>
