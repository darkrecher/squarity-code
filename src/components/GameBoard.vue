<template>
  <div class="gameboard">
    <p>{{ msg }} - {{ message }}</p>

    <canvas id="c" />

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

    <p>
      Tileset créé par Buch:
      <br>
      <a href="https://opengameart.org/users/buch">https://opengameart.org/users/buch</a>
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
    <script type="text/python">
      print("pouet brython");
      from browser import document;
      document.brython_squarity = "re 789 zzxx";
      document <= "Hello ! et je suis un zozo";
      print("fin pouet " + document.brython_squarity);
      exec('try:print(document.brython_squarity_2);\nexcept:print("tant pis pour l autre var 2");');
      from lib_test import say_hello;
      say_hello();
      document.la_fonction_say_hello = say_hello;
      import board_model
    </script>
  </div>
</template>

<script>

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

const urlTilesetAtlas = require('../assets/dungeon_tiles_2.png');

export default {
  name: 'GameBoard',

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
      coord_img_from_data: {
        0: [48, 32],
        1: [96, 32],
        2: [96, 48],
        3: [96, 96],
        4: [48, 96],
        5: [32, 96],
        6: [32, 48],
        7: [32, 32],
        8: [48, 48],
        W: [88, 208],
        '|': [165, 132],
        '-': [142, 132],
        V: [32, 336],
        v: [32, 352],
        y: [32, 143],
        s: [216, 64],
        D: [156, 212],
        // TODO : la taille du sprite est plus grande que 16x16, et faudrait le décaler.
        // Pour l'instant on laisse comme ça, même si c'est moche.
        M: [197, 161],
        '[': [169, 83],
        ']': [185, 83],
        '(': [215, 99],
        ')': [215, 115],
      },
    };
  },

  beforeMount() {
    console.log('beforeMount zz');
  },

  mounted() {
    const canvasFinal = document.getElementById('c');
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
        console.log('I will load script and execute brython');
        window.brython(1);
        console.log('loaded script and executed brython');
        this.draw_rect();
        console.log('first draw rect made');
      })
      .catch(() => {
        // TODO : je sais jamais quoi mettre là dedans. Osef ?
      });
  },

  // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
  // C'est relou ces récupération d'appui de touches.
  // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
  created() {
    window.addEventListener('keydown', this.on_key_down);
  },
  destroyed() {
    window.removeEventListener('keydown', this.on_key_down);
  },

  methods: {

    async draw_rect() {
      // https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
      // clear canvas
      this.ctx_canvas_buffer.fillStyle = '#000000';
      // J'ai tenté clearRect. Mais ça ne marche pas bien.
      // Mon bonhomme reste dessiné sur les cases noires. Osef.
      this.ctx_canvas_buffer.fillRect(0, 0, 640, 448);
      let canvasX = 0;
      let canvasY = 0;

      this.tile_atlas = await loadImage(urlTilesetAtlas);
      const [boardWidth, boardHeight] = document.BoardModelGetSize();

      for (let y = 0; y < boardHeight; y += 1) {
        for (let x = 0; x < boardWidth; x += 1) {
          // TODO : moche. Faut préalablement récupérer la fonction pour qu'elle soit dans this.
          // C'est pas propre de la laisser trainer dans document.
          const tileData = document.BoardModelGetTile(x, y);

          for (let i = 0; i < tileData.length; i += 1) {
            const gameObject = tileData[i];
            const coordImg = this.coord_img_from_data[gameObject];
            // console.log("coordImg", coordImg)
            this.ctx_canvas_buffer.drawImage(
              this.tile_atlas,
              coordImg[0], coordImg[1], 16, 16,
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
      document.la_fonction_say_hello();
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

  #c {
    width: 600px;
    height: 400px;
    border: 1px solid gray;
  }

</style>
