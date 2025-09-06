<template>
  <div class="header">
    <a href="/">
      <img src="../assets/squarex.png">
      <span>Squarity</span>
    </a>
    <span> / </span>
    <a href="/about">
      <span>À propos de squarity</span>
    </a>
  </div>
  <hr>
</template>

<script>
export default {
  name: 'HeaderAbout',
};
// TODO: fichier CSS commun avec Header
// (Déjà que les deux components sont plus ou moins du copié-collé...)

// TODO: les composants HeaderAbout et HeaderCreate, c'est les mêmes.
// Faudrait factoriser tout ce bazar, quand même.
</script>

<style scoped>

 a {
  text-decoration: none;
 }

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
