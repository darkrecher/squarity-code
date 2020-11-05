<template>
  <div class="progress-indicator">
    <div>
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1" />
        <div class="sk-cube sk-cube2" />
        <div class="sk-cube sk-cube3" />
        <div class="sk-cube sk-cube4" />
        <div class="sk-cube sk-cube5" />
        <div class="sk-cube sk-cube6" />
        <div class="sk-cube sk-cube7" />
        <div class="sk-cube sk-cube8" />
        <div class="sk-cube sk-cube9" />
      </div>

      <ul id="example-2">
        <li
          v-for="msg in messages"
          :key="msg"
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
      this.messages.push(msg);
    },
  },
};
</script>

<style scoped>
  .progress-indicator {
    background-color: #303030;
    color: #C0C0C0;
    /* TODO : c'est très mal de remettre ça ici.
       Mais de toutes façons, on est d'accord que la hauteur du canvas
       (et donc de l'indicateur de progress qui est à sa place)
       est très mal gérée pour l'instant.
    */
    height: 640px;
    padding: 1em;
  }

  ul {
    text-align: left;
  }

  .sk-cube-grid {
    width: 40px;
    height: 40px;
    margin: 100px auto;
  }

  .sk-cube-grid .sk-cube {
    width: 33%;
    height: 33%;
    background-color: #CCC;
    color: #CCC;
    float: left;
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
    -webkit-animation: sk-cubeGridScaleDelay 1.6s infinite ease-in-out;
            animation: sk-cubeGridScaleDelay 1.6s infinite ease-in-out;
  }

  .sk-cube-grid .sk-cube1 {
    -webkit-animation-delay: 0.2s;
            animation-delay: 0.2s;
  }
  .sk-cube-grid .sk-cube2 {
    -webkit-animation-delay: 0.4s;
            animation-delay: 0.4s;
  }
  .sk-cube-grid .sk-cube3 {
    -webkit-animation-delay: 0.6s;
            animation-delay: 0.6s;
  }
  .sk-cube-grid .sk-cube4 {
    -webkit-animation-delay: 1.6s;
            animation-delay: 1.6s;
  }
  .sk-cube-grid .sk-cube5 {
    background-color: transparent;
    -webkit-animation: none;
            animation: none;
  }
  .sk-cube-grid .sk-cube6 {
    -webkit-animation-delay: 0.8s;
            animation-delay: 0.8s;
  }
  .sk-cube-grid .sk-cube7 {
    -webkit-animation-delay: 1.4s;
            animation-delay: 1.4s;
  }
  .sk-cube-grid .sk-cube8 {
    -webkit-animation-delay: 1.2s;
            animation-delay: 1.2s;
  }
  .sk-cube-grid .sk-cube9 {
    -webkit-animation-delay: 1.0s;
            animation-delay: 1.0s;
  }

  @-webkit-keyframes sk-cubeGridScaleDelay {
    0%, 50%, 100% {
      -webkit-transform: scale3D(0, 0, 1);
              transform: scale3D(0, 0, 1);
    }
    25% {
      -webkit-transform: scale3D(1, 1, 1);
              transform: scale3D(1, 1, 1);
    }
  }

  @keyframes sk-cubeGridScaleDelay {
    0%, 50%, 100% {
      -webkit-transform: scale3D(0, 0, 1);
              transform: scale3D(0, 0, 1);
    }
    25% {
      -webkit-transform: scale3D(1, 1, 1);
              transform: scale3D(1, 1, 1);
    }
  }

</style>
