<template>
  <main>
    <MyHeader />
    <h1>Créer des jeux</h1>
    <p>
      Bla bla
    </p>
    <p>
      Blou
    </p>
    <a href="/maindocv2">
      Doc de référence de la librairie squarity
    </a>
  </main>
</template>


<script setup>
  import MyHeader from '@/components/Header.vue'
</script>


<style scoped>
/*
TODO: pour l'instant, c'est le même CSS que GamesListView.
Si ça reste le même, faut le mettre dans un fichier commun.
 */
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
