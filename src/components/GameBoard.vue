<template>
  <div class="gameboard">
    <p>{{ msg }} - {{ message }}</p>

    <div>
      <button @click="toggleCodeDisplay">
        Masquer / Afficher le code.
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
            <!-- https://www.w3schools.com/charsets/ref_utf_arrows.asp -->
            <div>
              <button @click="goUp">
                &#x21e7;
              </button>
            </div>
            <div>
              <button @click="goLeft">
                &#x21e6;
              </button>
              <button @click="goDown">
                &#x21e9;
              </button>
              <button @click="goRight">
                &#x21e8;
              </button>
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
            <GameUserCode
              ref="gameUserCode"
              @update-user-code="onUpdateCode"
            />
          </div>
        </b-col>
      </b-row>
    </b-container>

    <p>
      Le tileset du jeu du magicien a été créé par Buch :
      <a href="https://opengameart.org/content/dungeon-tileset">https://opengameart.org/content/dungeon-tileset</a>
      <br>
      Les aventures de H2O sont inspirées
      <a href="https://www.vtechda.com/Store/ITMax/ContentDetail/FR_fre_1838_58-126805-000-289_False.html">
        du jeu "H2O" sur la mini-console Storio.
      </a>
      <br>
      <a href="https://github.com/darkrecher/squarity-code">Code source sur github.</a>
    </p>

    <!--

      1)
      On peut exécuter du code python dans une balise "text/python".
      Il est possible d'échanger des données (variables, fonctions) entre brython et js,
      en lisant/écrivant des données dans "document".
      En JS, document existe dès le départ (c'est le document HTML actuel),
      en brython, il suffit de faire "from browser import document".

      2)
      Le fait d'importer une lib python,
      (Par exemple : from lib_test import say_hello)
      déclenche une requête ajax synchrone.
      Et ça lève un warning dans le navigateur :
        [Deprecation] Synchronous XMLHttpRequest on the main thread is deprecated because of
        its detrimental effects to the end user's experience.
        For more help, check https://xhr.spec.whatwg.org/.
      Réponse de brython à ce problème :
      "les développeurs de navigateurs web désactiveront pas de sitôt les appels ajax bloquants"
      https://brython.info/static_doc/en/faq.html
      Du coup, je peux me permettre de m'en tamponner.

      3)
      TODO : Ça, ça marche pas :
      from python_libs.lib_test import say_hello;
      Les libs python doivent être dans la racine du site.
      Pourtant la doc brython dit qu'on peut importer depuis des sous-répertoires.
      À condition d'avoir mis le fichier __init__.py comme il faut.
      Mais ça n'a pas marché.
      J'espère que ça va pas poser de problème.

      4)
      Tous les sauts de ligne dans la balise text/python sont flingués.
      Je suppose que c'est Vue ou ESLint qui fait ça (minification, ou un truc du genre).
      Mais ça aide pas pour le python, dans lequel les sauts de lignes sont significatifs.
      Du coup, je suis obligé de mettre des points-virgules partout !
      TODO : si on peut trouver une solution plus élégante, ce serait bien.
      Peut-être en important depuis un fichier .py.
      Mais il faut que la compilation du user-code soit accessible.
    -->
    <script type="text/python">
      print("Compilation user code start.");
      from browser import document;
      import board_model;
      compiled_code = compile(document.userCode, "user_code", "exec");
      exec(compiled_code);
      board_model = BoardModel();
      document.BoardModelGetTile = board_model.get_tile;
      document.BoardModelSendGameAction = board_model.send_game_action;
      document.BoardModelGetSize = board_model.get_size;
      print("Compilation user code end.");
    </script>
  </div>
</template>

<script>

import GameUserCode from './GameUserCode.vue';

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

