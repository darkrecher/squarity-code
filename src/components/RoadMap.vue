<template>
  <div class="roadmap">
    <h1>Road map de Squarity</h1>
    <router-link to="/">
      Retour à la page principale.
    </router-link>
    <br>

    <div ref="tooltipWindow" class="tooltip-window" @click="hideTooltip">
      {{ tooltipWindow.text }}
      <br>
      <template v-if="tooltipWindow.linkEnabled">
        <a :href="tooltipWindow.linkUrl" target="_blank">
          {{ tooltipWindow.linkText }}
        </a>
      </template>
    </div>

    <div class="modal-wrapper" @click="hideModal">
      <div class="my-modal">
        <div class="my-modal-content">
          <img class="object-fit-contain gif-vision">
        </div>
      </div>
    </div>

    <div class="grid-container">
      <template v-for="item in roadSquares">
        <!--
          Je me pète les rouleaux à écrire `:key="item.key"` dans ce foutu code,
          parce que si je le met pas, je me fais jeter par Vue et/ou le linter.
          Tout ça pour ne pas avoir l'attribut key dans le DOM, et du coup je suis obligé de
          rajouter l'attribut myKey avec la même valeur dedans. Merci !!
        -->
        <div v-if="item.rank === 'origin'" ref="roadMapOrigin" :key="item.key" :myKey="item.key"
          :class="item.html_class" @click="toggleTooltip">
          <p>
            Cliquez sur les carrés
          </p>
          <img class="squarex" src="../assets/squarex.png">
          <img class="click-me" src="../assets/icon_click_me.png">
        </div>
        <div v-if="item.rank === 'superior'" :key="item.key" :myKey="item.key" :class="item.html_class"
          :gifVision="item.gif_vision" @click="showModal">
          <div>
            <p>
              <span>
                {{ item.title }}
              </span>
            </p>
          </div>
        </div>
        <div v-if="item.rank === 'vision'" :key="item.key" :myKey="item.key" :class="item.html_class"
          :gifVision="item.gif_vision" @click="showModal">
          <p class="vision">
            {{ item.title }}
          </p>
        </div>
        <div v-if="item.rank === 'normal'" :key="item.key" :myKey="item.key" :class="item.html_class"
          @click="toggleTooltip">
          <p>{{ item.title }}</p>
        </div>
        <div v-if="item.rank === 'empty'" :key="item.key" :class="item.html_class" />
      </template>
    </div>
  </div>
</template>

<script>

import roadMapDataWip from '/road_map_data.txt?raw';

import VISION_IDE_URL_GIF from '../assets/ide.gif';
import VISION_LEVEL_EDITOR_URL_GIF from '../assets/level_editor.gif';
import VISION_GAME_ENGINE_URL_GIF from '../assets/game_engine.gif';
import VISION_TUTO_URL_GIF from '../assets/tuto.gif';
import VISION_SPECIAL_EFFECT_URL_GIF from '../assets/special_effect.gif';
import VISION_CONTENT_GAMES_URL_GIF from '../assets/content_games.gif';
import VISION_SOCIAL_WEB_URL_GIF from '../assets/social_web.gif';
import VISION_EXPLODE_HEAD_URL_GIF from '../assets/explode_head.gif';

const GRID_LENGTH_IN_SQUARE = 11;
const SQUARE_SIZE_IN_EM = 11;

const URL_GIF_FROM_RM_DATA = {
  ide: VISION_IDE_URL_GIF,
  level_editor: VISION_LEVEL_EDITOR_URL_GIF,
  game_engine: VISION_GAME_ENGINE_URL_GIF,
  tuto: VISION_TUTO_URL_GIF,
  special_effect: VISION_SPECIAL_EFFECT_URL_GIF,
  content_games: VISION_CONTENT_GAMES_URL_GIF,
  social_web: VISION_SOCIAL_WEB_URL_GIF,
  explode_head: VISION_EXPLODE_HEAD_URL_GIF,
}

