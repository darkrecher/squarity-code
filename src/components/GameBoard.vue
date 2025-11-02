<template>
  <div class="game-board"><v-container fluid>
    <!--
      https://stackoverflow.com/questions/25427407/bootstrap-3-and-4-container-fluid-with-grid-adding-unwanted-padding
    -->
    <v-row class="h-100 no-gutters">
      <v-col sm="12" md="6" order="2" order-sm="2" order-md="1" :class="{ hidden: !showCode }">
        <div class="flex-column h-100">
          <div class="d-none d-sm-none d-md-block">
            <MainTitle />
          </div>
          <div class="flex-grow">
            <!--
              C'est cool les v-bind : https://vuejs.org/v2/guide/class-and-style.html
              Mais attention, faut pas écrire "v-bind". https://eslint.vuejs.org/rules/v-bind-style.html
            -->
            <div class="h-100">
              <DevZone ref="devZone" @updateGameSpec="onUpdateGameSpec" />
            </div>
          </div>
        </div>
      </v-col>
      <v-col sm="12" :md="showCode ? 6 : 12" order="1" order-sm="1" order-md="2" class="no-padding-you-dumbass">
        <!--
          Ne pas oublier le tabindex=0, sinon on peut pas choper les touches.
          https://laracasts.com/discuss/channels/vue/vuejs-listen-for-key-events-on-div
        -->
        <div ref="gameInterface" class="game-interface flex-column" tabindex="0">
          <div ref="titleContainer" class="d-block d-sm-block d-md-none">
            <div :class="{ hidden: !showCode }">
              <MainTitle />
            </div>
          </div>
          <div class="flex-grow">
            <div class="flex-line h-100">
              <div class="flex-child-center w-100">
                <div v-show="visibleDescriptionAbove">
                  <div ref="descripAbove" class="descrip-above" :class="{ is_shrinking: shrinking }">
                    <div class="flex-line">
                      <div class="flex-grow">
                        <h2 class="desc-title">Bla blabla title</h2>
                      </div>
                      <div>
                        <button class="close-desc-cross" @click="closeDescClick">X</button>
                      </div>
                    </div>
                    <div>
                      {{gameDescription}}
                    </div>
                    <div>
                      <button class="close-desc-play" @click="closeDescClick">Jouer &gt;</button>
                    </div>
                  </div>
                </div>
                <div v-show="loadingDone && !visibleDescriptionAbove">
                  <canvas ref="gameCanvas" @click="onGameClick"/>
                </div>
                <!-- TODO : v-if au lieu de v-show ? -->
                <ProgressIndicator v-show="!loadingDone && !visibleDescriptionAbove" ref="progressIndicator" />
              </div>
            </div>
          </div>
          <div ref="gameFooter" class="game-footer flex-grow-no">
            <!-- https://getbootstrap.com/docs/4.1/utilities/flex/ -->
            <div class="game-footer-inside">

              <div class="flex-column game-menu-normal">

                  <div class="flex-grow"></div>

                  <div v-show="hasDescriptionAbove" class="button-wrapper">
                    <button class="my-button game-menu-button-normal" @click="showDescClick" :disabled="visibleDescriptionAbove">
                      <!-- TODO : un espèce d'icône de parchemin. -->
                      A
                    </button>
                    <span class="tooltip" @click="showDescClick">Réafficher la description du jeu</span>
                  </div>

                  <div class="button-wrapper">
                    <button class="my-button game-menu-button-normal" @click="toggleDevZoneDisplay">
                      ( ):
                    </button>
                    <span class="tooltip" @click="toggleDevZoneDisplay">Afficher/masquer le code source</span>
                  </div>

                  <div class="button-wrapper">
                    <button class="my-button game-menu-button-normal" @click="$router.push('/')">
                      <img class="home-icon" src="../assets/home.svg" alt="Home icon"></img>
                    </button>
                    <span class="tooltip" @click="$router.push('/')">Page d'accueil de Squarity</span>
                  </div>

              </div>

              <div class="flex-grow-2">
                <textarea id="pythonConsole" ref="pythonConsole" readonly />
              </div>
              <!-- https://www.w3schools.com/charsets/ref_utf_arrows.asp -->
              <!--
                C'est dégueu de devoir répéter "disabled = isPlayerLocked" à chaque bouton.
                Mais c'est pas trop grave. Le HTML a le droit d'être dégueux,
                tant que c'est pas le JS.
              -->
              <div class="flex-grow game-buttons">
                <div>

                  <div class="flex-grow" />
                  <div>
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="goLeft">
                      &#x21e6;
                    </button>
                  </div>
                  <div class="flex-column">
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="goUp">
                      &#x21e7;
                    </button>
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="goDown">
                      &#x21e9;
                    </button>
                  </div>
                  <div>
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="goRight">
                      &#x21e8;
                    </button>
                  </div>
                  <div class="flex-grow-04" />
                  <div class="flex-column">
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="action1">
                      1
                    </button>
                    <button class="game-button-for-real" :disabled="isPlayerLocked" @click="action2">
                      2
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <div class="game-menu-small">
              <div :class="{ hidden: hideGameMenuSmall }" class="game-menu-small-content">
                <!-- TODO : ajouter le bouton pour réafficher la descrip. -->
                <div @click="$router.push('/')">
                  <span class="game-menu-icon">
                    <img class="home-icon" src="../assets/home.svg" alt="Home icon"></img>
                  </span>
                  <span>Page d'accueil de Squarity</span>
                </div>
                <div @click="toggleDevZoneDisplay">
                  <span class="game-menu-icon">( ):</span>
                  <span>Afficher/masquer le code source</span>
                </div>
              </div>
              <div :class="{ activated: !hideGameMenuSmall }" class="game-menu-small-toggle" @click="gameMenuSmallClick">
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
import ProgressImposter from "../classes/ProgressImposter.js";
import libSquarityCodeV1 from '/squarity_v1.txt?raw'
import libSquarityCodeV2 from '/squarity_v2.txt?raw'
import { Direction, PlayerLockTransi } from '../classes/common/Constants.js';
import GameEngineV1 from "../classes/GameEngineV1.js";
import GameEngineV2 from "../classes/GameEngineV2.js";

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
      visibleDescriptionAbove: false,
      hasDescriptionAbove: false,
      loadingDone: false,
      showCode: true,
      hideGameMenuSmall: true,
      isPlayerLocked: false,
      gameDescription: "",
      shrinking: false,
      dummytab: [{dummyvar: 'dummy'}],
    };
  },

  async mounted() {

    this.canvasBuffer = document.createElement('canvas');
    this.currentUrlTileset = '';
    this.mustReloadTileset = true;
    this.ratioFromWidthToHeight = 1;
    this.tileAtlas = null;
    this.gameConfig = null;
    this.gameCode = '';
    this.progressImposter = new ProgressImposter(this.$refs.progressIndicator, 6)
    this.$refs.progressIndicator.clearProgress();
    this.$refs.progressIndicator.setNbMainTasks(6);
    window.addEventListener('resize', this.handleResize);

    // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
    // C'est relou ces récupérations d'appui de touches.
    // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
    const elemGameInterface = this.$refs.gameInterface;
    elemGameInterface.addEventListener('keydown', this.onKeyDown);

    this.functionFromButton = {
      ArrowUp: this.goUp,
      ArrowRight: this.goRight,
      ArrowDown: this.goDown,
      ArrowLeft: this.goLeft,
      Digit1: this.action1,
      Digit2: this.action2,
      Numpad1: this.action1,
      Numpad2: this.action2,
    };

    this.showProgress('Récupération du jeu.');
    const gameSpec = await this.$refs.devZone.fetchGameSpecFromLocHash();
    // TODO : check gameSpec is not null.
    this.recordGameSpec(gameSpec);
    this.defineInitialUIFromGame();
    this.defineMainUIFromGame();
    this.handleResize();
    await this.getPyodide();
    await this.refreshGameFromSpec();
    this.startGame();

  },

  updated() {
    // Cette fonction est appelée automatiquement par Vue,
    // mais pour ça, il faut qu'il y ait des "vraies" modifs dans le DOM.
    // Si c'est juste des classes qui changent, ça déclenche pas updated.
    // Mais quand la variable "dummytab" est modifiée, ça marche.
    this.handleResize();
  },

  unmounted() {
    const elemGameInterface = this.$refs.gameInterface;
    // Je dois vérifier que elemGameInterface n'est pas Null.
    // Quand je recharge ma page, pas de problème.
    // Quand je modifie le code et que npm me recharge automatiquement la page
    // (d'une manière manifestement différente qu'un rechargement complet)
    // Ça me fait une erreur. Je sais pas pourquoi.
    // Osef, y'a qu'à checker.
    if (elemGameInterface) {
      elemGameInterface.removeEventListener('keydown', this.onKeyDown);
    }
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {

    async onUpdateGameSpec() {
      this.loadingDone = false;
      const gameSpec = await this.$refs.devZone.fetchGameSpecFromFields();
      // TODO : check gameSpec is not null.
      this.recordGameSpec(gameSpec);
      this.defineMainUIFromGame();
      this.handleResize();
      await this.refreshGameFromSpec();
      this.startGame();
    },

    recordGameSpec(gameSpec) {
      if (this.currentUrlTileset !== gameSpec.urlTileset) {
        this.currentUrlTileset = gameSpec.urlTileset;
        this.mustReloadTileset = true
      }
      this.gameConfig = JSON.parse(gameSpec.jsonConf);
      this.gameCode = gameSpec.gameCode;
    },

    defineInitialUIFromGame() {
      if ('show_code' in this.gameConfig) {
        this.showCode = this.gameConfig['show_code'];
      }
      if ('texts' in this.gameConfig) {
        const textsConfig = this.gameConfig['texts']
        if ('description' in textsConfig) {
          this.gameDescription = textsConfig['description'];
          if (this.gameDescription.length > 0) {
            this.hasDescriptionAbove = true;
          }
        }
        if ('show_desc' in textsConfig) {
          this.visibleDescriptionAbove = textsConfig['show_desc'];
        }
      }
      // TODO : faut gérer les notes (le texte en bas du jeu).
    },

    defineMainUIFromGame() {
      // TODO : valeurs par défaut déjà définies à plein d'autres endroits. C'est vilain.
      let areaWidth = 20;
      let areaHeight = 14;
      if ('game_area' in this.gameConfig) {
        const jsonConfGameArea = this.gameConfig.game_area;
        if ('nb_tile_width' in jsonConfGameArea) {
          areaWidth = jsonConfGameArea.nb_tile_width;
        }
        if ('w' in jsonConfGameArea) {
          areaWidth = jsonConfGameArea.w;
        }
        if ('nb_tile_height' in jsonConfGameArea) {
          areaHeight = jsonConfGameArea.nb_tile_height;
        }
        if ('h' in jsonConfGameArea) {
          areaHeight = jsonConfGameArea.h;
        }
      }
      this.ratioFromWidthToHeight = areaHeight / areaWidth;

      // https://caniuse.com/?search=operator%3A%20in - 97%
      if ('name' in this.gameConfig) {
        document.title = `Squarity - ${this.gameConfig.name}`;
      } else {
        document.title = 'Squarity';
      }
    },

    async getPyodide() {
      window.languagePluginUrl = '/pyodide/v0.15.0/';
      window.pyodideDownloadProgress = this.pyodideDownloadProgress;
      this.showProgress('Initialisation de Pyodide.');
      // Si j'arrive jusqu'au bout avec cet astuce, je met 3000 upvotes à cette réponse :
      // https://stackoverflow.com/questions/45047126/how-to-add-external-js-scripts-to-vuejs-components
      // Et aussi à ce plugin, avec la doc qui va bien. Et qui est compatible Vue 3.
      // https://www.npmjs.com/package/vue-plugin-load-script
      //
      // Origine de ce fichier : https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js
      // Ce script js télécharge les fichiers suivants :
      // public/pyodide/v0.15.0/pyodide.asm.wasm
      // public/pyodide/v0.15.0/pyodide.asm.data.js
      // public/pyodide/v0.15.0/pyodide.asm.data
      // public/pyodide/v0.15.0/pyodide.asm.js
      await loadScript('../pyodide.js');
      this.showProgress('Iodification du python géant.', true, true);
      await window.languagePluginLoader;
    },

    async refreshGameFromSpec() {

      this.$refs.pythonConsole.textContent = '';
      let useV2 = true;
      if ('version' in this.gameConfig) {
        const version = this.gameConfig.version;
        if (version[0] == '1') {
          useV2 = false;
        } else if (version[0] == '2') {
          useV2 = true;
        } else {
          useV2 = false;
          const msg = `Version du moteur inconnue. (${version}). On prend la V1 par défaut.\n`;
          this.$refs.pythonConsole.textContent += msg;
        }
      } else {
        // FUTURE: au bout d'un moment, on enlèvera cette inférence moche et on fera tout planter
        // si la version n'est pas indiquée.
        const INFER_V1 = 'GameModel()';
        const INFER_V2 = 'GameModel(squarity.GameModelBase)';
        let msg = "";
        if (this.gameCode.includes(INFER_V1)) {
          useV2 = false;
          msg = 'Warning: ajoutez: "version": "1.0.0" dans la config json.\n';
        } else if (this.gameCode.includes(INFER_V2)) {
          useV2 = true;
          msg = 'Warning: ajoutez: "version": "2.0.0" dans la config json.\n';
        } else {
          useV2 = false;
          msg = 'Warning: indiquez le numéro de version dans la config json. On prend la V1 par défaut.\n';
        }
        this.$refs.pythonConsole.textContent += msg;
      }

      // Utilisation de la variable $refs pour récupérer tous les trucs référencés dans le template.
      // https://vuejs.org/v2/guide/migration.html#v-el-and-v-ref-replaced
      const canvasElem = this.$refs.gameCanvas;
      if (useV2) {
        this.gameEngine = new GameEngineV2(
          this.$refs.pythonConsole,
          window.pyodide,
          this.refreshPlock,
          canvasElem,
          this.canvasBuffer,
          libSquarityCodeV2
        );
      } else {
        this.gameEngine = new GameEngineV1(
          this.$refs.pythonConsole,
          window.pyodide,
          this.refreshPlock,
          canvasElem,
          this.canvasBuffer,
          libSquarityCodeV1
        );
      }

      this.showProgress('Gloubiboulgatisation des pixels.');
      if (this.mustReloadTileset) {
        this.tileAtlas = await loadImage(this.currentUrlTileset);
        this.mustReloadTileset = false;
      }

      this.showProgress('Compilation de la compote.');
      this.gameEngine.updateGameSpec(this.tileAtlas, this.gameConfig, this.gameCode);
    },

    startGame() {
      this.isPlayerLocked = false;
      this.gameEngine.execStartCode();
      this.$refs.gameInterface.focus();
      this.showProgress('C\'est parti !');
      this.loadingDone = true;
      this.$refs.progressIndicator.clearProgress();
    },

    showProgress(msg, withSubTask, isImposted) {
      if (!this.loadingDone) {
        withSubTask = withSubTask === true;
        isImposted = isImposted === true;
        this.progressImposter.advanceToNextMainTask(msg, withSubTask, isImposted);
      }
    },

    pyodideDownloadProgress(currentBytes, totalBytes) {
      this.progressImposter.onSubTaskProgress(currentBytes, totalBytes);
    },

    refreshPlock() {
      // Fonction de callback à transmettre au GameEngine. Si un événement du jeu
      // a un effet sur le lock des boutons du jeu, on le prend en compte ici.
      // Les locks/unlocks peuvent être déclenchés tout seul (delayed_callback, callback, ...),
      // donc il faut que cette fonction soit aussi une callback.
      const Plock = this.gameEngine.getPlock();
      if (Plock == PlayerLockTransi.Lock) {
        this.isPlayerLocked = true;
      } else {
        this.isPlayerLocked = false;
        this.$refs.gameInterface.focus();
      }
    },

    handleResize() {
      // AVERTISSEMENT : c'est dégueulasse de faire comme ça,
      // mais j'ai pas trouvé de meilleure solution.
      // J'ai essayé en mettant des bouts de CSS de partout, des flex, des height 100%, etc.
      // Ça me pétait à la gueule à chaque fois.
      // Je pige rien au design de page web et au CSS, langage de zouzou !!

      // nombre magique "96/100", à cause du 96vh que j'ai mis je-sais-plus-où.
      const Hscreen = window.innerHeight * (96 / 100);
      const Hfooter = this.$refs.gameFooter.clientHeight;
      const Htitle = this.$refs.titleContainer.clientHeight;
      const Hmargin = 10;

      let authorizedHeight = Hscreen - Hfooter - Htitle - Hmargin;
      // La taille autorisée, on peut la récupérer directement.
      // (J'espère que ça marche comme ça sur à peu près tous les navigateurs)
      let authorizedWidth = this.$refs.gameInterface.clientWidth;

      const correspHeight = authorizedWidth * this.ratioFromWidthToHeight;
      let finalHeight = 0;
      let finalWidth = 0;
      if (correspHeight < authorizedHeight) {
        // On peut s'étendre en haut et en bas, mais pas sur les côtés.
        finalHeight = Math.floor(correspHeight);
        finalWidth = Math.floor(authorizedWidth);
      } else {
        // On peut s'étendre à gauche à droite, mais pas en haut en bas.
        finalHeight = Math.floor(authorizedHeight);
        finalWidth = Math.floor(authorizedHeight / this.ratioFromWidthToHeight);
      }

      this.$refs.gameCanvas.style = `width: ${finalWidth}px; height: ${finalHeight}px;`;
      this.$refs.descripAbove.style = `height: ${authorizedHeight}px;`;
    },

    onKeyDown(e) {
      // https://hacks.mozilla.org/2017/03/internationalize-your-keyboard-controls/
      // C'est quand même un peu le bazar la gestion des touches dans les navigateurs.
      if (e.code in this.functionFromButton) {
        const eventFunction = this.functionFromButton[e.code];
        eventFunction();
        e.preventDefault();
      }
    },

    onGameClick(e) {
      this.gameEngine.onGameClick(e);
    },

    goUp() {
      this.gameEngine.onButtonDirection(Direction.Up);
    },

    goRight() {
      this.gameEngine.onButtonDirection(Direction.Right);
    },

    goDown() {
      this.gameEngine.onButtonDirection(Direction.Down);
    },

    goLeft() {
      this.gameEngine.onButtonDirection(Direction.Left);
    },

    action1() {
      this.gameEngine.onButtonAction('action_1');
    },

    action2() {
      this.gameEngine.onButtonAction('action_2');
    },

    gameMenuSmallClick() {
      this.hideGameMenuSmall = !this.hideGameMenuSmall;
      // Voir commentaire de la fonction "toggleDevZoneDisplay"
      // pour comprendre la raison de cette ligne de code stupide.
      this.dummytab = [{dummyvar: 'dummy'}];
      this.handleResize();
    },

    closeDescClick() {
      this.shrinking = true;
      this.$refs.descripAbove.addEventListener("transitionend", this.clodeDescEndTransi);
    },

    clodeDescEndTransi(e) {
      this.visibleDescriptionAbove = false;
      this.shrinking = false;
    },

    showDescClick() {
      this.visibleDescriptionAbove = true;
    },

    toggleDevZoneDisplay() {
      this.showCode = !this.showCode;
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

.flex-child-center {
  align-self: center;
}

.no-padding-you-dumbass {
  padding: 0;
}

.game-interface {
  /*  Faut jamais mettre 100vh. Au moindre pixel de trop,
      ça fait une scroll bar verticale de merde.
      hashtag-vive_les_magic_number_et_fuck_le_css
  */
  height: 96vh;
  /* https://stackoverflow.com/questions/2943548/how-to-reset-remove-chromes-input-highlighting-focus-border */
  outline: none;
}

.game-footer {
  margin-top: 5px;
}

/*.game-footer>div {*/
.game-footer-inside {
  display: flex;
  flex-wrap: wrap-reverse;
}

.game-footer button {
  background-color: #707070;
  font-weight: bold;
  border: 0;
  margin: 2px;
  padding: 0;
}

/* https://stackoverflow.com/questions/12591966/html-disabled-button-getting-active-css-pseudo-class */
.game-footer button:enabled:hover {
  background-color: #909090;
}

.game-footer button:enabled:active {
  background-color: #B0B0B0;
}

.game-footer button:disabled {
  background-color: #505050;
  color: #303030;
}

/* https://www.a11yproject.com/posts/2013-01-25-never-remove-css-outlines/ */
.game-footer button:focus {
  outline: thin dotted;
}

div.game-buttons {
  min-width: 10em;
}

div.game-buttons>div {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

div.game-buttons button {
  color: black;
}

div.game-menu-normal button {
  color: black;
}

button.game-menu-button-normal {
  font-size: 0.8em;
  border-radius: 8px;
  margin: 0.4em 1em 0.4em 0;
}

canvas {
  border: 1px solid gray;
  image-rendering: pixelated;
}

div.hidden {
  width: 0%;
  display: none;
}

#pythonConsole {
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

.button-wrapper {
  position: relative; /* anchor pour le tooltip */
  /* Si j'ai bien compris,
     c'est pour mettre le tooltip et le bouton sur la même ligne,
     et les deux auront la même hauteur */
  display: inline-block;
}

.tooltip {
  position: absolute;
  left: 100%; /* pour mettre le tooltip à droite du bouton */
  top: 50%; /* centré verticalement */
  transform: translate(-1.2em, -50%);
  background: #909090;
  color: #000;
  padding: 0.09em 0.5em;
  white-space: nowrap;
  z-index: 9999; /* Pour être sûr qu'il soit par-dessus tous les autres */
  opacity: 0; /* caché par défaut */
  /* Non-interactif par défaut. Ça évite que le tooltip apparaisse
     quand la souris va directement dessus,
     sans être préalablement passé par le mini-bouton */
  pointer-events: none;
  border-top: 5px solid black;
  border-right: 5px solid black;
  border-bottom: 5px solid black;
  transition: opacity .12s linear;
  /* https://stackoverflow.com/questions/2310734/how-to-make-html-text-unselectable */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Affiche et active le tooltip seulement quand la souris se trouve
   sur le wrapper (contenant le mini-bouton) et le tooltip). */
.button-wrapper:hover .tooltip {
  opacity: 1; /* Là, on affiche le tooltip *
  /* Ça devient interactif seulement quand la souris est dessus. */
  pointer-events: auto;
  cursor: pointer;
}

.button-wrapper:hover button.game-menu-button-normal {
  border-radius: 0px;
  background-color: #909090;
}

@media only screen and (max-width: 768px) {
  .game-footer button {
    height: 2em;
    width: 2em;
  }
  .game-button-for-real {
    font-size: 1.5em;
  }
  .game-menu-normal {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .game-footer button {
    height: 2em;
    width: 2em;
  }
  .game-button-for-real {
    font-size: 2em;
  }
  .game-menu-small {
    display: none;
  }
}

.game-menu-small-toggle {
  margin-top: 5px;
  height: 0.6em;
  background-color: #707070;
  border-radius: 10px;
}

.game-menu-small-toggle:hover {
  background-color: #909090;
}

.game-menu-small-toggle.activated {
  margin-top: 0px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #B0B0B0;
}

.game-menu-small-content {
  background-color: #707070;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: black;
  font-weight: bold;
}

.game-menu-small-content > div{
  width: 100%;
  cursor: pointer;
  text-align: left;
  padding-left: 30%;
}

.game-menu-small-content > div:hover{
  background-color: #909090;
}

.game-menu-icon {
  /* https://stackoverflow.com/questions/257505/css-fixed-width-in-a-span */
  float: left;
  width: 2em;
}

.home-icon {
  width: 1.1em;
}

.descrip-above {
  background-color: #202020;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  overflow-y: scroll;
  overflow-x: hidden;
  /* Définition de l'effet de transition,
     quand on ne veut plus afficher la description.
     La direction du shrink sera vers le coin inférieur gauche.
  */
  transform-origin: left bottom;
  transition: transform 400ms ease;
  will-change: transform;

}

@media (prefers-reduced-motion: reduce) {
  .descrip-above {
    /* Transition très courte,
       pour les gens qui ont une config indiquant qu'on ne veut pas de transition.
       https://www.a11yproject.com/posts/understanding-vestibular-disorders/
    */
    transition: transform 0.001s ease !important;
  }
}


.close-desc-cross {
  color: red;
  font-size: 2em;
  font-weight: bold;
  padding: 0.5em;
}

.close-desc-play {
  background-color: #707070;
  color: black;
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.25em;
  padding: 0.25em 1em 0.25em 1em;
}

.close-desc-play:hover {
  background-color: #808080;
}

.desc-title {
  padding: 0.75em;
  font-size: 1.5em;
}

.is_shrinking {
  transform: scale(0);
}

</style>