export default {
  name: 'GameBoard',
  components: {
    GameUserCode,
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
      message: '-+-+-',
      tile_width: 32,
      tile_height: 32,
      hideCode: false,
    };
  },

  beforeMount() {
  },

  mounted() {
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

    // Si j'arrive jusqu'au bout avec cet astuce, je met 3000 upvotes à cette réponse :
    // https://stackoverflow.com/questions/45047126/how-to-add-external-js-scripts-to-vuejs-components
    //
    // La récupération du script fonctionnait aussi comme ça :
    // this.$loadScript('https://cdn.jsdelivr.net/npm/brython@3.8.9/brython.min.js')
    // Mais je ne veux pas être dépendant d'un CDN.
    //
    // Le fichier brython.min.js nécessite ce fichier :
    // https://cdn.jsdelivr.net/sm/86dc384fe8720364cf614210eddbfe3303d45efbc7b1981d42011efb5ace5ffd.map
    // que j'ai récupéré en local, dans /public/sm.
    this.$loadScript('/brython/brython.min.js')
      .then(() => {
        console.log('Brython lib loaded.');
        // Et donc là, j'envoie un message à un autre component, qui va en retour me renvoyer
        // le message "update-user-code" pour activer le jeu par défaut.
        // Tellement génial le javascript.
        this.$refs.gameUserCode.example_magician();
      })
      .catch(() => {
        // Je sais jamais quoi mettre là dedans.
        // Dans ce cas en particulier, si j'ai pas la lib brython, j'ai rien du tout.
        // Et c'est pas censé arriver car cette lib est sur le même serveur
        // que ce fichier GameBoard.vue. Donc, je décide que "not supposed to happen",
        // et je ne fais rien de spécial dans cette fonction catch().
      });
  },

  destroyed() {
    const elemGameInterface = this.$refs.gameinterface;
    elemGameInterface.removeEventListener('keydown', this.on_key_down);
  },

  methods: {

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
      const [boardWidth, boardHeight] = document.BoardModelGetSize();

      for (let y = 0; y < boardHeight; y += 1) {
        for (let x = 0; x < boardWidth; x += 1) {
          // TODO : moche. Faut préalablement récupérer la fonction pour qu'elle soit dans this.
          // C'est pas propre de la laisser trainer dans "document".
          const tileData = document.BoardModelGetTile(x, y);

          for (let i = 0; i < tileData.length; i += 1) {
            const gameObject = tileData[i];
            const coordImg = this.coords_tileset[gameObject];
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

    on_key_down(e) {
      const GameActionFromDir = {
        ArrowUp: 'U',
        ArrowRight: 'R',
        ArrowDown: 'D',
        ArrowLeft: 'L',
      };

      if (e.key in GameActionFromDir) {
        const gameAction = GameActionFromDir[e.key];
        document.BoardModelSendGameAction(gameAction);
        this.draw_rect();
      }
    },

    goUp() {
      document.BoardModelSendGameAction('U');
      this.draw_rect();
    },

    goRight() {
      document.BoardModelSendGameAction('R');
      this.draw_rect();
    },

    goDown() {
      document.BoardModelSendGameAction('D');
      this.draw_rect();
    },

    goLeft() {
      document.BoardModelSendGameAction('L');
      this.draw_rect();
    },

    async onUpdateCode(urlTileset, coordsTileset, userCode) {
      if (this.current_url_tileset !== urlTileset) {
        // TODO : faire quelque chose si le chargement de l'image merdouille.
        this.tile_atlas = await loadImage(urlTileset);
        this.current_url_tileset = urlTileset;
      }
      // TODO : faire quelque chose si le json est pourri,
      // ou qu'il contient des coordonnée qui dépasse du tileset.
      this.coords_tileset = JSON.parse(coordsTileset);
      // TODO : très très vilain. On met des données de différents types
      // dans le même dictionnaire JSON.
      this.tilesize_tileset = this.coords_tileset.tilesize;

      document.userCode = userCode;
      // Tous les exemples indiquent de déclencher la fonction brython dans le onload.
      // Mais on peut aussi l'exécuter où on veut, avec window.brython.
      // Énorme merci à cette issue github :
      // https://github.com/brython-dev/brython/issues/793
      // TODO : faudra peut-être pas garder le "1". C'est pour dire qu'on veut du debug.
      window.brython(1);

      this.draw_rect();
      console.log('First draw rect of updated user-code made.');
    },

    toggleCodeDisplay() {
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
    border-color: black;
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

</style>
