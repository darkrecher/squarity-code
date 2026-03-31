<template>
  <main>
    <MyHeader />
    <h1>&#129505; Ko-fi &#129505;</h1>

    <v-container>
      <v-row>
        <v-col cols="12" md="11" sm="12">
          <div class="all-content">

            <p>
              J'ai pas vraiment besoin d'argent. Je travaille comme méta-imposteur dans une quelconque startuffe d'informe-à-tiques. Ça consiste à faire semblant d'être atteint du syndrome de l'imposteur, pour sous-entendre que je serais techniquement valable. La réalité, c'est que je suis un imposteur, mais qui fait semblant de ne pas en être un en montrant aux autres qu'il croit en être un.
            </p>

            <p>
              <br>
              <b>
                Si vous aimez Squarity, mon plus beau cadeau serait que vous codiez un jeu avec.
              </b>
              <br>
              <br>
            </p>
            <p>
              Mon deuxième plus beau cadeau serait de me faire un don, en cliquant sur ce lien :
              <a href="https://ko-fi.com/R6R31GBRW6" target="_blank">Envoyer des choux (à l'arche) avec Ko-fi</a>
            </p>

            <p>
              Hypothétiquement, j’ajouterais des bonus ou des créations en avant-première,
              pour les personnes qui lâchent de la moulaga.
            </p>

            <p>
              Pour les personnes qui connaissent Squarity depuis quelques temps, ce compte Ko-fi est ici car je me suis retrouvé au chômage début 2026. Actuellement, tout va bien, j'ai un CDI. Je laisse cette page de don, au cas où une personne milliardaire passerait dans le coin.
            </p>

            <p>
              Si vous n'avez pas compris la blague "envoyer des choux à l'arche", cherchez "envoyez des sioux, écrivez à l'ARC".
              Ce serait dommage de rater ça.
            </p>

          </div>

        </v-col>
      </v-row>
    </v-container>

    <div class="footer"></div>
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

p {
  padding: 0.5em 0 0.5em 0;
}

a {
  color: #A0A0D0;
  font-weight: bold;
  padding: 0.8em 0.2em 0.8em 0.2em;
}

a:visited {
  color: #b06edb;
}

a:hover {
  color: #C0A0C8;
}

.all-content {
  font-size: 1.2em;
  text-align: left;
  line-height: 1.2em;
}

.footer {
  height: 9em;
}

</style>
