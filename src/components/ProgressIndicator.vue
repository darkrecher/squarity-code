<template>
  <!--
    Ce spinner de progress est inspiré de SpinKit :
    https://tobiasahlin.com/spinkit/
    https://github.com/tobiasahlin/SpinKit
    Licence MIT.
  -->

  <div class="progress_indicator">
    <div>
      <div class="sk_cube_grid">
        <div class="sk_cube sk_cube1" />
        <div class="sk_cube sk_cube2" />
        <div class="sk_cube sk_cube3" />
        <div class="sk_cube sk_cube4" />
        <div class="sk_cube sk_cube5" />
        <div class="sk_cube sk_cube6" />
        <div class="sk_cube sk_cube7" />
        <div class="sk_cube sk_cube8" />
        <div class="sk_cube sk_cube9" />
      </div>

      Please wait / Veuillez patienter...

      <ul>
        <!--
          https://stackoverflow.com/questions/51086657/vue-warn-duplicate-keys-detected-x-this-may-cause-an-update-error
          On est obligé de prendre l'index dans la boucle v-for, et de l'utiliser dans "key".
          Sinon, ça fait une erreur "Duplicate keys detected: ' '. This may cause an update error"
        -->
        <li
          v-for="(msg, index) in messages"
          :key="index"
        >
          {{ msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressIndicator',

  props: {
  },

  data() {
    return {
      messages: [
        'Initialisation de l\'initialiseur.',
      ],
    };
  },

  mounted() {
  },

  methods: {

    add_progress_message(msg) {
      console.log(`progress: ${msg}`);
      // On met à vide le message d'avant.
      // Sinon ça fait trop de texte à lire juste pour une barre de progress.
      this.messages[this.messages.length - 1] = ' ';
      this.messages.push(msg);
    },
  },
};
</script>

<style scoped>
  .progress_indicator {
    background-color: #303030;
    color: #C0C0C0;
    /* TODO : c'est de la merde ça. */
    height: 64px;
    padding: 1em;
  }

  ul {
    text-align: left;
    padding-top: 1em;
    list-style: none;
  }

  ul li:before {
    /* Le caractère "tick" à chaque élément de liste à puces. */
    content:"\2713\0020 ";
  }

  .sk_cube_grid {
    width: 40px;
    height: 40px;
    margin: 100px auto;
  }

  /* Cette superbe anim s'affiche mal de manière aléatoire.
     Parfois, certains carrés ne sont pas visibles,
     d'autres fois, certains sont noirs au lieu d'être gris.
     Osef. Je vais pas me prendre la tête pour du CSS de zouzou à paillettes.
  */
  .sk_cube_grid .sk_cube {
    width: 33%;
    height: 33%;
    background-color: #CCC;
    color: #CCC;
    float: left;
    -webkit-transform: scale(0.1, 0.1);
            transform: scale(0.1, 0.1);
    -webkit-animation: sk_cubeGridScaleDelay 1.6s infinite ease-in-out;
            animation: sk_cubeGridScaleDelay 1.6s infinite ease-in-out;
  }

  .sk_cube_grid .sk_cube1 {
    -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s;
  }
  .sk_cube_grid .sk_cube2 {
    -webkit-animation-delay: 0.4s;
            animation-delay: 0.4s;
  }
  .sk_cube_grid .sk_cube3 {
    -webkit-animation-delay: 0.6s;
            animation-delay: 0.6s;
  }
  .sk_cube_grid .sk_cube4 {
    -webkit-animation-delay: 1.6s;
            animation-delay: 1.6s;
  }
  .sk_cube_grid .sk_cube5 {
    background-color: transparent;
    -webkit-animation: none;
            animation: none;
  }
  .sk_cube_grid .sk_cube6 {
    -webkit-animation-delay: 0.8s;
            animation-delay: 0.8s;
  }
  .sk_cube_grid .sk_cube7 {
    -webkit-animation-delay: 1.4s;
            animation-delay: 1.4s;
  }
  .sk_cube_grid .sk_cube8 {
    -webkit-animation-delay: 1.2s;
            animation-delay: 1.2s;
  }
  .sk_cube_grid .sk_cube9 {
    -webkit-animation-delay: 1.0s;
            animation-delay: 1.0s;
  }

  @-webkit-keyframes sk_cubeGridScaleDelay {
    0%, 50%, 100% {
      -webkit-transform: scale(0, 0);
              transform: scale(0, 0);
    }
    25% {
      -webkit-transform: scale(1, 1);
              transform: scale(1, 1);
    }
  }

  @keyframes sk_cubeGridScaleDelay {
    0%, 50%, 100% {
      -webkit-transform: scale(0, 0);
              transform: scale(0, 0);
    }
    25% {
      -webkit-transform: scale(1, 1);
              transform: scale(1, 1);
    }
  }
</style>
