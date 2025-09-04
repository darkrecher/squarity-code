<template>
  <main>
    <MyHeader />
    <h1>Créer des jeux</h1>

    <v-container>
      <v-row>
        <v-col cols="12" md="11" sm="12">
          <div class="all-content">

            <div class="sub-chapter">
              <a href="/game/#fetchez_tutorial_minimal" target="_blank">
                Jeu vide pour commencer à créer
              </a>
            </div>

            <h2>Mini-exemples</h2>
            <div class="sub-chapter">
              <span>
                Ces exemples sont des tutoriels présentant chacun une fonctionnalité spécifique.
                <br>
                Ils contiennent des suggestions de modifications, pour vous entrainer à coder et à utiliser la librairie Squarity.
                <br>
                Il est conseillé de les regarder dans l'ordre. Ce que vous apprenez dans un tutoriel vous servira pour les suivants.
                <br>
              </span>
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
                      tutoTitle="Clics et boutons"
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
                      tutoTitle="Soko-ban (jeu complet)"
                      tutoImg="sokoban.png"
                    />
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
              <span>
                D'autres exemples viendront bientôt...
              </span>
            </div>

            <h2>Documentation</h2>
            <div class="sub-chapter">
              <div class="link-list">
                <a href="/create/main-doc">
                  Doc de référence
                </a>
                <br>
                <a href="/create/share-your-game">
                  Comment partager vos jeux
                </a>
                <br>
                <a href="/create/code-lib-squarity">
                  Code source de la librairie squarity
                </a>
              </div>
            </div>

            <h2>Ressources externes</h2>
            <div class="sub-chapter">
              <span>
                Pour apprendre à programmer avec le langage python. Toutes ces documentations sont en français.
              </span>
              <br><br>
              <a href="https://diveintopython.org/fr/learn" target="_blank">
                Dive into python
              </a>
              <span>
                Les explications sont accompagnées de mini-terminaux, vous permettant de tester directement les codes d'exemple, sans rien avoir à installer.
              </span>
              <br><br>
              <a href="https://courspython.com/bases-python.html" target="_blank">
                Cours de python
              </a>
              <span>
                Des cours expliquant le python à partir de zéro.
              </span>
              <br><br>
              <a href="https://py-rates.fr/" target="_blank">
                Py-rates
              </a>
              <span>
                Un jeu éducatif où vous codez le comportement d'un personnage pour lui faire franchir des obstacles. Super sympa !
              </span>
              <br><br>
              <a href="https://codingforkids.io/fr/" target="_blank">
                Coding for kids
              </a>
              <span>
                Autre jeu éducatif, avec une interface un peu plus compliquée, et où il faut se créer un compte.
              </span>
              <br><br>
              <a href="https://codingame.com" target="_blank">
                CodinGame
              </a>
              <span>
                Plein de jeux et d'exercices de code, en python ou autres, pour les personnes qui savent déjà coder un peu et qui veulent s'entrainer.
              </span>
              <br><br>
              <a href="https://koor.fr/Python/Tutoriel_Videos/python_introduction.wp" target="_blank">
                Cours en vidéo
              </a>
              <span>
                Pour les gens qui veulent voir à quoi ça ressemble avant d'installer quoi que ce soit.
              </span>
              <br><br>
              <a href="https://wiki.python.org/moin/FrenchPythonBooks" target="_blank">
                Liste de livres
              </a>
              <span>
                Officiellement conseillés par les gens de python.org.
              </span>
              <br><br>
              <a href="https://web.archive.org/web/20230130015248/https://python.doctor/" target="_blank">
                Doctor python, sur webarchive
              </a>
              <span>
                C'était le meilleur site pour découvrir le python. Heureusement qu'il est sauvegardé par webarchive.
              </span>
            </div>

            <h2>Ancienne version (Squarity V1)</h2>
            <div class="sub-chapter">
              <div class="link-list">
                <a href="/create/choose-version">
                  Quelle version choisir ?
                </a>
                <br>
                <a href="/game/#fetchez_tutorial_minimalv1" target="_blank">
                  Jeu vide (en V1) pour commencer à créer
                </a>
                <br>
                <a href="/game/#fetchez_tutorial_sokobanv1" target="_blank">
                  Jeu Soko-ban (V1) avec des commentaires dans le code
                </a>
                <br>
                <a href="/create/main-doc-v1">
                  Doc de référence de la V1
                </a>
                <br>
                <a href="/create/tutoriel-sokoban-v1">
                  Tutoriel long et détaillé pour créer le Soko-ban
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
  import TutorialGameCard from '@/components/TutorialGameCard.vue'
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

img {
  width: 100%;
  max-width: 15em;
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

.game-example {
  padding: 1.5em;
}

.footer {
  height: 9em;
}

</style>
