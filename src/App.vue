<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div id="app">
    <!-- TODO : faudra voir si j'ai besoin de ce truc
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>
    -->
    <RouterView />
  </div>
</template>

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
