<template>
  <main>
    <div class="container">
      <div class="table-of-content">
        <MainDocV2Toc/>
      </div>
      <div class="content">
        <div id="doc-start"></div>
        <HeaderCreate/>
        <div class="table-of-content-narrow" id="toc-narrow">
          <!--
            TODO: ce serait bien d'arriver à écrire une seule fois ce component.
            Au lieu de l'avoir deux fois, et il y en a toujours un sur deux qui est invisible.
          -->
          <MainDocV2Toc/>
        </div>
        <MainDocV2/>
      </div>
    </div>

  </main>
</template>

<script>

import MainDocV2 from '@/components/docarticles/MainDocV2.vue'
import MainDocV2Toc from '@/components/docarticles/MainDocV2Toc.vue'
import HeaderCreate from '@/components/HeaderCreate.vue'

export default {
  name: 'DocArticleView',
  components: {
    MainDocV2,
    MainDocV2Toc,
    HeaderCreate,
  },

  props: {},

  async mounted() {
    // https://css-tricks.com/styling-based-on-scroll-position/
    if (
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype
    ) {
      let observer = new IntersectionObserver(entries => {
        //console.log(entries[0].boundingClientRect.y);
        //console.log(entries[0].boundingClientRect);
        if (entries[0].boundingClientRect.bottom > 0) {
          console.log("Il faut masquer le bouton 'go to the top'.")
          // document.body.classList.add("header-not-at-top");
        } else {
          console.log("Il faut montrer le bouton 'go to the top'.")
          // document.body.classList.remove("header-not-at-top");
        }
      });
      observer.observe(document.querySelector("#toc-narrow"));
    }
  },

}

</script>


<style scoped>

.table-of-content {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  border-right: 1px solid #ccc;
  background: #202020;
  overflow-y: auto;
  padding: 0.2em;
}

.table-of-content-narrow {
  width: 100%;
}

.content {
  text-align: left;
  max-width: 80em;
}

@media (max-width: 959px) {
  .table-of-content {
    visibility: hidden;
  }
  .table-of-content-narrow {
    visibility: visible;
  }
  .content {
    margin-left: 0px;
    padding: 0.1em;
  }
}

@media (min-width: 960px) {
  .table-of-content {
    width: 300px;
  }
  .table-of-content-narrow {
    visibility: hidden;
    height: 0;
  }
  .content {
    /* Il faut que ce soit pareil que table-of-content.width */
    margin-left: 300px;
    padding: 0.2em 2em 0.2em 2em;
  }
}

@media (min-width: 1264px) {
  .table-of-content {
    width: 500px;
    padding: 0.5em 2em 0.5em 1em;
  }
  .table-of-content-narrow {
    visibility: hidden;
    height: 0;
  }
  .content {
    margin-left: 500px;
    padding: 0.2em 2em 0.2em 2em;
  }
}

</style>
