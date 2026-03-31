<template>
  <main>
    <!--
      Linter ou je-ne-sais-quel-autre-truc qui accepte pas que j'appelle mes propres components "Header".
      Ce sera donc "MyHeader". Merci.
    -->
    <MyHeader />
    <h1>Liste des jeux</h1>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_entangled">
              <img src="../assets/game_card_img/ribbons.png">
              <br>
              Entangled ribbons
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_breakskweek">
              <img src="../assets/game_card_img/breakskweek.png">
              <br>
              Tiny Skweek plays breakout
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_emerald">
              <img src="../assets/game_card_img/emerald.png">
              <br>
              Une émeraude et son ami
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_unlimitedspace">
              <img src="../assets/game_card_img/unlimitedspace.png">
              <br>
              Unlimited space
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_githubgist_darkrecher/dd5cd1e7c59eb19f71609c5b074881c1/raw/unstable-isotopes">
              <img src="../assets/game_card_img/unstableisotopes.png">
              <br>
              Unstable isotopes
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_magician">
              <img src="../assets/game_card_img/magician.png">
              <br>
              Le magicien vert
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_f40ans">
              <img src="../assets/game_card_img/f40ans.png">
              <br>
              Les anniv' de mon pote
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_koballd">
              <img src="../assets/game_card_img/koballd.png">
              <br>
              Koballd crawler
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_grreeny">
              <img src="../assets/game_card_img/grreeny.png">
              <br>
              Grreeny le front-ender
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_catfrag">
              <img src="../assets/game_card_img/catfrag.png">
              <br>
              Cat fragmentator
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_annivwords">
              <img src="../assets/game_card_img/annivwords.png">
              <br>
              Mots-mêlés d'anniversaire
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_pacman">
              <img src="../assets/game_card_img/pacman.png">
              <br>
              Pac-Man
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_loopsinpool">
              <img src="../assets/game_card_img/loopsinpool.png">
              <br>
              Loops in pool
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_snakematch">
              <img src="../assets/game_card_img/snakematch.png">
              <br>
              Snake Match-3
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_gameofnolife">
              <img src="../assets/game_card_img/gameofnolife.png">
              <br>
              Game of no-life
            </a>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="game-example">
            <a href="/game/#fetchez_example_sokopunk">
              <img src="../assets/game_card_img/sokopunk.png">
              <br>
              Soko-Punk
            </a>
          </div>
        </v-col>
      </v-row>
    </v-container>

  </main>
</template>


<script setup>
  import MyHeader from '@/components/Header.vue'
</script>


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

</style>
