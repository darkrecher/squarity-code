<template>
  <div class="game_board"><v-container fluid>
    <!--
      https://stackoverflow.com/questions/25427407/bootstrap-3-and-4-container-fluid-with-grid-adding-unwanted-padding
    -->
    <v-row class="h-100 no-gutters">
      <v-col sm="12" md="6" order="2" order-sm="2" order-md="1" :class="{ hidden: hide_code }">
        <div class="flex-column h-100">
          <div class="d-none d-sm-none d-md-block">
            <MainTitle />
          </div>
          <div class="dev_notice">
            Fonctionne grâce à Pyodide.
            <a href="https://github.com/darkrecher/squarity-code" target="_blank">
              Code source
            </a>
            et
            <a href="https://github.com/darkrecher/squarity-doc" target="_blank">
              documentation
            </a>
            sur github.
            <router-link to="/roadmap">
              Lien vers la roadmap.
            </router-link>
          </div>
          <div class="flex-grow">
            <!--
              C'est cool les v-bind : https://vuejs.org/v2/guide/class-and-style.html
              Mais attention, faut pas écrire "v-bind". https://eslint.vuejs.org/rules/v-bind-style.html
            -->
            <div class="h-100">
              <DevZone ref="dev_zone" @update_game_spec="on_update_game_spec" />
            </div>
          </div>
        </div>
      </v-col>
      <v-col sm="12" :md="hide_code ? 12 : 6" order="1" order-sm="1" order-md="2">
        <!--
          Ne pas oublier le tabindex=0, sinon on peut pas choper les touches.
          https://laracasts.com/discuss/channels/vue/vuejs-listen-for-key-events-on-div
        -->
        <div ref="game_interface" class="game_interface flex-column" tabindex="0">
          <div ref="title_container" class="d-block d-sm-block d-md-none">
            <div :class="{ hidden: hide_code }">
              <MainTitle />
            </div>
          </div>
          <div ref="toggle_button" class="flex-grow-no full-screen-button">
            <button @click="toggle_dev_zone_display">
              Jeu en plein écran
            </button>
          </div>
          <div class="the_canvas flex-grow">
            <div class="flex-line h-100">
              <div class="flex-child-center w-100">
                <canvas v-show="loading_done" ref="game_canvas" @click="on_game_click"/>
                <ProgressIndicator v-if="!loading_done" ref="progress_indicator" />
              </div>
            </div>
          </div>
          <div ref="game_footer" class="game_footer flex-grow-no">
            <!-- https://getbootstrap.com/docs/4.1/utilities/flex/ -->
            <div>
              <div class="flex-grow-2">
                <textarea id="python_console" ref="python_console" readonly />
              </div>
              <!-- https://www.w3schools.com/charsets/ref_utf_arrows.asp -->
              <!--
                C'est dégueu de devoir répéter "disabled = is_player_locked" à chaque bouton.
                Mais c'est pas trop grave. Le HTML a le droit d'être dégueux,
                tant que c'est pas le JS. Je met pas de tâche dans Trello pour ça.
                Si un jour on a une solution tant mieux. Sinon, osef.
              -->
              <div class="flex-grow game_buttons">
                <div>
                  <div class="flex-grow" />
                  <div>
                    <button :disabled="is_player_locked" @click="go_left">
                      &#x21e6;
                    </button>
                  </div>
                  <div class="flex-column">
                    <button :disabled="is_player_locked" @click="go_up">
                      &#x21e7;
                    </button>
                    <button :disabled="is_player_locked" @click="go_down">
                      &#x21e9;
                    </button>
                  </div>
                  <div>
                    <button :disabled="is_player_locked" @click="go_right">
                      &#x21e8;
                    </button>
                  </div>
                  <div class="flex-grow-04" />
                  <div class="flex-column">
                    <button :disabled="is_player_locked" @click="action_1">
                      1
                    </button>
                    <button :disabled="is_player_locked" @click="action_2">
                      2
                    </button>
                  </div>
                  <div class="flex-grow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container></div>
  <!-- https://stackoverflow.com/questions/62227602/elements-in-iteration-expect-to-have-v-bindkey-directives-in-vueapp -->
  <template v-for="(item, index) in dummytab" :key="index">
    <div class="hidden">{{ item.dummyvar }}</div>
  </template>
</template>

<script>

