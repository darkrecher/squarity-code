<template>
  <!--
    Ce spinner de progress est inspiré de SpinKit :
    https://tobiasahlin.com/spinkit/
    https://github.com/tobiasahlin/SpinKit
    Licence MIT.
  -->

  <div class="progress-indicator">
    <div>
      <div class="sk-cube-grid">
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
      </div>

      Please wait / Veuillez patienter...

      <div class="main-progress">
        <span>[</span>
        <span v-for="task in nbMainTasksDone" :key="task">
          *
        </span>
        <span v-for="task in (nbMainTasks - nbMainTasksDone)" :key="task">
          .
        </span>
        <span>]</span>
      </div>

      <div>{{ message }}</div>

      <template v-if="showSubTask">
        <div class="subtask-container">
          <!--
            C'est salement dégueulasse ce style avec une variable Vue.
            Inspiré de ce truc:
            https://stackoverflow.com/questions/61511236/vue-setting-the-width-of-a-component-dynamically
            Mais en encore plus dégueulasse, parce qu'un attribut "width" à l'arrache dans une div,
            ça marche pas.
          -->
          <div class="subtask-progress" :style="subtaskStyle"></div>
        </div>
      </template>
      <template v-else>
        <div class="subtask-disabled"></div>
      </template>

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
      nbMainTasks: 3,
      nbMainTasksDone: 0,
      message: 'Initialisation de l\'initialiseur.',
      showSubTask: false,
      subtaskStyle: 'width: 1%;',
    };
  },

  mounted() {
  },

  methods: {

    setNbMainTasks(nbMainTasks) {
      this.nbMainTasks = nbMainTasks;
    },

    advanceToNextMainTask(msg, withSubTask) {
      if (this.nbMainTasksDone < this.nbMainTasks) {
        this.nbMainTasksDone += 1;
      }
      this.message = msg;
      this.subtaskStyle = 'width: 0;';
      this.showSubTask = withSubTask === true;
    },

    setSubTaskProgress(percentage) {
      this.subtaskStyle = 'width: ' + percentage.toString() +'%;';
    },

    clearProgress() {
      this.nbMainTasksDone = 0;
      this.message = '';
    }

  },
};
</script>

<style scoped>
.progress-indicator {
  background-color: #303030;
  color: #F0F0F0;
  padding: 1em;
}

.main-progress {
  font-family: monospace;
}

.subtask-disabled {
  height: 1.5em;
}

.subtask-container {
  height: 1.5em;
  margin-left: 5%;
  margin-right: 5%;
  background-color: #505050;
  padding: 0.2em;
}

.subtask-progress {
  height: 100%;
  background-color: #C0C0C0;
}

.sk-cube-grid {
  width: 40px;
  height: 40px;
  margin: 1em auto;
}

/*  Cette superbe anim s'affiche mal de manière aléatoire.
    Parfois, certains carrés ne sont pas visibles,
    d'autres fois, certains sont noirs au lieu d'être gris.
    Osef. Je vais pas me prendre la tête pour du CSS de zouzou à paillettes.
*/
.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #CCC;
  color: #CCC;
  float: left;
  -webkit-transform: scale(0.1, 0.1);
  transform: scale(0.1, 0.1);
  -webkit-animation: skCubeGridScaleDelay 1.6s infinite ease-in-out;
  animation: skCubeGridScaleDelay 1.6s infinite ease-in-out;
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

@-webkit-keyframes skCubeGridScaleDelay {

  0%,
  50%,
  100% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }

  25% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}

@keyframes skCubeGridScaleDelay {

  0%,
  50%,
  100% {
    -webkit-transform: scale(0, 0);
    transform: scale(0, 0);
  }

  25% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
  }
}
</style>
