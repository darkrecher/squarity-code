<template>
  <div class="gameboard">
    <div>
      <button @click="toggleDevZoneDisplay">
        Masquer / Afficher zone de dev.
      </button>
    </div>

    <b-container
      fluid
    >
      <b-row>
        <b-col
          sm="12"
          :md="hideCode ? 12 : 6"
          :lg="hideCode ? 8 : 6"
          :offset-lg="hideCode ? 2 : 0"
          :xl="hideCode ? 8 : 6"
          :offset-xl="hideCode ? 2 : 0"
        >
          <!--
            Ne pas oublier le tabindex=0, sinon on peut pas choper les touches.
            https://laracasts.com/discuss/channels/vue/vuejs-listen-for-key-events-on-div
          -->
          <div
            ref="gameinterface"
            tabindex="0"
            class="game"
            :class="{ full: hideCode }"
          >
            <canvas ref="gamecanvas" />
            <!-- https://getbootstrap.com/docs/4.1/utilities/flex/ -->
            <div class="d-flex flex-row justify-content-center align-items-stretch">
              <div class="p-2 flex-grow-1">
                <textarea
                  id="python_console"
                  ref="python_console"
                  readonly
                />
              </div>
              <!-- https://www.w3schools.com/charsets/ref_utf_arrows.asp -->
              <!-- TODO : c'est dégueu de devoir répéter
                   le disabled = is_player_locked à chaque fois
              -->
              <div class="p-2">
                <div>
                  <button
                    :disabled="is_player_locked"
                    @click="goUp"
                  >
                    &#x21e7;
                  </button>
                </div>
                <div>
                  <button
                    :disabled="is_player_locked"
                    @click="goLeft"
                  >
                    &#x21e6;
                  </button>
                  <button
                    :disabled="is_player_locked"
                    @click="goDown"
                  >
                    &#x21e9;
                  </button>
                  <button
                    :disabled="is_player_locked"
                    @click="goRight"
                  >
                    &#x21e8;
                  </button>
                </div>
              </div>
              <div class="p-2">
                <div class="action-buttons">
                  <button
                    :disabled="is_player_locked"
                    @click="action1"
                  >
                    1
                  </button>
                  <button
                    :disabled="is_player_locked"
                    @click="action2"
                  >
                    2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <b-col
          sm="12"
          md="6"
          lg="6"
          xl="6"
          :class="{ hidden: hideCode }"
        >
          <!--
            C'est cool les v-bind : https://vuejs.org/v2/guide/class-and-style.html
            Mais attention, faut pas écrire "v-bind". https://eslint.vuejs.org/rules/v-bind-style.html
          -->
          <div>
            <DevZone
              ref="devZone"
              @update-game-spec="onUpdateGameSpec"
            />
          </div>
        </b-col>
      </b-row>
    </b-container>

    <p class="footer">
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
    </p>
  </div>
</template>

<script>

import DevZone from './DevZone.vue';

const axios = require('axios');

// https://stackoverflow.com/questions/46399223/async-await-in-image-loading
// https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5577676-gerez-du-code-asynchrone
// TODO : dans une lib de code générique ?
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// TODO : ouais, ça, faut vraiment que ça aille dans une lib de code à part, parce que c'est
// un truc vraiment spécifique aux interactions pyodide/javascript
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

// TODO : y'a moyen de foutre ça dans la classe, mais que ça reste quand même une constante ?
const actionsFromPlayer = ['U', 'R', 'D', 'L', 'action_1', 'action_2'];