import { loadScript } from "vue-plugin-load-script";
import MainTitle from './MainTitle.vue';
import DevZone from './DevZone.vue';
import ProgressIndicator from './ProgressIndicator.vue';
import libSquarityCodeV1 from '/squarity_v1.txt?raw'
import libSquarityCodeV2 from '/squarity_v2.txt?raw'
import GameEngineV1 from "../classes/gameEngineV1.js";
import GameEngineV2 from "../classes/gameEngineV2.js";

// https://stackoverflow.com/questions/46399223/async-await-in-image-loading
// https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5577676-gerez-du-code-asynchrone
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function isNonePython(val) {
  // Quand du code python renvoie None, la variable javascript prend la valeur "undefined"

  // https://www.tutorialrepublic.com/faq/how-to-determine-if-variable-is-undefined-or-null-in-javascript.php
  // La manière de vérifier si une variable est "undefined" en javascript est
  // vraiment dégueulasse, mais tout le monde fait comme ça.
  // "undefined" est un mot-clé de base du javascript, mais pour tester cette valeur,
  // il faut passer par un typeof et une comparaison de chaîne de caractères.
  // Tu te fous vraiment de ma gueule, javascript.
  return typeof val === 'undefined';
}

const eventNameFromButton = {
  ArrowUp: 'U',
  ArrowRight: 'R',
  ArrowDown: 'D',
  ArrowLeft: 'L',
  Digit1: 'action_1',
  Digit2: 'action_2',
  Numpad1: 'action_1',
  Numpad2: 'action_2',
};

