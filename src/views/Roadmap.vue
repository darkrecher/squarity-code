<template>
  <div class="roadmap">
    <h1>Ici, il y aura la road map.</h1>
    <router-link to="/">
      Lien de retour vers le jeu, mais il est dans mon fichier Roadmap.vue, et ça marche.
    </router-link>
    hahaha !!!
    <br>

    <div id="tooltipWindow" class="tooltip-window" @click="hide_tooltip">
      <br>
      Je suis un énorme tas de texte dans le tooltip
      <br>
      Je suis un énorme tas de texte dans le tooltip
      <br>
      Je suis un énorme tas de texte dans le tooltip
      <br>
      Je suis un énorme tas de texte dans le tooltip
      <br>
      Je suis un énorme tas de texte dans le tooltip zouzou prout plop
      <br>
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
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div class="game-engine" @click="toggle_tooltip">
        <p>
          Game Object affichant une valeur ou une information.
        </p>
        <div class="tooltip-text">
          Types de Game Object :
          <br>
          - Du texte ou des nombres, pour indiquer un score, une quantité d'argent, ...
          <br>
          - Un rectangle de taille variable, qui s'étend sur plusieurs cases,
          pour indiquer une barre de vie, de mana, ...
          <br>
          - Affichage d'une quantité sous forme de camembert.
          <br>
          - Une mini-map ? (À déterminer précisément)
          <br>
          <br>
          Il faudra rendre ces indicateurs suffisamment configurables : taille, couleur, bord arrondi,
          police de caractère, ... Mais pas trop, car ça doit rester simple.
          <br>
          Pour des indicateurs plus spécifiques, il faudra se créer ses propres game objects,
          et coder leur comportement directement dans le game-code.
        </div>
      </div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>

      <div style="background-color: lightblue;" @click="toggle_tooltip">
        <p>
          aaa
        </p>
        <div class="tooltip-text">
          Blabla
          <br>
          Blou
        </div>
      </div>

      <div class="special-effect superior-square">
        <p>
          <span>
            "Effets spéciaux"
          </span>
        </p>
      </div>
      <div class="game-engine superior-square">
        <p>
          <span>
            Moteur du jeu
          </span>
        </p>
      </div>
      <div class="ide superior-square">
        <p>
          <span>
            Environnement de développement intégré
          </span>
        </p>
      </div>
      <div class="empty" />
      <div>z7</div>
      <div class="game-engine">
        <p>
          Rendre l'aire de jeu redimensionnable dynamiquement
        </p>
      </div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>
        7a
      </div>
      <div class="tuto superior-square">
        <p>
          <span>
            Tutoriels
            <br><br>
            Docs
            <br><br>
            Exemples
          </span>
        </p>
      </div>
      <div class="empty" />
      <div class="level superior-square" gif_vision="dancing-banana-gif-moving-5.gif" @click="show_modal">
        <p>
          <span>
            Éditeur de niveaux Gestion des tilesets
          </span>
        </p>
      </div>
      <div>z2</div>
      <div>z3</div>
      <div class="empty" />
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div class="promo superior-square">
        <p>
          <span>
            Contenu
            <br><br>
            Jeux
            <br><br>
            Promotion
          </span>
        </p>
      </div>
      <div class="social superior-square">
        <p>
          <span>
            Social
            <br><br>
            Site web
          </span>
        </p>
      </div>
      <div class="optim superior-square">
        <p>
          <span>
            Auto-formation
            <br><br>
            Optimisation
          </span>
        </p>
      </div>
      <div class="empty" />
      <div class="empty" />
      <div class="empty" />
      <div class="empty" />
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
          <p>
            <span>
              {{ item.title }}
            </span>
          </p>
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
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>
      <div>z2</div>
      <div>z3</div>
      <div>z4</div>
      <div>z5</div>
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RoadMap',

  props: {},

  data() {
    const mapSquares = [
      '... ... ... e00 g00 i00 ... ... ... ...',
      '... ... ... t00 #00 l00 ... ... ... ...',
      '... ... ... c00 s00 o00 ... ... ... ...',
    ];
    const unorderedRoadSquares = [
      {
        key: 'g01',
        rank: 'normal',
        html_class: 'game-engine',
        title: 'coucou',
        description: 'tralala pouet \n\npif paf',
      },
      {
        key: 'i01',
        rank: 'vision',
        html_class: 'ide',
        title: 'Fonctions de debug',
        gif_vision: 'test_vision.gif',
      },
      {
        key: 'i01',
        rank: 'superior',
        html_class: 'ide superior-square',
        title: 'un autre \n\ncoucou',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: '#00',
        rank: 'origin',
        html_class: 'road-map-origin',
        description: (
          'C\'est la road-map de Squarity. Elle n\'est pas linéaire.\n'
          + 'C\'est une "road-square-map".\n'
          + 'Cliquez sur les autres carrés pour avoir des précisions sur les fonctionnalités prévues.'),
        link_url: 'https://github.com/darkrecher/squarity-doc/blob/master/road_map.md',
        link_text: 'Lien vers la road-map version "document normal".',
      },
      {
        key: 'e00',
        rank: 'superior',
        html_class: 'special-effect superior-square',
        title: '"Effets spéciaux"',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 'g00',
        rank: 'superior',
        html_class: 'game-engine superior-square',
        title: 'Moteur du jeu',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 'i00',
        rank: 'superior',
        html_class: 'ide superior-square',
        title: 'Environnement de développement intégré',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 't00',
        rank: 'superior',
        html_class: 'tuto superior-square',
        title: 'Tutoriels\n\nDocs\n\nExemples',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 'l00',
        rank: 'superior',
        html_class: 'level superior-square',
        title: 'Éditeur de niveaux\n\nGestion des tilesets',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 'c00',
        rank: 'superior',
        html_class: 'promo superior-square',
        title: 'Contenu\n\nJeux\n\nPromotion',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 's00',
        rank: 'superior',
        html_class: 'social superior-square',
        title: 'Social\n\nSite web',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },
      {
        key: 'o00',
        rank: 'superior',
        html_class: 'optim superior-square',
        title: 'Auto-formation\n\nOptimisation',
        gif_vision: 'dancing-banana-gif-moving-5.gif',
      },

      {
        key: 'v01',
        rank: 'empty',
        html_class: 'empty',
      },
    ];

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

    return {
      is_tooltip_visible: false,
      square_x_tooltip: null,
      square_y_tooltip: null,
      // TODO : comment on déclare et comment on utilise
      // des constantes dans ce fichu langage ?
      GRID_LENGTH_IN_SQUARE: 10,
      road_squares: roadSquares,
      dict_square_descriptions: dictSquareDescriptions,
    };
  },

  mounted() {
    // Pour scroller vers un élément particulier.
    document.getElementById('roadMapOrigin').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    console.log('coucou !');
  },

  methods: {
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
        const styleTopEm = newSquareY * 10 + 8;
        const styleLeftEm = newSquareX * 10 + 12;
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
  grid-template-columns: 10em 10em 10em 10em 10em 10em 10em 10em 10em 10em;
  font-weight: bold;
  background-color: darkblue;
  width: fit-content;
}

