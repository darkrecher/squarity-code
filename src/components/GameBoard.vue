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
      Tileset créé par Buch :
      <br>
      <a href="https://opengameart.org/users/buch">https://opengameart.org/users/buch</a>
    </p>
  </div>
</template>

<script>

import BoardModel from '../classes/BoardModel';

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
      board_model: new BoardModel(),
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
      },
    };
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
    this.draw_rect();
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

      for (let y = 0; y < this.board_model.h; y += 1) {
        for (let x = 0; x < this.board_model.w; x += 1) {
          const tileData = this.board_model.getTile(x, y);
          if (tileData !== ' ') {
            const coordImg = this.coord_img_from_data[tileData];
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
        this.board_model.sendGameAction(gameAction);
        this.draw_rect();
      }
    },

    goUp() {
      this.board_model.sendGameAction('U');
      this.draw_rect();
    },

    goRight() {
      this.board_model.sendGameAction('R');
      this.draw_rect();
    },

    goDown() {
      this.board_model.sendGameAction('D');
      this.draw_rect();
    },

    goLeft() {
      this.board_model.sendGameAction('L');
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
