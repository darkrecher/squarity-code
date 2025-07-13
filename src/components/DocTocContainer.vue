<template>
    <component :is="comp"></component>
</template>

<script>

// Je comprends pas un traître mot de ce code, mais il marche.
// Merci beaucoup à ce post stackoverflow.
// https://stackoverflow.com/questions/53406350/vue-import-vue-components-dynamically

//Vue 3 is having a special function to define these async functions
import {defineAsyncComponent} from "vue";

export default {
  name: "DocTocContainer",
  //I am passing the name of the Component as a prop
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

