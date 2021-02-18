<template>
  <div class="game_board">
    <!-- https://stackoverflow.com/questions/25427407/bootstrap-3-and-4-container-fluid-with-grid-adding-unwanted-padding -->
    <b-row class="h-100 no-gutters">
      <b-col
        ref="left_column"
        sm="12"
        md="6"
        order="2"
        order-sm="2"
        order-md="1"
        :class="{ hidden: hide_code }"
      >
        <div class="flex-column h-100">
          <div class="d-none d-sm-none d-md-block">
            <MainTitle />
          </div>
          <div class="dev_notice">
            Fonctionne grâce à Pyodide.
            <a
              href="https://github.com/darkrecher/squarity-code"
              target="_blank"
            >
              Code source
            </a>
            et
            <a
              href="https://github.com/darkrecher/squarity-doc"
              target="_blank"
            >
              documentation
            </a>
            sur github.
          </div>
          <div class="flex-grow">
            <!--
              C'est cool les v-bind : https://vuejs.org/v2/guide/class-and-style.html
              Mais attention, faut pas écrire "v-bind". https://eslint.vuejs.org/rules/v-bind-style.html
            -->
            <div class="h-100">
              <DevZone
                ref="dev_zone"
                @update_game_spec="on_update_game_spec"
              />
            </div>
          </div>
        </div>
      </b-col>
      <b-col
        sm="12"
        :md="hide_code ? 12 : 6"
        order="1"
        order-sm="1"
        order-md="2"
      >
        <!--
          Ne pas oublier le tabindex=0, sinon on peut pas choper les touches.
          https://laracasts.com/discuss/channels/vue/vuejs-listen-for-key-events-on-div
        -->
        <div
          ref="game_interface"
          class="game_interface flex-column"
          tabindex="0"
        >
          <div
            ref="title_container"
            class="d-block d-sm-block d-md-none"
          >
            <div :class="{ hidden: hide_code }">
              <MainTitle />
            </div>
          </div>
          <div
            ref="toggle_button"
            class="flex-grow-no text-right"
          >
            <button @click="toggle_dev_zone_display">
              Jeu en plein écran.
            </button>
          </div>
          <div class="the_canvas flex-grow">
            <div class="flex-line h-100">
              <div class="flex-child-center w-100">
                <canvas
                  v-show="loading_done"
                  ref="game_canvas"
                />
                <ProgressIndicator
                  v-if="!loading_done"
                  ref="progress_indicator"
                />
              </div>
            </div>
          </div>
          <div
            ref="game_footer"
            class="game_footer flex-grow-no"
          >
            <!-- https://getbootstrap.com/docs/4.1/utilities/flex/ -->
            <div>
              <div class="flex-grow-2">
                <textarea
                  id="python_console"
                  ref="python_console"
                  readonly
                />
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
                    <button
                      :disabled="is_player_locked"
                      @click="go_left"
                    >
                      &#x21e6;
                    </button>
                  </div>
                  <div class="flex-column">
                    <button
                      :disabled="is_player_locked"
                      @click="go_up"
                    >
                      &#x21e7;
                    </button>
                    <button
                      :disabled="is_player_locked"
                      @click="go_down"
                    >
                      &#x21e9;
                    </button>
                  </div>
                  <div>
                    <button
                      :disabled="is_player_locked"
                      @click="go_right"
                    >
                      &#x21e8;
                    </button>
                  </div>
                  <div class="flex-grow-04" />
                  <div class="flex-column">
                    <button
                      :disabled="is_player_locked"
                      @click="action_1"
                    >
                      1
                    </button>
                    <button
                      :disabled="is_player_locked"
                      @click="action_2"
                    >
                      2
                    </button>
                  </div>
                  <div class="flex-grow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import MainTitle from './MainTitle.vue';
import DevZone from './DevZone.vue';
import ProgressIndicator from './ProgressIndicator.vue';

const axios = require('axios');

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

