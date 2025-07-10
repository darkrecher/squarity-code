<template>
  <div class="header">
    <a href="/">
      <img src="../assets/squarex.png">
      <span>Squarity</span>
    </a>
    <span> / </span>
    <a href="/create">
      <span>Créer des jeux</span>
    </a>
  </div>
  <hr>
</template>

<script>
export default {
  name: 'HeaderCreate',
};
</script>

<style scoped>

/*
TODO: fichier CSS commun avec Header
(Déjà que les deux components sont plus ou moins du copié-collé...)
 */

.header {
  padding: 1em;
  margin-left: 20%;
  text-align: left;
}

img {
  vertical-align:middle;
}

span {
  vertical-align:middle;
  padding-left: 1em;
  font-size: 1.5em;
  font-weight: bold;
  color: #c0c0c0;
}

hr {
  border-top: 5px solid #c0c0c0;
  width: 70%;
  /* C'est cette ligne magique qui remet mon hr centré. */
  margin: 0 auto;
}

</style>
