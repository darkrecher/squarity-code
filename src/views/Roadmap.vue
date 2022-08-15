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
          <img class="object-fit-contain" src="../assets/test_vision.gif">
        </div>
      </div>
    </div>

    <div class="grid-container">

      <div>1 haha il se passe quoi si le texte est très très très très très très très très très très très très très
        très
        très très très très long pouet pouet pouet pouet pouet pouet pouet pouet pouet pouet ha ha ha ha</div>
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
        Game Object affichant une valeur ou une information.
        <div class="tooltip-text">
          Types de Game Object :
          <br>
          - Du texte ou des nombres, pour indiquer un score, une quantité d'argent, ...
          <br>
          - Un rectangle de taille variable, qui s'étend sur plusieurs cases, pour indiquer une barre de vie, de mana,
          ...
          <br>
          - Affichage d'une quantité sous forme de camembert.
          <br>
          - Une mini-map ? (À déterminer précisément)
          <br>
          <br>
          Il faudra rendre ces indicateurs suffisamment configurables : taille, couleur, bord arrondi,
          police de caractère, ... Mais pas trop, car ça doit rester simple.
          <br>
          Pour des indicateurs plus spécifiques, il faudra se créer ses propres game objects, et coder leur comportement
          directement dans le game-code.
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
        aaa
        <div class="tooltip-text">
          Blabla
          <br>
          Blou
        </div>
      </div>

      <div>z3</div>
      <div class="game-engine">
        Moteur du jeu
      </div>
      <div class="ide">
        Environnement de développement intégré
      </div>
      <div>z6</div>
      <div>z7</div>
      <div>9</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>
        7a
      </div>
      <div style="background-color: lightblue;" @click="show_modal">
        8a
      </div>
      <div id="roadMapOrigin" class="road-map-origin">l'origine de la road-map.
      </div>
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
    return {
      is_tooltip_visible: false,
      square_x_tooltip: null,
      square_y_tooltip: null,
      // TODO : comment on déclare et comment on utilise
      // des constantes dans ce fichu langage ?
      GRID_LENGTH_IN_SQUARE: 10,
    };
  },

  mounted() {
    // Pour scroller vers un élément particulier.
    document.getElementById('roadMapOrigin').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    console.log('coucou !');
  },

  methods: {
    toggle_tooltip(event) {
      console.log(event.target);

      const tooltipWindow = document.getElementById('tooltipWindow');

      const container = event.target.parentNode;
      console.log(container);
      const arrayChildren = Array.prototype.slice.call(container.children);
      const indexRoadSquare = arrayChildren.indexOf(event.target);
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
        // TODO : ce sera peut-être mieux de laisser ce texte dans le json,
        // et d'aller chercher le bon texte en se basant sur les coordonnées du square.
        tooltipWindow.innerHTML = '';
        const toolTipTexts = event.target.getElementsByClassName('tooltip-text');
        if (toolTipTexts.length === 1) {
          const toolTipText = toolTipTexts[0].innerHTML;
          console.log(toolTipText);
          tooltipWindow.innerHTML = toolTipText;
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

    show_modal() {
      const modal = document.querySelector('.modal-wrapper');
      modal.style.display = 'block';
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
}

.road-map-origin {
  background-color: #424242;
}

.game-engine {
  background-color: #00A3FF;
  border: 10px solid #B3E4FF;
}

.ide {
  background-color: #00B512;
  border: 10px solid #B3E9B8;
}

.roadmap {
  position: relative;
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
  border-radius: 5px;
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
  border-radius: 5px;
}

/* https://stackoverflow.com/questions/34713763/force-an-image-to-fit-and-keep-aspect-ratio */
.object-fit-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