.grid-container>div {
  text-align: center;
  height: 10em;
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
  padding-left: 5px;
  padding-right: 5px;
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
  border: 2px solid #F2B3B3;
}

.game-engine {
  background-color: #00A3FF;
  border: 2px solid #B3E4FF;
}

.ide {
  background-color: #00B512;
  border: 2px solid #B3E9B8;
}

.tuto {
  background-color: #95AF00;
  border: 2px solid #F9FFC4;
}

.level {
  background-color: #8F47E0;
  border: 2px solid #DEC8F6;
}

.promo {
  background-color: #FF7B23;
  border: 2px solid #FFD8BD;
}

.social {
  background-color: #00E8FF;
  border: 2px solid #B3F8FF;
}

.optim {
  background-color: #E5E500;
  border: 2px solid #F7F7B3;
}

.special-effect-undone {
  background-color: #EF8B8B;
  border: 2px solid #F2B3B3;
}

.game-engine-undone {
  background-color: #7EB0CC;
  border: 2px solid #B3E4FF;
}

.ide-undone {
  background-color: #BAD8BD;
  border: 2px solid #B3E9B8;
}

.tuto-undone {
  background-color: #ABC191;
  border: 2px solid #F9FFC4;
}

.level-undone {
  background-color: #B19FC6;
  border: 2px solid #DEC8F6;
}

