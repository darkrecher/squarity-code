<template>
  <main>
    <h1>Squarity</h1>
    <div class="punch-line">
      Créer et partager des mini jeux vidéos, en python, dans un navigateur web
    </div>
    <!--
      Boutons qui emmènent vers une autre url
      https://medium.com/@tariibaba/vue-button-link-7a73797b1286
    -->
    <v-container>
      <v-row>
        <v-col cols="12" sm="4">
          <div>
            <!-- <button @click="$router.push('/game')">Liste des jeux</button> -->
             <button @click="$router.push('/gameslist')">Liste des jeux</button>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div>
            <button  @click="$router.push('/create')">Créer des jeux</button>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div>
            <button>Squarity ?</button>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <hr>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <div class="game-example">
            <a href="/game/#fetchez_example_h2o">
              <img src="../assets/game_card_img/h2o.png">
              <br>
              H2O
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="game-example">
            <a href="/game/#fetchez_example_sokoban">
              <img src="../assets/game_card_img/sokoban.png">
              <br>
              Sokoban
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>

  </main>
</template>


<style scoped>

h1 {
  padding: 0.5em;
  font-size: 3em;
}

img {
  width: 100%;
  max-width: 15em;
}

a {
  color: #A0A0D0;
  font-weight: bold;
  font-size: 1.7em;
}

a:visited {
  color: #b06edb;
}


button {
  background-color: #3e9b2b;
  padding: 1em;
  font-weight: bold;
  color: #202020;
  font-size: 1.5em;
  width: 100%;
}

button:hover {
  background-color: #41b829;
}

button:active {
  background-color: #3ae218;
}

.game-example {
  padding: 1.5em;
}

.punch-line {
  font-size: 1.2em;
  padding: 1em 0 1em 0;
}

hr {
  border-top: 5px solid #c0c0c0;
  width: 90%;
  margin: 0 auto;
}

</style>
