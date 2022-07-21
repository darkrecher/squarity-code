<template>
  <div class="roadmap">
    <h1>Ici, il y aura la road map.</h1>
    <router-link to="/">
      Lien de retour vers le jeu, mais il est dans mon fichier Roadmap.vue, et ça marche.
    </router-link>
    hahaha !!!
    <br>

    <div id="tooltipWindow" class="wesh_tooltip" style="background-color: red;">
      <br />
      Je suis un énorme tas de texte dans le tooltip
      <br />
      Je suis un énorme tas de texte dans le tooltip
      <br />
      Je suis un énorme tas de texte dans le tooltip
      <br />
      Je suis un énorme tas de texte dans le tooltip
      <br />
      Je suis un énorme tas de texte dans le tooltip zouzou prout plop
      <br />
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
      <div>z6</div>
      <div>z7</div>
      <div>z8</div>
      <div>z9</div>
      <div>z7a</div>
      <div>z8a</div>
      <div>z9a</div>
      <div>z1</div>

      <div style="background-color: lightblue;" @click="show_tool_tip">
        aaa
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
      <div style="background-color: lightblue;" @click="show_tool_tip_2">
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
    };
  },

  mounted() {
    // Pour scroller vers un élément particulier.
    document.getElementById('roadMapOrigin').scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    console.log('coucou !');
  },

  methods: {
    show_tool_tip(event) {
      console.log(event);
      this.is_tooltip_visible = true;
      const tooltipWindow = document.getElementById('tooltipWindow');
      tooltipWindow.style.display = 'block';
      tooltipWindow.style.top = '68em';
      tooltipWindow.style.left = '32em';
    },
    show_tool_tip_2(event) {
      console.log(event);
      this.is_tooltip_visible = true;
      const tooltipWindow = document.getElementById('tooltipWindow');
      tooltipWindow.style.display = 'block';
      tooltipWindow.style.top = '78em';
      tooltipWindow.style.left = '42em';
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

/* tooltip*/

.roadmap {
  position: relative;
}

.wesh_tooltip {
  position: absolute;
  display: none;
  top: 0px;
  left: 0px;
}
</style>
