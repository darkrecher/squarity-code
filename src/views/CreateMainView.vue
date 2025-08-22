<template>
  <main>
    <MyHeader />
    <h1>Créer des jeux</h1>
    <a href="/game/#fetchez_tutorial_minimal" target="_blank">
      Jeu avec un code minimal
    </a>
    <h2>Mini-exemples</h2>
    <p>
      Ces exemples sont des tutoriels présentant chacun une fonctionnalité spécifique.
      <br>
      Ils contiennent des suggestions de modifications, pour vous entrainer à coder en python et à utiliser la librairie Squarity.
      <br>
      Il est conseillé de les regarder dans l'ordre. Ce que vous apprenez dans un tutoriel peut servir pour les suivants.
    </p>
    <div>
      <v-container>
        <!-- https://stackoverflow.com/questions/52343526/center-content-vertically-on-vuetify
             Pourquoi que VSCode me colorie le mot "align" en rouge ?
             Il va très bien ce mot. C'est pas une erreur de syntaxe ou autre.
             C'est relou, tous ces trucs...
         -->
        <v-row align="center" justify="center">
          <v-col cols="12" md="3" sm="6">
            <TutorialGameCard
              tutoGameId="showobject"
              tutoTitle="Afficher un objet"
              tutoImg="eye.png"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <TutorialGameCard
              tutoGameId="playerinput"
              tutoTitle="Réagir aux clics et aux boutons"
              tutoImg="mouse.png"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <TutorialGameCard
              tutoGameId="moveobjects"
              tutoTitle="Déplacer des objets"
              tutoImg="4_arrows.png"
            />
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <TutorialGameCard
              tutoGameId="sokoban"
              tutoTitle="Soko-ban (jeu&nbsp;complet)"
              tutoImg="sokoban.png"
            />
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" md="12" sm="12">
            D'autres exemples viendront bientôt...
          </v-col>
        </v-row>
        <!--
        </v-row>
          <v-col cols="12" md="3" sm="6">
            (croix en case) Récupérer les cases adjacentes
          </v-col>
          <v-col cols="12" md="3" sm="6">
            (2 carré à bords rond, superposés) Définir l'ordre d'affichage avec des layers
          </v-col>
          <v-col cols="12" md="3" sm="6">
            (un carré à bord rond, avec un truc en pointillé dedans) Changer un objet de layer
          </v-col>
          <v-col cols="12" md="3" sm="6">
            (un chemin en 3 morceau, qui finit par une flèche) Définir une séquence de mouvement
          </v-col>
          <v-col cols="12" md="3" sm="6">
            (une caisse) Exemple complet : Soko-ban
          </v-col>
        </v-row>
        -->

      </v-container>
    </div>

    <h2>Documentation</h2>

    <div>
      <a href="/create/shareyourgame">
        Comment partager votre jeu
      </a>
    </div>
    <div>
      <a href="/create/maindocv2">
        Doc de référence
      </a>
    </div>
    <div>
      <a href="/create/codelibsquarityv2">
        Code source de la librairie squarity
      </a>
    </div>
    <div>
      <a href="/create/dummy">
        Doc dubidon
      </a>
    </div>
  </main>
</template>


<script setup>
  import MyHeader from '@/components/Header.vue'
  import TutorialGameCard from '@/components/TutorialGameCard.vue'
</script>


<style scoped>
/*
TODO: pour l'instant, c'est le même CSS que GamesListView.
Si ça reste le même, faut le mettre dans un fichier commun.
 */
h1 {
  padding: 0.5em;
  font-size: 3em;
}

h2 {
  padding-top: 2em;
  font-size: 2.5em;
}

img {
  width: 100%;
  max-width: 15em;
}

a {
  color: #A0A0D0;
  font-weight: bold;
  font-size: 1.7em;
}

p {
  font-size: 1.2em;
}

a:visited {
  color: #b06edb;
}

.game-example {
  padding: 1.5em;
}

</style>
