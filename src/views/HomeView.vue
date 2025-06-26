<script setup>
</script>

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
            <button @click="$router.push('/game')">Liste des jeux</button>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div>
            <button>Créer un jeu</button>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div>
            <button>Squarity ?</button>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <div class="separator"></div>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <div class="img-example">
            <a href="/game/#fetchez_example_h2o">
              <img src="../assets/screenshot_h2o.png">
            </a>
            <a href="/game/#fetchez_example_h2o">H2O</a>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="img-example">
            <a href="/game/#fetchez_example_sokoban">
              <img src="../assets/screenshot_sokoban.png">
            </a>
            <a href="/game/#fetchez_example_sokoban">Sokoban</a>
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
}

a {
  font-weight: bold;
  font-size: 1.7em;
}

button {
  /* TODO: mettre le vert officiel de Squarity. */
  background-color: #069f09;
  padding: 1em;
  font-weight: bold;
  color: #202020;
  font-size: 1.5em;
  width: 100%;
}

button:hover {
  background-color: #04b507;
}

button:active {
  background-color: #00e204;
}

.img-example {
  padding: 1.5em;
}

.punch-line {
  font-size: 1.2em;
  padding: 1em 0 1em 0;
}

.separator {
  margin: 0.5em;
  height: 3px;
  background-color: #c0c0c0;
  width: 100%;
}

</style>
