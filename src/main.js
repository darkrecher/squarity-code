import Vue from 'vue';
import LoadScript from 'vue-plugin-load-script';
import App from './App.vue';

Vue.use(LoadScript);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