export default {
  name: 'GameBoard',
  components: {
    DevZone,
  },

  props: {
    msg: {
      default: '',
      type: String,
    },
  },

  data() {
    return {
      // TODO : J'ai pas besoin d'initialiser toutes mes variables membres là-dedans.
      // Du coup, ça sert à quoi ce truc de data ?
      tile_width: 32,
      tile_height: 32,
      hideCode: false,
      player_locks: [],
      is_player_locked: false,
    };
  },

  beforeMount() {
  },

  async mounted() {
    // Utilisation de la variable $refs pour récupérer tous les trucs référencés dans le template.
    // https://vuejs.org/v2/guide/migration.html#v-el-and-v-ref-replaced
    const canvasFinal = this.$refs.gamecanvas;
    this.ctx_canvas_final = canvasFinal.getContext('2d');
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de dessin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // Et faut le faire deux fois :
    // Pour canvasFinal (width, height), et aussi pour this.canvas_buffer (width, height aussi)
    // TODO : j'ai pas tout compris ces histoires de taille. Faut que je le regarde.
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

    // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
    // C'est relou ces récupération d'appui de touches.
    // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
    const elemGameInterface = this.$refs.gameinterface;
    elemGameInterface.addEventListener('keydown', this.on_key_down);
    // J'ai pas trouvé comment on importe un module python homemade dans pyodide.
    // Il y a des docs qui expliquent comment créer un package avec wheel et micropip.
    // J'ai pas trop compris le principe, et ça me semble un peu overkill.
    // Alors j'y vais à la bourrin : je charge tout le code dans une string
    // et je la balance ensuite directement à la fonction runPython.
    const libSquarityCode = await axios.get('squarity.py');

    window.languagePluginUrl = '/pyodide/v0.15.0/';
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
    this.$loadScript('pyodide.js')
      .then(() => {
        console.log('Pyodide downloaded');
        window.languagePluginLoader.then(() => {
          console.log('WASM Pyodide sgrabaradjed');
          this.runPython(
            libSquarityCode.data,
            'Interprétation de la lib python squarity',
          );
          // Et donc là, j'envoie un message à un autre component, qui va en retour me renvoyer
          // le message "update-game-spec" pour activer le jeu par défaut.
          // Tellement génial le javascript.
          this.$refs.devZone.fetch_game_spec_from_loc_hash();
        });
      });
  },

  destroyed() {
    const elemGameInterface = this.$refs.gameinterface;
    // Je dois vérifier que elemGameInterface n'est pas Null.
    // Quand je recharge ma page, pas de problème.
    // Quand je modifie le code et que npm me recharge automatiquement la page
    // (d'une manière manifestement différente qu'un rechargement complet)
    // Ça me fait une erreur. Je sais pas pourquoi.
    // Osef, y'a qu'à checker.
    if (elemGameInterface) {
      elemGameInterface.removeEventListener('keydown', this.on_key_down);
    }
  },

  methods: {

    runPython(pythonCode, codeLabel) {
      let resultPython = null;
      try {
        resultPython = window.pyodide.runPython(pythonCode);
      } catch (err) {
        const errMessage = err.message;
        const errorDescription = `Erreur python durant l'action : \n${codeLabel}\n${errMessage}`;
        this.$refs.python_console.textContent += errorDescription;
        this.$refs.python_console.scrollTop = this.$refs.python_console.scrollHeight;
        // Je rethrow l'exception, parce que si le code python déconne,
        // vaut mieux pas essayer de faire d'autres choses après.
        throw err;
      }
      return resultPython;
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
      // TODO : on devrait peut-être pas redemander la taille du board à chaque fois.
      // Elle est pas censée changer.
      const boardSize = this.runPython(
        'board_model.get_size()',
        'Récupération de la taille du Board.',
      );
      const [boardWidth, boardHeight] = boardSize;
      const tilesData = this.runPython(
        'board_model.export_all_tiles()',
        'Récupération des tiles pour les dessiner',
      );

      for (let y = 0; y < boardHeight; y += 1) {
        for (let x = 0; x < boardWidth; x += 1) {
          const tileData = tilesData[y][x];
          for (let i = 0; i < tileData.length; i += 1) {
            const gameObject = tileData[i];
            const coordImg = this.tile_coords[gameObject];
            this.ctx_canvas_buffer.drawImage(
              this.tile_atlas,
              coordImg[0], coordImg[1],
              this.tilesize_tileset, this.tilesize_tileset,
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

    isStrTransitionalState(strVal) {
      return (strVal === 't' || strVal === 'T' || strVal === 'transitional_state');
    },

    send_game_event(eventName) {
      // infos à récupérer :
      // TODO : foutre ça dans de la doc.
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
      const eventResultRaw = this.runPython(
        'board_model.on_game_event(js.document.eventName)',
        `Exécution d'un événement ${eventName}`,
      );

      if (!isNonePython(eventResultRaw)) {
        // TODO : message d'erreur correct si c'est pas du json.
        const eventResult = JSON.parse(eventResultRaw);
        if ('delayed_actions' in eventResult) {
          // Syntaxe de for-loop de merde... Putain de javascript. Putain de linter.
          eventResult.delayed_actions.forEach((delayedAction) => {
            let delayTime = 500;
            if ('delay_ms' in delayedAction) {
              delayTime = delayedAction.delay_ms;
            }
            if ('name' in delayedAction) {
              const actionName = delayedAction.name;
              setTimeout(() => {
                this.send_game_event(actionName);
              }, delayTime);
            }
          });
        }
        if ('player_locks' in eventResult) {
          eventResult.player_locks.forEach((lockName) => {
            if (!this.player_locks.includes(lockName)) {
              this.player_locks.push(lockName);
            }
          });
          if (!this.is_player_locked && this.player_locks.length > 0) {
            this.is_player_locked = true;
          }
        }
        if ('player_unlocks' in eventResult) {
          eventResult.player_unlocks.forEach((unlockName) => {
            if (unlockName === '*') {
              this.player_locks = [];
            } else {
              this.player_locks = this.player_locks.filter((lockLoop) => lockLoop !== unlockName);
            }
          });
          if (this.is_player_locked && this.player_locks.length === 0) {
            this.is_player_locked = false;
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

      // https://hacks.mozilla.org/2017/03/internationalize-your-keyboard-controls/
      // C'est quand même un peu le bazar la gestion des touches dans les navigateurs.
      if (e.code in eventNameFromButton) {
        const eventName = eventNameFromButton[e.code];
        this.send_game_event(eventName);
        e.preventDefault();
      }
    },

    goUp() {
      this.send_game_event('U');
    },

    goRight() {
      this.send_game_event('R');
    },

    goDown() {
      this.send_game_event('D');
    },

    goLeft() {
      this.send_game_event('L');
    },

    action1() {
      this.send_game_event('action_1');
    },

    action2() {
      this.send_game_event('action_2');
    },

    async onUpdateGameSpec(urlTileset, jsonConf, gameCode) {
      if (this.current_url_tileset !== urlTileset) {
        // TODO : faire quelque chose si le chargement de l'image merdouille.
        this.tile_atlas = await loadImage(urlTileset);
        this.current_url_tileset = urlTileset;
      }
      // TODO : faire quelque chose si le json est pourri,
      // ou qu'il contient des coordonnées qui dépassent du tileset.
      this.json_conf = JSON.parse(jsonConf);
      this.tilesize_tileset = this.json_conf.tile_size;
      this.tile_coords = this.json_conf.tile_coords;
      this.$refs.python_console.textContent = '';
      this.runPython(
        gameCode,
        'Interprétation du gameCode.',
      );
      this.runPython(
        'board_model = BoardModel()',
        'Instanciation du BoardModel',
      );
      this.draw_rect();
      this.$refs.gameinterface.focus();
      console.log('First draw rect of updated game-code made.');
    },

    toggleDevZoneDisplay() {
      this.hideCode = !this.hideCode;
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .game button {
    width: 2em;
    height: 2em;
    background-color: #707070;
    font-size: 2em;
    font-weight: bold;
    border: 0;
    margin: 2px;
  }
  .game button:hover {
    background-color: #909090;
  }
  .game button:active {
    background-color: #B0B0B0;
  }
  /* https://www.a11yproject.com/posts/2013-01-25-never-remove-css-outlines/ */
  .game button:focus {
    outline: thin dotted;
  }

  canvas {
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    image-rendering: pixelated;
  }

  div.hidden {
    width: 0%;
    display: none;
  }

  .gameboard > div {
    padding-bottom: 1em;
  }

  .action-buttons {
    margin-top: 1.5em;
  }

  #python_console {
    width: 100%;
    height: 100%;
  }

  textarea {
    background-color: #202020;
    color: #D0D0D0;
    margin-bottom: 1em;
    font-size: 1.25em;
    font-family: monospace;
  }

  .footer {
    font-size: 0.8em;
  }

</style>