export default {
  name: 'RoadMap',
  madeFirstUpdate: false,

  props: {},

  data() {
    return {
      isTooltipVisible: false,
      squareXTooltip: null,
      squareYTooltip: null,
      roadSquares: [],
      dictSquareDescriptions: {},
      tooltipWindow: {
        text: 'coucou',
        linkEnabled: false,
        linkUrl: '',
        linkText: '',
      },
    };
  },

  async mounted() {
    const roadMapData = JSON.parse(roadMapDataWip);
    this.setRoadSquares(roadMapData.map_squares, roadMapData.unordered_road_squares);
  },

  updated() {
    // Cette fonction s'exécute après le mounted, quand tout le DOM a été mis à jour.
    // Elle s'exécute à chaque fois que le contenu de data est modifié.
    // Du coup, je met une condition à la con pour déclencher ça que à la première arrivée sur la page.
    if (!this.madeFirstUpdate) {
      this.madeFirstUpdate = true;

      if (this.$refs.roadMapOrigin.length === 1) {
        const elemRoadMapOrigin = this.$refs.roadMapOrigin[0];
        // scrollIntoView permet de scroller vers un élément particulier.
        elemRoadMapOrigin.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      }
    }
  },

  methods: {
    setRoadSquares(mapSquares, unorderedRoadSquares) {
      let emptySquareIndex = 0;
      const roadSquares = [];
      mapSquares.forEach((line) => {
        const splittedLine = line.split(' ');
        splittedLine.forEach((elem) => {
          if (elem === '...') {
            const emptySquare = {
              rank: 'empty',
              html_class: 'empty',
            };
            emptySquare.key = `v${emptySquareIndex}`;
            roadSquares.push(emptySquare);
            emptySquareIndex += 1;
          } else {
            let currentSquare = null;
            unorderedRoadSquares.forEach((square) => {
              if (square.key === elem) {
                currentSquare = square;
              }
            });
            if (currentSquare === null) {
              // Si on ne trouve pas la clé d'un square, on affiche un square de fail à la place.
              currentSquare = {
                key: elem,
                rank: 'superior',
                // Le square de fail a le même aspect visuel qu'un square
                // de la catégorie "special effect", parce qu'il est rouge flashy.
                // C'est pas très logique, on devrait avoir une classe html spéciale pour le fail,
                // mais je ne vais pas m'embêter plus que ça à gérer un cas qui n'est pas censé arriver.
                html_class: 'special-effect superior-square',
                title: `SQUARE FAIL key:${elem}`,
              };
            }
            roadSquares.push(currentSquare);
          }
        });
      });

      const dictSquareDescriptions = {};
      for (let square of roadSquares) {
        const oneSquareDescrip = {};
        oneSquareDescrip.description = square.description;
        if (('link_url' in square) && ('link_text' in square)) {
          oneSquareDescrip.linkUrl = square.link_url;
          oneSquareDescrip.linkText = square.link_text;
        }
        dictSquareDescriptions[square.key] = oneSquareDescrip;
      }
      this.roadSquares = roadSquares;
      this.dictSquareDescriptions = dictSquareDescriptions;
    },

    toggleTooltip(event) {
      // https://thewebdev.info/2022/03/11/how-to-fix-click-event-target-
      // gives-element-or-its-child-and-not-parent-element-with-vue-js/
      const container = event.currentTarget.parentNode;
      const arrayChildren = Array.prototype.slice.call(container.children);
      const indexRoadSquare = arrayChildren.indexOf(event.currentTarget);
      const newSquareY = Math.floor(indexRoadSquare / GRID_LENGTH_IN_SQUARE);
      const newSquareX = indexRoadSquare % GRID_LENGTH_IN_SQUARE;

      if (
        (this.squareXTooltip === null)
        || (this.squareXTooltip !== newSquareX)
        || (this.squareYTooltip !== newSquareY)
      ) {
        // Positionnement de la fenêtre de tooltip
        const styleTopEm = newSquareY * SQUARE_SIZE_IN_EM + SQUARE_SIZE_IN_EM + 3;
        let offsetX = 0;
        if (newSquareX === 0) {
          offsetX = SQUARE_SIZE_IN_EM - 1;
        } else if (newSquareX === GRID_LENGTH_IN_SQUARE - 2) {
          offsetX = -SQUARE_SIZE_IN_EM;
        } else if (newSquareX === GRID_LENGTH_IN_SQUARE - 1) {
          offsetX = -2 * SQUARE_SIZE_IN_EM;
        }
        const styleLeftEm = newSquareX * SQUARE_SIZE_IN_EM - SQUARE_SIZE_IN_EM + 2 + offsetX;

        this.isTooltipVisible = true;
        this.$refs.tooltipWindow.style.display = 'block';
        this.squareXTooltip = newSquareX;
        this.squareYTooltip = newSquareY;
        this.$refs.tooltipWindow.style.top = `${styleTopEm.toString()}em`;
        this.$refs.tooltipWindow.style.left = `${styleLeftEm.toString()}em`;
        const squareKey = event.currentTarget.getAttribute('myKey');
        const squareDescription = this.dictSquareDescriptions[squareKey];
        this.tooltipWindow.text = squareDescription.description;

        if (('linkUrl' in squareDescription) && ('linkText' in squareDescription)) {
          this.tooltipWindow.linkEnabled = true;
          this.tooltipWindow.linkText = squareDescription.linkText;
          this.tooltipWindow.linkUrl = squareDescription.linkUrl;
        } else {
          this.tooltipWindow.linkEnabled = false;
        }
      } else {
        this.hideTooltip();
      }
    },

    hideTooltip() {
      this.isTooltipVisible = false;
      this.$refs.tooltipWindow.style.display = 'none';
      this.squareXTooltip = null;
      this.squareYTooltip = null;
    },

    showModal(event) {
      const modal = document.querySelector('.modal-wrapper');
      modal.style.display = 'block';
      const gifImgInModal = modal.querySelector('.gif-vision');
      const imgSource = event.currentTarget.getAttribute('gifVision');
      gifImgInModal.src = URL_GIF_FROM_RM_DATA[imgSource];
    },

    hideModal() {
      const modal = document.querySelector('.modal-wrapper');
      modal.style.display = 'none';
    },
  },

};

