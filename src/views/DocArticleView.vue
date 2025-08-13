<template>
  <main>

    <div class="container">
      <div class="content">
        <div id="doc-start"></div>
        <HeaderCreate/>
        <DocContainer :component-name="componentNameDoc"/>
      </div>
    </div>

  </main>
</template>

<script>

import DocContainer from '@/components/DocContainer.vue'
import HeaderCreate from '@/components/HeaderCreate.vue'

export default {
  name: 'DocArticleView',
  components: {
    DocContainer,
    HeaderCreate,
  },

  props: {
    componentNameDoc: { type: String, required: true },
  },

}

</script>


<style scoped>

.content {
  text-align: left;
  max-width: 80em;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 959px) {
  .content {
    padding: 0.1em;
  }
}

@media (min-width: 960px) {
  .content {
    padding: 0.2em 2em 0.2em 2em;
  }
}

</style>
