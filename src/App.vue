<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<!--
  Si j'ai bien compris, faut installer un linter spécial pour Vue : https://eslint.vuejs.org/user-guide/
  TODO : installer le Linter qui va bien.
-->
<!--
  TODO : essayer de déclarer les composants avec de la "Composition API"
  (même si pour l'instant je comprends pas du tout ce que c'est).
-->

<style scoped>
body {
  background-color: #101010;
}

#app {
  background-color: #101010;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #C0C0C0;
}

a {
  color: #A0A0D0;
}
</style>
