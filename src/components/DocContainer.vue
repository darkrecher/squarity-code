<template>
    <component :is="comp"></component>
</template>

<script>

// Je comprends pas un traître mot de ce code, mais il marche.
// Merci beaucoup à ce post stackoverflow.
// https://stackoverflow.com/questions/53406350/vue-import-vue-components-dynamically

// Vue 3 a une fonction spéciale pour charger les composants dynamiquement, ou un truc du genre.
import {defineAsyncComponent} from "vue";

export default {
  name: "DocTocContainer",
  // Je passe le nom du sous-composant à charger dans une prop.
  props: {
    componentName: { type: String, required: true }
  },
  computed: {
    comp () {
      return defineAsyncComponent(() => import(`@/components/docarticles/${this.componentName}.vue`))
    }
  }
}
</script>

