<template>
  <div class="gameboard">
    <p>{{ msg }} - {{ message }}</p>

    <div class="game-and-code">
      <!--
        Ne pas oublier le tabindex=0, sinon on peut pas choper les touches.
        https://laracasts.com/discuss/channels/vue/vuejs-listen-for-key-events-on-div
      -->
      <div
        ref="gameinterface"
        tabindex="0"
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

      <div>
        <GameUserCode @update-user-code="onUpdateCode" />
      </div>
    </div>

    <p>
      Le tileset du jeu du magicien a été créé par Buch :
      <a href="https://opengameart.org/content/dungeon-tileset">https://opengameart.org/content/dungeon-tileset</a>
      <br>
      Les aventures de H2O sont inspirés
      <a href="https://www.vtechda.com/Store/ITMax/ContentDetail/FR_fre_1838_58-126805-000-289_False.html">
        du jeu "H2O" sur la mini-console Storio.
      </a>
    </p>

    <!--
      une fois que ce code est exécuté,
      on peut lire la variable document.brython_squarity dans la console.
      Et si on a préalablement défini document.brython_squarity_2, on la voit dans la console.
      Par contre, tous les sauts de ligne sont flingués. Ça aide pas, en python.
      On réglera ça plus tard.
    -->
    <!--
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

      FUTURE :
      Ça, ça marche pas :
      from python_libs.lib_test import say_hello;
      Les libs python doivent être dans la racine du site.
      Pourtant Brython dit qu'on peut importer depuis des sous-répertoires.
      À condition d'avoir mis le fichier __init__.py comme il faut.
      Mais ça a pas marché.
      J'espère que ça va pas poser de problème.
    -->
    <!--
      BIG BIG TODO : c'est tout crade. J'ai fait nimp et j'ai mis du log partout.
      Mais ça marche. Faut juste nettoyer tout ça.
    -->
    <script type="text/python">
      print("pouet brython");
      from browser import document;
      import board_model;
      compiled_code = compile(document.userCode, "user_code", "exec");
      exec(compiled_code);
      board_model = BoardModel();
      document.BoardModelGetTile = board_model.get_tile;
      document.BoardModelSendGameAction = board_model.send_game_action;
      document.BoardModelGetSize = board_model.get_size;
      print("Compilation du user code OK.");
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
      // J'ai pas besoin d'initialiser toutes mes variables membres là-dedans.
      // Du coup, ça sert à quoi ce truc ?
      message: 'Vue + Canvas API',
      tile_width: 32,
      tile_height: 32,
    };
  },

  beforeMount() {
    console.log('beforeMount zz');
  },

  mounted() {
    // Utiliser la variable $refs pour récupérer tous les trucs référencés dans le template.
    // https://vuejs.org/v2/guide/migration.html#v-el-and-v-ref-replaced
    const canvasFinal = this.$refs.gamecanvas;
    this.ctx_canvas_final = canvasFinal.getContext('2d');
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de dessin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // TODO : il faudra quand même l'adapter à la taille de la fenêtre,
    //        et aux proportions du BoardModel aussi.
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
        // TODO : faudra peut-être pas garder le "1". C'est pour dire qu'on veut du debug.
        // Tous les exemples indiquent de déclencher la fonction brython dans le onload.
        // Mais on peut aussi l'exécuter où on veut, avec window.brython.
        // Énorme merci à cette issue github :
        // https://github.com/brython-dev/brython/issues/793
        console.log('I will NOT load script and execute brython');
        // window.brython(1);
        // console.log('loaded script and executed brython');
        // document.compileUserCode();
        // console.log('compiled user code');
        // this.draw_rect();
        // console.log('first draw rect made');
      })
      .catch(() => {
        // TODO : je sais jamais quoi mettre là dedans. Osef ?
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
          // C'est pas propre de la laisser trainer dans document.
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
      // TODO : Je vais laisser ce log trainer un moment.
      // Pour être sûr que l'event listener se désactive quand le GameBoard n'est plus là.
      console.log('on_key_down', e.key);

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
      // TODO : rien à foutre là, mais c'est pour du test.
      // window.brython(1);
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
      console.log('update-user-code pouet');
      // console.log(userCode);
      document.userCode = userCode;
      window.brython(1);
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
      this.draw_rect();
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  button {
    width: 2em;
    height: 2em;
    background-color: #707070;
    font-size: 2em;
    font-weight: bold;
  }

  #gamecanvas {
    width: 640px;
    height: 448px;
    border: 1px solid gray;
    image-rendering: pixelated;
  }

  .game-and-code {
    display: flex;
  }

  .game-and-code > div{
    width:50%;
    padding:5px;
  }

</style>