</script>

<style scoped>

a {
  color: #A0A0D0;
}

.roadmap {
  background-color: #202020;
  overflow-x:auto;
}

.grid-container {
  display: grid;
  grid-template-columns: 11em 11em 11em 11em 11em 11em 11em 11em 11em 11em 11em;
  font-weight: bold;
  width: fit-content;
}

.grid-container>div {
  text-align: center;
  height: 11em;
  /* Ça, c'est pour que le texte ne s'affiche pas en dehors du carré. */
  overflow: hidden;
  color: black;
  /* Spéciale dédicace à Hundraw. Merci !! */
  display: flex;
  justify-content: center;
  align-items: center;
  background-clip: content-box, padding-box;
  box-sizing: border-box;
  flex-direction: column;
  background-clip: padding-box;
  border: 5px solid #202020;
  padding: 0 5px 0 5px;
}

.road-map-origin {
  background-color: #004000;
}

.road-map-origin p {
  font-weight: bolder;
  color: #00D000;
  margin: 0.2em 0 0.5em 0;
}

.squarex {
  height: 7em;
  margin: 0.2em 0 0.5em 0;
}

.click-me {
  height: 2em;
}

.special-effect {
  background-color: #D30000;
}

.game-engine {
  background-color: #00A3FF;
}

.ide {
  background-color: #00B512;
}

.tuto {
  background-color: #95AF00;
}

.level {
  background-color: #8F47E0;
}

.promo {
  background-color: #FF7B23;
}

.social {
  background-color: #00E8FF;
}

.optim {
  background-color: #E5E500;
}

.special-effect-undone {
  background-color: #EF8B8B;
}

.game-engine-undone {
  background-color: #7EB0CC;
}

.ide-undone {
  background-color: #BAD8BD;
}

.tuto-undone {
  background-color: #ABC191;
}