export default {
  name: 'GameBoard',
  components: {
    MainTitle,
    DevZone,
    ProgressIndicator,
  },

  props: {},

  data() {
    return {
      loading_done: false,
      hide_code: false,
      is_player_locked: false,
      dummytab: [{dummyvar: 'dummy'}],
    };
  },

  async mounted() {

    this.canvasBuffer = document.createElement('canvas');
    this.current_url_tileset = '';
    this.tile_atlas = null;

    // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
    // C'est relou ces récupération d'appui de touches.
    // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
    const elemGameInterface = this.$refs.game_interface;
    elemGameInterface.addEventListener('keydown', this.on_key_down);

    window.languagePluginUrl = '/pyodide/v0.15.0/';
    this.show_progress('Téléchargement du téléchargeur.');
    // Si j'arrive jusqu'au bout avec cet astuce, je met 3000 upvotes à cette réponse :
    // https://stackoverflow.com/questions/45047126/how-to-add-external-js-scripts-to-vuejs-components
    // Et aussi à ce plugin, avec la doc qui va bien. Et qui est compatible Vue 3.
    // https://www.npmjs.com/package/vue-plugin-load-script
    //
    // Origine de ce fichier : https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js
    // Ce script js télécharge les fichiers suivants :
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.wasm
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.data.js
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.data
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.js
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/packages.json
    await loadScript('pyodide.js');
    this.show_progress('Iodification du python géant.');
    await window.languagePluginLoader;
    this.show_progress('Déballage de la cartouche du jeu.');

    // Et donc là, j'envoie un message à un autre component, qui va en retour me renvoyer
    // le message "update-game-spec" pour activer le jeu par défaut.
    // Tellement génial le javascript.
    this.$refs.dev_zone.fetch_game_spec_from_loc_hash();
    window.addEventListener('resize', this.handleResize);
  },

  updated() {
    // Cette fonction est appelée automatiquement par Vue,
    // mais pour ça, il faut qu'il y ait des "vraies" modifs dans le DOM.
    // Si c'est juste des classes qui changent, ça déclenche pas updated.
    // Mais quand la variable "dummytab" est modifiée, ça marche.
    this.handleResize();
  },

  unmounted() {
    const elemGameInterface = this.$refs.game_interface;
    // Je dois vérifier que elemGameInterface n'est pas Null.
    // Quand je recharge ma page, pas de problème.
    // Quand je modifie le code et que npm me recharge automatiquement la page
    // (d'une manière manifestement différente qu'un rechargement complet)
    // Ça me fait une erreur. Je sais pas pourquoi.
    // Osef, y'a qu'à checker.
    if (elemGameInterface) {
      elemGameInterface.removeEventListener('keydown', this.on_key_down);
    }
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {

    show_progress(msg) {
      if (!this.loading_done) {
        this.$refs.progress_indicator.add_progress_message(msg);
      }
    },

    onAfterGameEvent() {
      // Fonction de callback un peu mal foutue, que je dois transmettre à GameEngine.
      // Comme ça, si un événement de jeu a un effet sur le DOM
      // (en particulier, le lock des boutons du jeu), je peux le gérer ici.
      // Comme les événements de jeu peuvent être déclenchés tout seul
      // (avec delayed_event), il faut bien une callback.
      const playerLocsNew = this.game_engine.isPlayerLocked();
      if (this.is_player_locked !== playerLocsNew) {
        this.is_player_locked = playerLocsNew;
        if (!this.is_player_locked) {
          this.$refs.game_interface.focus();
        }
      }
    },

    handleResize() {
      // AVERTISSEMENT : c'est dégueulasse de faire comme ça,
      // mais j'ai pas trouvé de meilleure solution.
      // J'ai essayé en mettant des bouts de CSS de partout, des flex, des height 100%, etc.
      // Ça me pétait à la gueule à chaque fois.
      // Je hais le design de page web, je hais le CSS, putain de langage de zouzou !!

      const ratioFromWidthToHeight = this.game_engine.getRatioFromWidthToHeight();
      // nombre magique "96/100", à cause du 96vh que j'ai mis je-sais-plus-où.
      const Hscreen = window.innerHeight * (96 / 100);
      const Hfooter = this.$refs.game_footer.clientHeight;
      const Htitle = this.$refs.title_container.clientHeight;
      const HtoggleButton = this.$refs.toggle_button.clientHeight;
      const Hmargin = 10;

      let authorizedHeight = Hscreen - Hfooter - Htitle - HtoggleButton - Hmargin;
      // La taille autorisée, on peut la récupérer directement.
      // (J'espère que ça marche comme ça sur à peu près tous les navigateurs)
      let authorizedWidth = this.$refs.game_interface.clientWidth;

      const correspHeight = authorizedWidth * ratioFromWidthToHeight;
      let finalHeight = 0;
      let finalWidth = 0;
      if (correspHeight < authorizedHeight) {
        // On peut s'étendre en haut et en bas, mais pas sur les côtés.
        finalHeight = Math.floor(correspHeight);
        finalWidth = Math.floor(authorizedWidth);
      } else {
        // On peut s'étendre à gauche à droite, mais pas en haut en bas.
        finalHeight = Math.floor(authorizedHeight);
        finalWidth = Math.floor(authorizedHeight / ratioFromWidthToHeight);
      }

      this.$refs.game_canvas.style = `width: ${finalWidth}px; height: ${finalHeight}px;`;
    },

    send_game_event(eventName) {
      this.game_engine.sendGameEvent(eventName);
    },

    on_key_down(e) {
      // https://hacks.mozilla.org/2017/03/internationalize-your-keyboard-controls/
      // C'est quand même un peu le bazar la gestion des touches dans les navigateurs.
      if (e.code in eventNameFromButton) {
        const eventName = eventNameFromButton[e.code];
        this.send_game_event(eventName);
        e.preventDefault();
      }
    },

    on_game_click(e) {
      this.game_engine.onGameClick(e);
    },

    go_up() {
      this.send_game_event('U');
    },

    go_right() {
      this.send_game_event('R');
    },

    go_down() {
      this.send_game_event('D');
    },

    go_left() {
      this.send_game_event('L');
    },

    action_1() {
      this.send_game_event('action_1');
    },

    action_2() {
      this.send_game_event('action_2');
    },

    async on_update_game_spec(urlTileset, jsonConf, gameCode) {

      const json_conf = JSON.parse(jsonConf);
      let useV2 = true;
      if (Object.prototype.hasOwnProperty.call(json_conf, 'version')) {
        if (json_conf.version[0] == '1') {
          useV2 = false;
        } else if (json_conf.version[0] == '2') {
          useV2 = true;
        } else {
          const msg = `Version du moteur inconnue. (${json_conf.version})`;
          this.$refs.python_console.textContent = msg;
          return
        }
      } else {
        // TODO: inférence dégueu selon que le code comporte le texte
        // "class GameModel():" ou "class GameModel(GameModelBase):"
        console.log("Il manque la version");
        return
      }

      // Utilisation de la variable $refs pour récupérer tous les trucs référencés dans le template.
      // https://vuejs.org/v2/guide/migration.html#v-el-and-v-ref-replaced
      const canvasElem = this.$refs.game_canvas;
      if (useV2) {
        this.game_engine = new GameEngineV2(
          this.$refs.python_console,
          window.pyodide,
          this.onAfterGameEvent,
          canvasElem,
          this.canvasBuffer,
          libSquarityCodeV2
        );
      }
      else {
        this.game_engine = new GameEngineV1(
          this.$refs.python_console,
          window.pyodide,
          this.onAfterGameEvent,
          canvasElem,
          this.canvasBuffer,
          libSquarityCodeV1
        );
      }

      this.show_progress('Gloubiboulgatisation des pixels.');
      if (this.current_url_tileset !== urlTileset) {
        this.tile_atlas = await loadImage(urlTileset);
        this.current_url_tileset = urlTileset;
      }

      this.show_progress('Compilation de la compote.');
      this.$refs.python_console.textContent = '';

      const hasGameName = Object.prototype.hasOwnProperty.call(json_conf, 'name');
      if (hasGameName) {
        document.title = `Squarity - ${json_conf.name}`;
      } else {
        document.title = 'Squarity';
      }
      this.game_engine.updateGameSpec(this.tile_atlas, json_conf, gameCode);

      this.handleResize();
      this.game_engine.drawRect();
      this.is_player_locked = false;
      this.$refs.game_interface.focus();
      this.show_progress('C\'est parti !');
      this.loading_done = true;
    },

    toggle_dev_zone_display() {
      this.hide_code = !this.hide_code;
      // Si j'appelle handleResize tout de suite, ça marche pas car les valeurs clientWidth
      // des components n'ont pas été mises à jour.
      // Il faut déclencher un appel à la callback "updated".
      // Pour ça, on modifie une données de data, qui va modifier le DOM.
      // Alors en vrai, ça modifie pas le DOM, parce que je change même pas la valeur de dummytab.
      // Mais Vue crois que le DOM a été modifié, et ça lui suffit. (J'adore tous ces frameworks JavaScript).
      this.dummytab = [{dummyvar: 'dummy'}];
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
  color: #A0A0D0;
}

.flex-column {
  display: flex;
  flex-flow: column;
}

.flex-line {
  display: flex;
}

/*  C'est sûrement pas comme ça qu'il faudrait faire ces trucs.
    J'ai aucune idée des bonnes pratiques en CSS.
    De toutes façons c'est tellement un truc de hippie qu'il peut pas vraiment
    y avoir de bonnes pratiques là-dedans.
*/
.flex-grow {
  flex: 1 1 auto;
}

.flex-grow-no {
  flex: 0 1 auto;
}

.flex-grow-2 {
  flex: 2 1 auto;
}

.flex-grow-04 {
  flex: 0.4 1 auto;
}

.full-screen-button {
  text-align: right;
}

.full-screen-button button {
  background-color: #909090;
  color: black;
  padding: 3px 3px 0px 3px;
  margin-bottom: 5px;
}

.flex-child-center {
  align-self: center;
}

@media only screen and (max-width: 768px) {
  .game_footer button {
    height: 2em;
    width: 2em;
    font-size: 1.5em;
  }

  .dev_notice {
    margin-top: 1em;
  }
}

@media only screen and (min-width: 768px) {
  .game_footer button {
    height: 2em;
    width: 2em;
    font-size: 2em;
  }
}

.game_interface {
  /*  Faut jamais mettre 100vh. Au moindre pixel de trop,
      ça fait une scroll bar verticale de merde.
      hashtag-vive_les_magic_number_et_fuck_le_css
  */
  height: 96vh;
  /* https://stackoverflow.com/questions/2943548/how-to-reset-remove-chromes-input-highlighting-focus-border */
  outline: none;
}

.game_footer {
  margin-top: 5px;
}

.game_footer>div {
  display: flex;
  flex-wrap: wrap-reverse;
}

.game_footer button {
  background-color: #707070;
  font-weight: bold;
  border: 0;
  margin: 2px;
  padding: 0;
}

/* https://stackoverflow.com/questions/12591966/html-disabled-button-getting-active-css-pseudo-class */
.game_footer button:enabled:hover {
  background-color: #909090;
}

.game_footer button:enabled:active {
  background-color: #B0B0B0;
}

.game_footer button:disabled {
  background-color: #505050;
  color: #303030;
}

/* https://www.a11yproject.com/posts/2013-01-25-never-remove-css-outlines/ */
.game_footer button:focus {
  outline: thin dotted;
}

div.game_buttons {
  min-width: 10em;
}

div.game_buttons>div {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

div.game_buttons button {
  color: black;
}

canvas {
  border: 1px solid gray;
  image-rendering: pixelated;
}

div.hidden {
  width: 0%;
  display: none;
}

#python_console {
  width: 100%;
  height: 100%;
  border: 1px solid #808080;
}

textarea {
  background-color: #202020;
  color: #D0D0D0;
  font-size: 1.25em;
  font-family: monospace;
}

.dev_notice {
  font-size: 0.8em;
}

</style>