.promo-undone {
  background-color: #E5B392;
  border: 2px solid #FFD8BD;
}

.social-undone {
  background-color: #AAD1D5;
  border: 2px solid #B3F8FF;
}

.optim-undone {
  background-color: #D8D8AB;
  border: 2px solid #F7F7B3;
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

.superior-square {
  background-position: 0 0, 25px 25px;
  background-size: 50px 50px;
  background-repeat: round;
}

.superior-square span {
  padding: 5px 0 5px 0;
  font-size: 1.1em;
  font-weight: bolder;
  white-space: pre-wrap
}

.special-effect.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #D30000 25%, transparent 25%, transparent 75%, #D30000 75%, #D30000),
    repeating-linear-gradient(45deg, #D30000 25%, #F2B3B3 25%, #F2B3B3 75%, #D30000 75%, #D30000);
}

.special-effect.superior-square span {
  background-color: #D30000;
}

.ide.superior-square {
  /* https://www.magicpattern.design/tools/css-backgrounds */
  background-image:
    repeating-linear-gradient(45deg, #00B512 25%, transparent 25%, transparent 75%, #00B512 75%, #00B512),
    repeating-linear-gradient(45deg, #00B512 25%, #B3E9B8 25%, #B3E9B8 75%, #00B512 75%, #00B512);
  background-position: 0 0, 25px 25px;
  background-size: 50px 50px;
  background-repeat: round;
}

.ide.superior-square span {
  background-color: #00B512;
}

.game-engine.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #00A3FF 25%, transparent 25%, transparent 75%, #00A3FF 75%, #00A3FF),
    repeating-linear-gradient(45deg, #00A3FF 25%, #B3E4FF 25%, #B3E4FF 75%, #00A3FF 75%, #00A3FF);
}

.game-engine.superior-square span {
  background-color: #00A3FF;
}

.tuto.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #95AF00 25%, transparent 25%, transparent 75%, #95AF00 75%, #95AF00),
    repeating-linear-gradient(45deg, #95AF00 25%, #F9FFC4 25%, #F9FFC4 75%, #95AF00 75%, #95AF00);
}

.tuto.superior-square span {
  background-color: #95AF00;
}

.level.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #8F47E0 25%, transparent 25%, transparent 75%, #8F47E0 75%, #8F47E0),
    repeating-linear-gradient(45deg, #8F47E0 25%, #DEC8F6 25%, #DEC8F6 75%, #8F47E0 75%, #8F47E0);
}

.level.superior-square span {
  background-color: #8F47E0;
}

.promo.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #FF7B23 25%, transparent 25%, transparent 75%, #FF7B23 75%, #FF7B23),
    repeating-linear-gradient(45deg, #FF7B23 25%, #FFD8BD 25%, #FFD8BD 75%, #FF7B23 75%, #FF7B23);
}

.promo.superior-square span {
  background-color: #FF7B23;
}

.social.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #00E8FF 25%, transparent 25%, transparent 75%, #00E8FF 75%, #00E8FF),
    repeating-linear-gradient(45deg, #00E8FF 25%, #B3F8FF 25%, #B3F8FF 75%, #00E8FF 75%, #00E8FF);
}

.social.superior-square span {
  background-color: #00E8FF;
}

.optim.superior-square {
  background-image:
    repeating-linear-gradient(45deg, #E5E500 25%, transparent 25%, transparent 75%, #E5E500 75%, #E5E500),
    repeating-linear-gradient(45deg, #E5E500 25%, #F7F7B3 25%, #F7F7B3 75%, #E5E500 75%, #E5E500);
}

.optim.superior-square span {
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

.tooltip-text {
  display: none;
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
