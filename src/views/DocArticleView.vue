<template>
  <main>
    <div class="container">
      <div class="table-of-content">
        <MainDocV2Toc/>
      </div>
      <div class="content">
        <div id="doc-start"></div>
        <HeaderCreate/>
        <MainDocV2/>
      </div>
    </div>

  </main>
</template>

<script setup>
  import MainDocV2 from '@/components/docarticles/MainDocV2.vue'
  import MainDocV2Toc from '@/components/docarticles/MainDocV2Toc.vue'
  import HeaderCreate from '@/components/HeaderCreate.vue'
</script>


<style scoped>

.table-of-content {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background: #202020;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  padding: 0.2em;
}

.content {
  text-align: left;
  max-width: 80em;
}

@media (max-width: 960px) {
  .table-of-content {
    width: 200px;
  }
  .content {
    /* Il faut que ce soit pareil que table-of-content.width */
    margin-left: 200px;
    padding: 0.1em;
  }
}

@media (min-width: 960px) {
  .table-of-content {
    width: 300px;
  }
  .content {
    margin-left: 300px;
    padding: 0.2em 2em 0.2em 2em;
  }
}

@media (min-width: 1264px) {
  .table-of-content {
    width: 500px;
    padding: 0.5em 2em 0.5em 1em;
  }
  .content {
    margin-left: 500px;
    padding: 0.2em 2em 0.2em 2em;
  }
}

</style>