const actionsFromPlayer = ['U', 'R', 'D', 'L', 'action_1', 'action_2'];

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
    };
  },

  beforeMount() {
  },

  async mounted() {
    // Utilisation de la variable $refs pour récupérer tous les trucs référencés dans le template.
    // https://vuejs.org/v2/guide/migration.html#v-el-and-v-ref-replaced

    const canvasFinal = this.$refs.game_canvas;
    this.ctx_canvas_final = canvasFinal.getContext('2d');
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de dessin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // Et faut le faire deux fois :
    // Pour canvasFinal (width, height), et aussi pour this.canvas_buffer (width, height aussi)
    // J'ai pas tout compris ces histoires de taille. J'ai mis une tâche dans Trello pour ça.
    //
    // Juste pour info : pour récupérer la taille rélle d'un élément HTML, en pixel :
    // elem.clientHeight et elem.clientWidth.

    canvasFinal.width = 640;
    canvasFinal.height = 448;
    this.canvas_buffer = document.createElement('canvas');
    this.ctx_canvas_buffer = this.canvas_buffer.getContext('2d');
    this.canvas_buffer.width = 640;
    this.canvas_buffer.height = 448;

    this.current_url_tileset = '';
    this.tile_width = 32;
    this.tile_height = 32;
    this.player_locks = [];
    this.delayed_action_next_id = 0;
    this.delayed_actions = [];

    // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
    // C'est relou ces récupération d'appui de touches.
    // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
    const elemGameInterface = this.$refs.game_interface;
    elemGameInterface.addEventListener('keydown', this.on_key_down);
    // J'ai pas trouvé comment on importe un module python homemade dans pyodide.
    // Il y a des docs qui expliquent comment créer un package avec wheel et micropip.
    // J'ai pas trop compris le principe, et ça me semble un peu overkill.
    // Alors j'y vais à la bourrin : je charge tout le code dans une string
    // et je la balance ensuite directement à la fonction runPython.
    this.show_progress('Pré-squarification du python géant.');
    const libSquarityCode = await axios.get('squarity.py');

    window.languagePluginUrl = '/pyodide/v0.15.0/';
    this.show_progress('Téléchargement du téléchargeur.');
    // Si j'arrive jusqu'au bout avec cet astuce, je met 3000 upvotes à cette réponse :
    // https://stackoverflow.com/questions/45047126/how-to-add-external-js-scripts-to-vuejs-components
    //
    // Origine de ce fichier : https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js
    // Ce script js télécharge les fichiers suivants :
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.wasm
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.data.js
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.data
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.asm.js
    // https://pyodide-cdn2.iodide.io/v0.15.0/full/packages.json
    await this.$loadScript('pyodide.js');
    this.show_progress('Iodification du python géant.');
    await window.languagePluginLoader;
    this.show_progress('Déballage de la cartouche du jeu.');
    this.run_python(
      libSquarityCode.data,
      'Interprétation de la lib python squarity',
    );
    // Et donc là, j'envoie un message à un autre component, qui va en retour me renvoyer
    // le message "update-game-spec" pour activer le jeu par défaut.
    // Tellement génial le javascript.
    this.$refs.dev_zone.fetch_game_spec_from_loc_hash();
    window.addEventListener('resize', this.handleResize);
  },

  updated() {
    this.handleResize();
  },

  destroyed() {
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

    console_log(msg) {
      const pythonConsole = this.$refs.python_console;
      pythonConsole.textContent += msg;
      pythonConsole.scrollTop = pythonConsole.scrollHeight;
    },

    run_python(pythonCode, codeLabel) {
      let resultPython = null;
      try {
        resultPython = window.pyodide.runPython(pythonCode);
      } catch (err) {
        const errMessage = err.message;
        this.console_log(`Erreur python durant l'action : \n${codeLabel}\n${errMessage}`);
        // Je rethrow l'exception, parce que si le code python déconne,
        // vaut mieux pas essayer de faire d'autres choses après.
        throw err;
      }
      return resultPython;
    },

    handleResize() {
      // AVERTISSEMENT : c'est dégueulasse de faire comme ça,
      // mais j'ai pas trouvé de meilleure solution.
      // J'ai essayé en mettant des bouts de CSS de partout, des flex, des height 100%, etc.
      // Ça me pétait à la gueule à chaque fois.
      // Je hais le design de page web, je hais le CSS, putain de langague de zouzou !!

      // Ça, ce sera différent selon la conf du jeu.
      // Mais c'est une valeur qu'on connait tout le temps.
      const ratioFromWidthToHeight = 448 / 640;

      // https://stackoverflow.com/questions/8339377/how-to-get-screen-width-without-minus-scrollbar
      // https://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar/2146903
      const Wscreen = window.innerWidth;
      const Wbody = document.body.clientWidth;
      const WleftCol = this.$refs.left_column.clientWidth;
      const Wmargin = 10;

      // nombre magique "96/100", à cause du 96vh que j'ai mis je-sais-plus-où.
      const Hscreen = window.innerHeight * (96 / 100);
      const Hfooter = this.$refs.game_footer.clientHeight;
      const Htitle = this.$refs.title_container.clientHeight;
      const HtoggleButton = this.$refs.toggle_button.clientHeight;
      const Hmargin = 10;

      // Linter de merde, qui m'oblige à faire ça.
      let authorizedWidth = 0;
      let authorizedHeight = 0;
      if (Wscreen < 768) {
        // On soustrait pas la largeur de la colonne de gauche pour calculer la largeur autorisée,
        // car avec le super responsive design, cette colonne est en bas.
        authorizedWidth = Wbody - Wmargin;
        authorizedHeight = Hscreen - Hfooter - Htitle - HtoggleButton - Hmargin;
        // console.log('Calcul <  768. W : ', authorizedWidth, 'H : ', authorizedHeight);
      } else {
        authorizedWidth = Wbody - WleftCol - Wmargin;
        authorizedHeight = Hscreen - Hfooter - Htitle - HtoggleButton - Hmargin;
        // console.log('Calcul >= 768. W : ', authorizedWidth, 'H : ', authorizedHeight);
      }

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

    draw_rect() {
      // https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
      // clear canvas
      this.ctx_canvas_buffer.fillStyle = '#000000';
      // https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
      this.ctx_canvas_buffer.imageSmoothingEnabled = false;
      // J'ai tenté clearRect. Mais ça ne marche pas bien.
      // Mon bonhomme reste dessiné sur les cases noires. Osef.
      this.ctx_canvas_buffer.fillRect(0, 0, 640, 448);
      let canvasX = 0;
      let canvasY = 0;
      const boardSize = this.run_python(
        'board_model.get_size()',
        'Récupération de la taille du Board.',
      );
      const [boardWidth, boardHeight] = boardSize;
      const tilesData = this.run_python(
        'board_model.export_all_tiles()',
        'Récupération des tiles pour les dessiner',
      );

      for (let y = 0; y < boardHeight; y += 1) {
        for (let x = 0; x < boardWidth; x += 1) {
          const tileData = tilesData[y][x];
          for (let i = 0; i < tileData.length; i += 1) {
            const gameObject = tileData[i];
            const [coordImgX, coordImgY] = this.tile_coords[gameObject];
            this.ctx_canvas_buffer.drawImage(
              this.tile_atlas,
              coordImgX, coordImgY, this.tilesize_tileset, this.tilesize_tileset,
              canvasX, canvasY, this.tile_width, this.tile_height,
            );
          }
          canvasX += this.tile_width;
        }
        canvasX = 0;
        canvasY += this.tile_height;
      }
      this.ctx_canvas_final.drawImage(this.canvas_buffer, 0, 0);
    },

    is_str_transitional_state(strVal) {
      return (strVal === 't' || strVal === 'T' || strVal === 'transitional_state');
    },

    process_delayed_action(actionId) {
      // https://github.com/babel/babel-eslint/issues/274
      const delayedActionInfo = this.delayed_actions.find(([, actId]) => actId === actionId);
      if (delayedActionInfo) {
        this.delayed_actions = this.delayed_actions.filter(([, actId]) => actId !== actionId);
        const [, , eventName] = delayedActionInfo;
        this.send_game_event(eventName);
      }
    },

    send_game_event(eventName) {
      // Exemple d'infos à récupérer :
      // {
      //   "delayed_actions": [
      //       {"name": "blabla", "delay_ms": 500},
      //       {"name": "blabla2", "delay_ms": 250}
      //   ],
      //   "redraw: 0,"
      //   "player_locks": ["name1", "name2"],
      //   "player_unlocks": ["name1", "name2", "*"],
      // }

      if (this.is_player_locked && actionsFromPlayer.includes(eventName)) {
        return;
      }

      let mustRedraw = true;
      document.eventName = eventName;
      const eventResultRaw = this.run_python(
        'board_model.on_game_event(js.document.eventName)',
        `Exécution d'un événement ${eventName}`,
      );

      if (!isNonePython(eventResultRaw)) {
        const eventResult = JSON.parse(eventResultRaw);
        if ('delayed_actions' in eventResult) {
          // Syntaxe de for-loop de merde... Putain de javascript. Putain de linter.
          eventResult.delayed_actions.forEach((newDelayedAction) => {
            let delayTime = 500;
            if ('delay_ms' in newDelayedAction) {
              delayTime = newDelayedAction.delay_ms;
            }
            if ('name' in newDelayedAction) {
              const actionName = newDelayedAction.name;
              const newActionId = this.delayed_action_next_id;
              this.delayed_action_next_id += 1;
              const timeOutId = setTimeout(() => {
                this.process_delayed_action(newActionId);
              }, delayTime);
              const newDelayedActionInfo = [timeOutId, newActionId, actionName];
              this.delayed_actions.push(newDelayedActionInfo);
            }
          });
        }
        if ('player_locks' in eventResult) {
          eventResult.player_locks.forEach((lockName) => {
            if (!this.player_locks.includes(lockName)) {
              this.player_locks.push(lockName);
            }
          });
        }
        if ('player_unlocks' in eventResult) {
          eventResult.player_unlocks.forEach((unlockName) => {
            if (unlockName === '*') {
              this.player_locks = [];
            } else {
              this.player_locks = this.player_locks.filter((lockLoop) => lockLoop !== unlockName);
            }
          });
        }
        const playerLocsNew = (this.player_locks.length !== 0);
        if (this.is_player_locked !== playerLocsNew) {
          this.is_player_locked = playerLocsNew;
          if (!this.is_player_locked) {
            this.$refs.game_interface.focus();
          }
        }
        if ('redraw' in eventResult) {
          mustRedraw = eventResult.redraw !== 0;
        }
      }

      if (mustRedraw) {
        this.draw_rect();
      }
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
      this.show_progress('Gloubiboulgatisation des pixels.');
      if (this.current_url_tileset !== urlTileset) {
        this.tile_atlas = await loadImage(urlTileset);
        this.current_url_tileset = urlTileset;
      }

      this.show_progress('Compilation de la compote.');

      // On remet à zéro toutes les infos concernant les delayed actions.
      this.delayed_actions.forEach((delayedActionInfo) => {
        const [timeoutId] = delayedActionInfo;
        clearTimeout(timeoutId);
      });
      this.delayed_actions = [];
      this.player_locks = [];
      this.delayed_action_next_id = 0;

      this.json_conf = JSON.parse(jsonConf);
      this.tilesize_tileset = this.json_conf.tile_size;
      this.tile_coords = this.json_conf.tile_coords;
      this.$refs.python_console.textContent = '';
      this.run_python(
        gameCode,
        'Interprétation du gameCode.',
      );
      this.run_python(
        'board_model = BoardModel()',
        'Instanciation du BoardModel',
      );
      this.draw_rect();
      this.$refs.game_interface.focus();
      this.show_progress('C\'est parti !');
      this.loading_done = true;
    },

    toggle_dev_zone_display() {
      this.hide_code = !this.hide_code;
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .flex-column {
    display: flex;
    flex-flow: column;
  }
  .flex-line {
    display: flex;
  }
  /*
    C'est sûrement pas comme ça qu'il faudrait faire ces trucs.
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

  .text-right {
    text-align: right;
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
    /*
      Faut jamais mettre 100vh. Au moindre pixel de trop,
      ça fait une scroll bar verticale de merde.
      hashtag-vive_les_magic_number_et_fuck_le_css
    */
    height: 96vh;
  }

  .game_footer {
    margin-top: 5px;
  }
  .game_footer > div {
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
  .game_footer button:hover {
    background-color: #909090;
  }
  .game_footer button:active {
    background-color: #B0B0B0;
  }
  /* https://www.a11yproject.com/posts/2013-01-25-never-remove-css-outlines/ */
  .game_footer button:focus {
    outline: thin dotted;
  }

  div.game_buttons {
    min-width: 10em;
  }
  div.game_buttons > div {
    display: flex;
    align-items: flex-end;
    justify-content: center;
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
