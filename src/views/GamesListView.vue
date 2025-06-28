<script setup>
</script>

<template>
  <main>
    <p>
      TODO: un petit component pour avoir un lien vers la page d'accueil.
    </p>
    <h1>Liste des jeux</h1>
    <v-container>
      <v-row>
        <div class="separator"></div>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_h2o">
              <img src="../assets/screenshot_h2o.png">
              <br>
              H2O
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_sokoban">
              <img src="../assets/screenshot_sokoban.png">
              <br>
              Sokoban
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_sokoban">
              <img src="../assets/screenshot_sokoban.png">
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


.game-example {
  padding: 1.5em;
}

.separator {
  margin: 0.5em;
  height: 3px;
  background-color: #c0c0c0;
  width: 100%;
}

</style>
