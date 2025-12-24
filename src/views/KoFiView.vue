<template>
  <main>
    <MyHeader />
    <h1>&#129505; Ko-fi &#129505;</h1>

    <v-container>
      <v-row>
        <v-col cols="12" md="11" sm="12">
          <div class="all-content">

            <p>
              Après avoir travaillé pendant plus de 20 ans dans diverses entreprises, organisations et startuffes,
              je fus lourdé par la dernière en date. Je suis au chômage depuis le 1er décembre 2025.
            </p>

            <p>
              Je tente différentes manières d’avoir des revenus, avec plus ou moins de sérieux et d’espoir. Ceci en est une parmi d’autres.
            </p>

            <p>
              Si vous aimez Squarity et que vous avez suffisamment d'argent, vous pouvez me faire un don, en cliquant sur ce lien :
            </p>

            <a href="https://ko-fi.com/R6R31GBRW6" target="_blank">Envoyer des choux (à l'arche) avec Ko-fi</a>

            <p>
              Si ça marche ne serait-ce qu’un petit peu, j’ajouterai des bonus ou des créations en avant-première,
              pour les personnes qui lâchent de la moulaga.
            </p>

            <p>
              Ce ne serait pas correct de vous apitoyer avec mon chômage si je n’y suis plus.
              Par conséquent, si je retrouve un CDI ou un CDD, je m’engage à vous le signaler dans cette page et dans la page Ko-fi.
              Je m’engage à le faire au plus tard le premier jour de mon embauche.
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
  font-size: 1.2em;
  /* https://stackoverflow.com/questions/73074183/how-to-remove-extra-whitespace-on-link-transform */
  display: inline-flex;
  padding: 0.8em 0.2em 0.8em 0.2em;
}

a:visited {
  color: #b06edb;
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
