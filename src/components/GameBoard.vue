<template>
  <div class="gameboard">
    <p>{{ msg }} - {{ message }}</p>

    <canvas id="c" />
    <div>
      <button @click="goLeft">
        &lt;-
      </button>
      <button @click="goRight">
        -&gt;
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
      message: 'Vue + Canvas API',
      ctxCanvas: null,
      boardModel: new BoardModel(),
      rectWidth: 200,
      tileWidth: 32,
      tileHeight: 32,
      tileAtlas: null,
      coordImgFromData: {
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
    this.ctxCanvasFinal = canvasFinal.getContext('2d');
    // Il faut définir explicitement la taille du canvas, à cet endroit du code,
    // pour définir en même temps la taille de la zone de dessin pour le RenderingContext2D.
    // https://www.w3schools.com/tags/att_canvas_width.asp
    // TODO : il faudra quand même l'adapter à la taille de la fenêtre,
    //        et aux proportions du BoardModel aussi.
    canvasFinal.width = 600;
    canvasFinal.height = 448;
    this.canvasBuffer = document.createElement('canvas');
    this.ctxCanvasBuffer = this.canvasBuffer.getContext('2d');
    this.canvasBuffer.width = 600;
    this.canvasBuffer.height = 448;
    this.drawRect();
  },

  // https://www.raymondcamden.com/2019/08/12/working-with-the-keyboard-in-your-vue-app
  // C'est relou ces récupération d'appui de touches.
  // Je pensais que Vue aurait prévu un truc pour ça. Bienvenue dans les années 80.
  created() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {

    async drawRect() {
      // https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
      // clear canvas
      this.ctxCanvasBuffer.fillStyle = '#000000';
      // J'ai tenté clearRect. Mais ça ne marche pas bien.
      // Mon bonhomme reste dessiné sur les cases noires. Osef.
      this.ctxCanvasBuffer.fillRect(0, 0, 640, 448);
      let canvasX = 0;
      let canvasY = 0;

      this.tileAtlas = await loadImage(urlTilesetAtlas);

      for (let y = 0; y < this.boardModel.h; y += 1) {
        for (let x = 0; x < this.boardModel.w; x += 1) {
          const tileData = this.boardModel.getTile(x, y);
          if (tileData !== ' ') {
            const coordImg = this.coordImgFromData[tileData];
            // console.log("coordImg", coordImg)
            this.ctxCanvasBuffer.drawImage(
              this.tileAtlas,
              coordImg[0], coordImg[1], 16, 16,
              canvasX, canvasY, this.tileWidth, this.tileHeight,
            );
          }
          canvasX += this.tileWidth;
        }
        canvasX = 0;
        canvasY += this.tileHeight;
      }
      this.ctxCanvasFinal.drawImage(this.canvasBuffer, 0, 0);
    },

    onKeyDown(e) {
      // TODO : Je vais laisser ce log trainer un moment.
      // Pour être sûr que l'event listener se désactive quand le GameBoard n'est plus là.
      console.log('onKeyDown', e.key);

      const GameActionFromDir = {
        ArrowUp: 'U',
        ArrowRight: 'R',
        ArrowDown: 'D',
        ArrowLeft: 'L',
      };

      if (e.key in GameActionFromDir) {
        const gameAction = GameActionFromDir[e.key];
        this.boardModel.sendGameAction(gameAction);
        this.drawRect();
      }
    },

    goUp() {
      this.boardModel.sendGameAction('U');
      this.drawRect();
    },

    goRight() {
      this.boardModel.sendGameAction('R');
      this.drawRect();
    },

    goDown() {
      this.boardModel.sendGameAction('D');
      this.drawRect();
    },

    goLeft() {
      this.boardModel.sendGameAction('L');
      this.drawRect();
    },

  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #c {
    width: 600px;
    height: 400px;
    border: 1px solid gray;
  }

</style>
