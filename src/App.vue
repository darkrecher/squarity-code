<template>
  <div id="app">
    <!-- https://stackoverflow.com/questions/41764825/preserve-component-state-with-vue-router -->
    <keep-alive include="Home">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
body {
  background-color: #101010;
}

#app {
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
