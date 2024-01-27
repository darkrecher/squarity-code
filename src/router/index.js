import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/roadmap',
      name: 'roadmap',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RoadmapView.vue')
    }
  ]
})

// source: https://stackoverflow.com/questions/51639850/how-to-change-page-titles-when-using-vue-router
router.afterEach(() => {
    document.title = 'Squarity';
    // La bonne pratique est d'utiliser nextTick, mais je n'arrive pas à le faire fonctionner.
    // Use next tick to handle router history correctly
    // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
})

export default router
