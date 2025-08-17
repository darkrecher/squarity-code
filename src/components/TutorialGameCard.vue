<template>
  <a :href="getGameUrl(tutoGameId)" target="_blank">
    <div class="inside-link">
      <img :src="getImageUrl(tutoImg)" alt="">
      <span>{{tutoTitle}}</span>
    </div>
  </a>
</template>

<script>

export default {

  name: 'TutorialGameCard',
  props: {
    tutoGameId: { type: String, required: true },
    tutoTitle: { type: String, required: true },
    tutoImg: { type: String, required: true },
  },

  methods: {
    getImageUrl(tutoImg) {
      // https://stackoverflow.com/questions/56624817/passing-and-binding-img-src-from-props-in-vue-js
      // On est obligé de passer la variable tutoImg en paramètre.
      // Alors que c'est un truc qu'on devrait déjà avoir.
      // J'ai essayé d'y accéder avec this.props.tutoImg, et ça marche pas.
      // Toujours aussi bizarre le JavaScript. Mais on n'est plus à ça près.
      return new URL(`../assets/tutorial_icon_img/${tutoImg}`, import.meta.url);
    },
    getGameUrl(tutoGameId) {
      return `/game/#fetchez_tutorial_${tutoGameId}`;
    }

  }

};

</script>

<style scoped>

a {
  text-decoration: none;
}

span {
  color: #A0A0A0;
  font-weight: bold;
  font-size: 0.8em;
  padding-left: 0.5em;
}

.inside-link {
  display: flex;
  align-items: center;
  padding: 0.3em;
  border: 3px solid transparent;
  border-color: transparent;
}

.inside-link:hover {
  border-color: white;
}

</style>
