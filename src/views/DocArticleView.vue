<template>
  <main>
    <div class="container">

      <div class="table-of-content">
        <!-- Ici on peut mettre DummyToc, et ça met l'autre component. C'est super cool ! -->
        <DocTocContainer component-name="MainDocV2Toc"/>
      </div>
      <div class="content">
        <div id="doc-start"></div>
        <HeaderCreate/>
        <div class="zone-when-narrow">
          <div id="toc-narrow">
            <!--
              TODO: ce serait bien d'arriver à écrire une seule fois ce component.
              Au lieu de l'avoir deux fois, et il y en a toujours un sur deux qui est invisible.
            -->
            <DocTocContainer component-name="MainDocV2Toc"/>
          </div>
          <a class="to-the-top" href="#doc-start" ref="buttonToTheTop">
            &#x21A5
          </a>
        </div>
        <MainDocV2/>
      </div>
    </div>

  </main>
</template>

<script>

import MainDocV2 from '@/components/docarticles/MainDocV2.vue'
import DocTocContainer from '@/components/DocTocContainer.vue'
import HeaderCreate from '@/components/HeaderCreate.vue'

export default {
  name: 'DocArticleView',
  components: {
    MainDocV2,
    DocTocContainer,
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
        if (entries[0].boundingClientRect.bottom > 0) {
          // Il faut masquer le bouton permettant de retourner en haut de la page.
          this.$refs.buttonToTheTop.classList.add("hidden");
        } else {
          // Il faut montrer le bouton.
          this.$refs.buttonToTheTop.classList.remove("hidden");
        }
      });
      observer.observe(document.querySelector("#toc-narrow"));
    }
  },

}

</script>


<style scoped>

.hidden {
  visibility: hidden;
}

.to-the-top {
  position: fixed;
  bottom: 1em;
  right: 1em;
  overflow-y: auto;
  background-color: #3e9b2b;
  font-weight: bold;
  font-size: 3em;
  text-align: center;
  width: 1.8em;
  height: 1.8em;
  color: white;
  text-decoration: none;
}

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

.zone-when-narrow {
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
  .zone-when-narrow {
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
  .zone-when-narrow {
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
  .zone-when-narrow {
    visibility: hidden;
    height: 0;
  }
  .content {
    margin-left: 500px;
    padding: 0.2em 2em 0.2em 2em;
  }
}

</style>
