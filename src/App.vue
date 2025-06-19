<script setup>
import { RouterView } from 'vue-router'

// Pour pouvoir continuer de gérer les liens existants, qui mène vers des jeux spécifiques.
// Au départ, on n'utilisait pas le path "/game" pour référencer des pages vers un jeu.
if (
  (window.location.pathname == "/")
  && window.location.hash.startsWith("#fetchez")
) {
  window.location.pathname = "/game/"
}

</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>

html {
  height: 100%;
}

body {
  background-color: #101010;
  height: 100%;
}

#app {
  background-color: #101010;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #C0C0C0;
}

</style>
