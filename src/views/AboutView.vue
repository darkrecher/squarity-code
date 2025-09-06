<template>
  <main>
    <MyHeader />
    <h1>Qu'est-ce donc ?</h1>

    <v-container>
      <v-row>
        <v-col cols="12" md="11" sm="12">
          <div class="all-content">

            <p>
              Squarity est un outil de création et de partage de jeux vidéo en 2D.
              Vous dessinez quelques images, vous écrivez quelques lignes de code en python,
              et vous obtenez un jeu directement jouable dans votre navigateur.
            </p>

            <div class="sub-chapter">

              <div>
                <a href="https://discord.gg/D5SYnk8u3j" target="_blank">
                  <img class="discord" src="../assets/discord.svg" alt="Logo discord">
                </a>
              </div>

              <div>
                <a href="https://mstdn.io/@recher" target="_blank">
                  <img class="mastodon" src="../assets/mastodon.svg" alt="Logo mastodon">
                </a>
              </div>

            </div>

            <div class="sub-chapter">
              <div class="link-list">
                <a href="/create/roadmap">
                  Road-map
                </a>
                <br>
                <a href="/about/why-squarity">
                  Pourquoi je crée Squarity ?
                </a>
                <br>
                <a href="https://github.com/darkrecher/squarity-code" target="_blank">
                  Repository git du code
                </a>
                <br>
                <a href="https://github.com/darkrecher/squarity-doc" target="_blank">
                  Repository git de la documentation
                </a>
              </div>
            </div>

          </div>

        </v-col>
      </v-row>
    </v-container>

    <div class="footer"></div>
  </main>
</template>


<script setup>
  import MyHeader from '@/components/Header.vue'
</script>


<style scoped>

h1 {
  padding: 0.5em;
  font-size: 3em;
}

h2 {
  border-top: 2px solid white;
  margin-top: 1.2em;
  font-size: 2.5em;
}

/* Crétins de svg qui ont pas la même taille apparente. */
img.discord {
  height: 2.5em;
  margin: 1.5em 1.5em 0 1.5em;
}

img.mastodon {
  height: 2em;
  margin: 1.5em;
}

a {
  color: #A0A0D0;
  font-weight: bold;
  font-size: 1.2em;
  /* https://stackoverflow.com/questions/73074183/how-to-remove-extra-whitespace-on-link-transform */
  display: inline-flex;
}

a:visited {
  color: #b06edb;
}

.all-content {
  text-align: left;
}

.sub-chapter {
  font-size: 1.2em;
  padding-left: 1.8em;
}

.link-list {
  line-height: 2.3em;
}

.footer {
  height: 9em;
}

</style>
