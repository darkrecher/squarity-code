<template>
  <div class="roadmap">
    <h1>Ici, il y aura la road map.</h1>
    <router-link to="/">
      Lien de retour vers le jeu, mais il est dans mon fichier Roadmap.vue, et ça marche.
    </router-link>
    hahaha !!!
    <br>

    <div id="tooltipWindow" class="tooltip-window" @click="hide_tooltip">
      tooltip text placeholder.
    </div>

    <div class="modal-wrapper" @click="hide_modal">
      <div class="my-modal">
        <div class="my-modal-content">
          <img class="object-fit-contain gif-vision">
        </div>
      </div>
    </div>

    <div class="grid-container">
      <div>
        <p>
          1 haha il se passe quoi si le texte est très très très très très très très très très très très très très
          très
          très très très très long pouet pouet pouet pouet pouet pouet pouet pouet pouet pouet ha ha ha ha
        </p>
      </div>

      <template v-for="item in road_squares">
        <!--
          Je me pète les rouleaux à écrire `:key="item.key"` dans ce foutu code,
          parce que si je le met pas, je me fais jeter par Vue et/ou le linter.
          Tout ça pour ne pas avoir l'attribut key dans le DOM, et du coup je suis obligé de
          rajouter l'attribut my_key avec la même valeur dedans. Merci !!
        -->
        <div v-if="item.rank === 'origin'" id="roadMapOrigin" :key="item.key" :my_key="item.key"
          :class="item.html_class" @click="toggle_tooltip">
          <p>
            Cliquez-moi dessus
          </p>
          <img class="squarex" src="../assets/squarex.png">
          <img class="click-me" src="../assets/icon_click_me.png">
        </div>
        <div v-if="item.rank === 'superior'" :key="item.key" :my_key="item.key" :class="item.html_class"
          :gif_vision="item.gif_vision" @click="show_modal">
          <div>
            <p>
              <span>
                {{ item.title }}
              </span>
            </p>
          </div>
        </div>
        <div v-if="item.rank === 'vision'" :key="item.key" :my_key="item.key" :class="item.html_class"
          :gif_vision="item.gif_vision" @click="show_modal">
          <p class="vision">
            {{ item.title }}
          </p>
        </div>
        <div v-if="item.rank === 'normal'" :key="item.key" :my_key="item.key" :class="item.html_class"
          @click="toggle_tooltip">
          <p>{{ item.title }}</p>
        </div>
        <div v-if="item.rank === 'empty'" :key="item.key" :class="item.html_class" />
      </template>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: 'RoadMap',

  props: {},

  data() {
    return {
      is_tooltip_visible: false,
      square_x_tooltip: null,
      square_y_tooltip: null,
      // TODO : comment on déclare et comment on utilise
      // des constantes dans ce fichu langage ?
      GRID_LENGTH_IN_SQUARE: 11,
      road_squares: [],
      dict_square_descriptions: {},
    };
  },

  async mounted() {
    // TODO : il faut un "machin qui tourne" tant qu'on n'a pas récupéré le json.
    const roadMapData = await axios.get('/road_map_data.json');
    this.setRoadSquares(roadMapData.data.map_squares, roadMapData.data.unordered_road_squares);
  },

  updated() {
    // Cette fonction s'exécute après le mounted, quand tout le DOM a été mis à jour.
    // Et peut-être qu'elle s'exécute à d'autre moments, mais j'ai pas repéré.
    //
    // scrollIntoView permet de scroller vers un élément particulier.
    document.getElementById('roadMapOrigin').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
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
            // TODO : faire un truc si currentSquare est toujours null.
            // mais pas de console.log, parce qu'apparemment, c'est le mal.
            if (currentSquare !== null) {
              roadSquares.push(currentSquare);
            }
          }
        });
      });

      const dictSquareDescriptions = {};
      // C'est vraiment une syntaxe de merde, ces forEach.
      // Je peux pas faire de "for ... of" à cause de ce crétin de linter.
      roadSquares.forEach((square) => {
        const oneSquareDescrip = {};
        oneSquareDescrip.description = square.description;
        if (('link_url' in square) && ('link_text' in square)) {
          oneSquareDescrip.link_url = square.link_url;
          oneSquareDescrip.link_text = square.link_text;
        }
        dictSquareDescriptions[square.key] = oneSquareDescrip;
      });
      this.road_squares = roadSquares;
      this.dict_square_descriptions = dictSquareDescriptions;
    },

    toggle_tooltip(event) {
      // https://thewebdev.info/2022/03/11/how-to-fix-click-event-target-
      // gives-element-or-its-child-and-not-parent-element-with-vue-js/
      console.log(event.currentTarget);
      const tooltipWindow = document.getElementById('tooltipWindow');
      const container = event.currentTarget.parentNode;
      console.log(container);
      const arrayChildren = Array.prototype.slice.call(container.children);
      const indexRoadSquare = arrayChildren.indexOf(event.currentTarget);
      const newSquareY = Math.floor(indexRoadSquare / this.GRID_LENGTH_IN_SQUARE);
      const newSquareX = indexRoadSquare % this.GRID_LENGTH_IN_SQUARE;
      console.log(newSquareX, newSquareY);

      if (
        (this.square_x_tooltip === null)
        || (this.square_x_tooltip !== newSquareX)
        || (this.square_y_tooltip !== newSquareY)
      ) {
        // Positionnement de la fenêtre de tooltip
        // TODO : il y a des valeurs à la con, qu'il faudra mettre dans des constantes.
        const styleTopEm = newSquareY * 11 + 8;
        const styleLeftEm = newSquareX * 11 + 12;
        this.is_tooltip_visible = true;
        tooltipWindow.style.display = 'block';
        this.square_x_tooltip = newSquareX;
        this.square_y_tooltip = newSquareY;
        tooltipWindow.style.top = `${styleTopEm.toString()}em`;
        tooltipWindow.style.left = `${styleLeftEm.toString()}em`;
        // Modification du texte dans la fenêtre de tooltip.
        // Avec du inner HTML à la crade, et puis c'est tout.
        const squareKey = event.currentTarget.getAttribute('my_key');
        const squareDescription = this.dict_square_descriptions[squareKey];
        tooltipWindow.innerHTML = squareDescription.description;
        if (('link_url' in squareDescription) && ('link_text' in squareDescription)) {
          tooltipWindow.innerHTML += `<br><a href=${squareDescription.link_url} target="_blank">`
            + `${squareDescription.link_text}</a>`;
        }
      } else {
        this.hide_tooltip();
      }
    },

    hide_tooltip() {
      const tooltipWindow = document.getElementById('tooltipWindow');
      this.is_tooltip_visible = false;
      tooltipWindow.style.display = 'none';
      this.square_x_tooltip = null;
      this.square_y_tooltip = null;
    },

    show_modal(event) {
      const modal = document.querySelector('.modal-wrapper');
      modal.style.display = 'block';
      const gifImgInModal = modal.querySelector('.gif-vision');
      const imgSource = event.currentTarget.getAttribute('gif_vision');
      // https://stackoverflow.com/questions/40491506/vue-js-dynamic-images-not-working
      const imageGetter = require.context('../assets/', false, /\.gif$/);
      gifImgInModal.src = imageGetter(`./${imgSource}`);
    },

    hide_modal() {
      const modal = document.querySelector('.modal-wrapper');
      modal.style.display = 'none';
    },
  },

};

// Version 0.0 de la roadmap :
// https://miro.com/app/board/o9J_llTFtxw=/
</script>

<style scoped>
.roadmap {
  background-color: #202020;
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
  /* Ne pas utiliser le tag "pre", ça met le bronx. */
  /* https://stackoverflow.com/questions/36729634/rendering-newline-character-in-vuejs */
  white-space: pre-wrap
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
     Ça tombe pas juste. Ça se décale un peu en fonction de la largeur de la fenêtre. Osef. */
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