.level-undone {
  background-color: #B19FC6;
}

.promo-undone {
  background-color: #E5B392;
}

.social-undone {
  background-color: #AAD1D5;
}

.optim-undone {
  background-color: #D8D8AB;
}

.roadmap {
  position: relative;
}

.vision {
  margin: 0.5em;
  border: 10px solid #484848;
  border-radius: 20px;
  padding: 0.5em;
  background-image: url("../assets/vision_background.png");
  background-repeat: repeat;
}

/* --- root squares --- */

div.superior-square {
  padding: 10px;
}

.superior-square div {
  padding: 10px;
  height: 100%;
  width: 100%;
}

.superior-square span {
  font-size: 1.0em;
  font-weight: bolder;
  white-space: pre-wrap;
}

.special-effect.superior-square {
  background-color: #F2B3B3;
}

.special-effect.superior-square div {
  background-color: #D30000;
}

.ide.superior-square {
  background-color: #B3E9B8;
}

.ide.superior-square div {
  background-color: #00B512;
}

.game-engine.superior-square {
  background-color: #00E8FF;
}

.game-engine.superior-square div {
  background-color: #00A3FF;
}

.tuto.superior-square {
  background-color: #F9FFC4;
}

.tuto.superior-square div {
  background-color: #95AF00;
}

.level.superior-square {
  background-color: #DEC8F6;
}

.level.superior-square div {
  background-color: #8F47E0;
}

.promo.superior-square {
  background-color: #FFD8BD;
}

.promo.superior-square div {
  background-color: #FF7B23;
}

.social.superior-square {
  background-color: #B3F8FF;
}

.social.superior-square div {
  background-color: #00E8FF;
}

.optim.superior-square {
  background-color: #F7F7B3;
}

.optim.superior-square div {
  background-color: #E5E500;
}

.empty {
  background-color: #202020;
}

/* --- pour la fenêtre de tooltip --- */

.tooltip-window {
  position: absolute;
  display: none;
  width: 40em;
  top: 0px;
  left: 0px;
  text-align: left;
  font-family: monospace;
  background-color: #343434;
  color: #f1f1f1;
  border: 10px solid #c7c7c7;
  /* https://stackoverflow.com/questions/20382037/css-border-radius-and-solid-border-curved-inside */
  border-radius: 20px;
  padding: 10px;
  display: none;
  color: #f1f1f1;
  /* Ne pas utiliser le tag "pre", ça met le bronx.
     https://stackoverflow.com/questions/36729634/rendering-newline-character-in-vuejs
     pre-line, c'est mieux que pre-wrap
     https://developer.mozilla.org/en-US/docs/Web/CSS/white-space#values
  */
  white-space: pre-line;
}

/* --- Pour la grosse fenêtre modale avec une gif dedans --- */
/* https://www.codewithrandom.com/2022/08/10/popup-box-with-html-css/ */

.modal-wrapper {
  background: rgba(0, 0, 0, 0.508);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: none;
}

/* Ne pas utiliser le nom de classe "modal" !!!
   Ce nom est repéré par d'autres trucs (Le css par défaut ? Vue ? Un composant dans Vue ? J'en sais rien)
   Tout ce qui a cette classe est invisible par défaut, me demandez pas pourquoi.
*/
.my-modal {
  background: #c7c7c7;
  padding: 1vh 1vw 1vh 1vw;
  margin: 1vh 1vw 1vh 1vw;
  border-radius: 40px;
  position: relative;
}

/* Pareil avec modal-content. Faut pas l'utiliser, ça met du CSS qu'on veut pas. */
.my-modal-content {
  /* Nombres magiques en vw et vh, parce que je comprends rien au CSS
     Ça tombe pas juste. Ça se décale un peu en fonction de la largeur de la fenêtre. Osef.
  */
  width: 95vw;
  height: 94vh;
  background: #343434;
  margin: auto;
  border-radius: 40px;
}

/* https://stackoverflow.com/questions/34713763/force-an-image-to-fit-and-keep-aspect-ratio */
.object-fit-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
