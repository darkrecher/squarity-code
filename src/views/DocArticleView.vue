<script setup>
  import MainDocV2 from '@/components/docarticles/MainDocV2.vue'
  import MainDocV2Summary from '@/components/docarticles/MainDocV2Summary.vue'
</script>

<template>
  <main>

    <div class="container">
      <div class="summary">
        <MainDocV2Summary/>
      </div>
      <div class="content">
        <MainDocV2/>
      </div>
    </div>

  </main>
</template>

<style scoped>

.summary {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #f9f9f9;
  border-right: 1px solid #ccc;
  overflow-y: auto;

}
.content {
  margin-left: 300px; /* Same as summary width! */
  padding: 20px;
  text-align: left;
}

</style>