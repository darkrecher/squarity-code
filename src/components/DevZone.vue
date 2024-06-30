<template>
  <div ref="devZone" class="dev-zone">
    <div class="links-and-exemples">
      <div>
        <a href="https://discord.gg/D5SYnk8u3j" target="_blank">
          <img class="discord" src="../assets/discord.svg" alt="Logo discord">
        </a>
      </div>
      <div>
        <a href="https://mstdn.io/@recher" target="_blank">
          <img class="mastodon" src="../assets/mastodon.svg" alt="Logo mastodon">
        </a>
      </div>
      <div class="game-examples">
        <div>
          Exemples de jeu :
          <!-- https://stackoverflow.com/questions/56523600/how-to-use-an-image-as-a-button-in-vue-js -->
          <img src="../assets/magicien_icon.png" @click="exampleMagician">
          <img src="../assets/h2o_icon.png" @click="exampleH2o">
          <img src="../assets/tunnel_match_icon.png" @click="exampleTunnelMatch">
        </div>
      </div>
    </div>
    <div class="dev-field-url">
      Url de l'image :
      <input ref="urlTileset" type="text">
      <button @click="sendGameSpec">
        Exécuter &#x25B6;
      </button>
    </div>
    <div class="dev-field-label">
      Config du jeu (en JSON).
    </div>
    <div class="dev-field-json">
      <textarea ref="jsonConf" spellcheck="false" />
    </div>
    <div class="dev-field-label">
      Le code du jeu (en python).
    </div>
    <div class="dev-field-python">
      <textarea ref="gameCode" spellcheck="false" />
    </div>
  </div>
</template>

<script>

import gameExamples from '../classes/GameExamples';
import gameSpecLoader from '../classes/GameSpecLoader';
import MAGICIAN_URL_TILESET from '../assets/dungeon_tiles_2.png';
import H2O_URL_TILESET from '../assets/h2o_tileset2.png';
import TUNNEL_MATCH_URL_TILESET from '../assets/tunnel_match_tileset.png';

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

    exampleMagician() {
      this.$refs.urlTileset.value = MAGICIAN_URL_TILESET;
      this.$refs.jsonConf.value = gameExamples.MAGICIAN_JSON_CONF;
      this.$refs.gameCode.value = gameExamples.MAGICIAN_GAME_CODE;
      this.activateCurrentGameSpec();
    },

    exampleH2o() {
      this.$refs.urlTileset.value = H2O_URL_TILESET;
      this.$refs.jsonConf.value = gameExamples.H2O_JSON_CONF;
      this.$refs.gameCode.value = gameExamples.H2O_GAME_CODE;
      this.activateCurrentGameSpec();
    },

    exampleTunnelMatch() {
      this.$refs.urlTileset.value = TUNNEL_MATCH_URL_TILESET;
      this.$refs.jsonConf.value = gameExamples.TUNNEL_MATCH_JSON_CONF;
      this.$refs.gameCode.value = gameExamples.TUNNEL_MATCH_GAME_CODE;
      this.activateCurrentGameSpec();
    },

    async fetchGameSpecFromLocHash() {
      // Pour tester :
      // http://localhost:8080/#fetchez_githubgist_darkrecher/bd49300f9c480b789a70315155571e9d/raw/game_code.txt
      const locHash = window.location.hash;
      if (!locHash) {
        this.exampleMagician();
        return;
      }
      if (locHash === '#fetchez_example_h2o') {
        this.exampleH2o();
        return;
      }
      if (locHash === '#fetchez_example_tunnel_match') {
        this.exampleTunnelMatch();
        return;
      }
      const urlGameSpec = gameSpecLoader.urlGameSpecFromLocHash(locHash);
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

.links-and-exemples {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.links-and-exemples img {
  padding-left: 0.3em;
  padding-right: 0.3em;
}

/* Crétins de svg qui ont pas la même taille apparente. */
img.discord {
  height: 2.5em;
}

img.mastodon {
  height: 2em;
}

.game-examples {
  padding-bottom: 0.8em;
}

.game-examples div {
  display: flex;
  align-items: center;
}

.game-examples img {
  background-color: #505050;
  border: 1px solid #A0A0A0;
  height: 3em;
  padding: 0.3em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  cursor: pointer;
}

.game-examples img:hover {
  background-color: #909090;
}

.dev-field-url {
  display: flex;
  border-top: 2px solid #C0C0C0;
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
