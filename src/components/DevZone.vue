<template>
  <div ref="dev_zone" class="dev_zone">
    <div class="links_and_exemples">
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
      <div class="game_examples">
        <div>
          Exemples de jeu :
          <!-- https://stackoverflow.com/questions/56523600/how-to-use-an-image-as-a-button-in-vue-js -->
          <img src="../assets/magicien_icon.png" @click="example_magician">
          <img src="../assets/h2o_icon.png" @click="example_h2o">
          <img src="../assets/tunnel_match_icon.png" @click="example_tunnel_match">
        </div>
      </div>
    </div>
    <div class="dev_field_url">
      Url de l'image :
      <input ref="url_tileset" type="text">
      <button @click="send_game_spec">
        Exécuter &#x25B6;
      </button>
    </div>
    <div class="dev_field_label">
      Config du jeu (en JSON).
    </div>
    <div class="dev_field_json">
      <textarea ref="json_conf" spellcheck="false" />
    </div>
    <div class="dev_field_label">
      Le code du jeu (en python).
    </div>
    <div class="dev_field_python">
      <textarea ref="game_code" spellcheck="false" />
    </div>
  </div>
</template>

<script>

import gameExamples from '../classes/gameExamples';
import gameSpecLoader from '../classes/gameSpecLoader';
import MAGICIAN_URL_TILESET from '../assets/dungeon_tiles_2.png';
import H2O_URL_TILESET from '../assets/h2o_tileset2.png';
import TUNNEL_MATCH_URL_TILESET from '../assets/tunnel_match_tileset.png';

export default {
  name: 'DevZone',

  props: {
  },

  mounted() {
    this.$refs.dev_zone.addEventListener('keydown', this.on_key_down);
  },

  unmounted() {
    const elemDevZone = this.$refs.dev_zone;
    if (elemDevZone) {
      elemDevZone.removeEventListener('keydown', this.on_key_down);
    }
  },

  methods: {

    activate_current_game_spec() {
      // https://openclassrooms.com/en/courses/5664336-create-a-web-application-with-vue-js/
      // 6535686-emit-events-to-parent-components
      this.$emit(
        'update_game_spec',
        this.$refs.url_tileset.value,
        this.$refs.json_conf.value,
        this.$refs.game_code.value,
      );
    },

    send_game_spec() {
      this.activate_current_game_spec();
    },

    example_magician() {
      this.$refs.url_tileset.value = MAGICIAN_URL_TILESET;
      this.$refs.json_conf.value = gameExamples.MAGICIAN_JSON_CONF;
      this.$refs.game_code.value = gameExamples.MAGICIAN_GAME_CODE;
      this.activate_current_game_spec();
    },

    example_h2o() {
      this.$refs.url_tileset.value = H2O_URL_TILESET;
      this.$refs.json_conf.value = gameExamples.H2O_JSON_CONF;
      this.$refs.game_code.value = gameExamples.H2O_GAME_CODE;
      this.activate_current_game_spec();
    },

    example_tunnel_match() {
      this.$refs.url_tileset.value = TUNNEL_MATCH_URL_TILESET;
      this.$refs.json_conf.value = gameExamples.TUNNEL_MATCH_JSON_CONF;
      this.$refs.game_code.value = gameExamples.TUNNEL_MATCH_GAME_CODE;
      this.activate_current_game_spec();
    },

    async fetch_game_spec_from_loc_hash() {
      // Pour tester :
      // http://localhost:8080/#fetchez_githubgist_darkrecher/bd49300f9c480b789a70315155571e9d/raw/game_code.txt
      const locHash = window.location.hash;
      if (!locHash) {
        // TODO WIP bleuargh.
        //this.example_magician();
        this.example_tunnel_match();
        return;
      }
      if (locHash === '#fetchez_example_h2o') {
        this.example_h2o();
        return;
      }
      if (locHash === '#fetchez_example_tunnel_match') {
        this.example_tunnel_match();
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
          this.$refs.url_tileset.value = gameSpec.url_tileset;
          this.$refs.json_conf.value = gameSpec.json_conf;
          this.$refs.game_code.value = gameSpec.game_code;
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
.dev_zone {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding-left: 0.2em;
  padding-right: 2em;
}

.links_and_exemples {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.links_and_exemples img {
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

.game_examples {
  padding-bottom: 0.8em;
}

.game_examples div {
  display: flex;
  align-items: center;
}

.game_examples img {
  background-color: #505050;
  border: 1px solid #A0A0A0;
  height: 3em;
  padding: 0.3em;
  margin-left: 0.5em;
  margin-right: 0.5em;
  cursor: pointer;
}

.game_examples img:hover {
  background-color: #909090;
}

.dev_field_url {
  display: flex;
  border-top: 2px solid #C0C0C0;
  padding-top: 0.6em;
}

.dev_field_url input {
  background-color: #202020;
  color: #C0C0C0;
  font-family: monospace;
  border: 1px solid #808080;
  flex: 1 1 auto;
  margin-right: 0.6em;
}

.dev_field_label {
  text-align: left;
  margin-top: 0.6em;
}

.dev_field_python {
  flex: 3 1 auto;
}

.dev_field_json {
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
