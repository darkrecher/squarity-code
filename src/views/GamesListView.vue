<template>
  <main>
    <!--
      Linter ou je-ne-sais-quel-autre-truc qui accepte pas que j'accepte mes propres componets "Header".
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
              Une émeraude cherche son ami
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
