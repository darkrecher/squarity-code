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
      path: '/gameslist',
      name: 'games_list',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GamesListView.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateMainView.vue')
    },
    {
      path: '/game',
      name: 'play_game',
      component: () => import('../views/PlayGameView.vue')
    },
    {
      path: '/roadmap',
      name: 'roadmap',
      component: () => import('../views/RoadmapView.vue')
    },
    {
      path: '/create/maindocv2',
      name: 'maindocv2',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "MainDocV2", componentNameDocToc: "MainDocV2Toc"},
    },
    {
      path: '/create/shareyourgame',
      name: 'shareyourgame',
      component: () => import('../views/DocArticleView.vue'),
      props: {componentNameDoc: "ShareYourGame"},
    },
    {
      path: '/create/codelibsquarityv2',
      name: 'codelibsquarityv2',
      component: () => import('../views/DocArticleView.vue'),
      props: {componentNameDoc: "CodeLibSquarityV2"},
    },
    {
      path: '/create/chooseversion',
      name: 'chooseversion',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "ChooseVersion", componentNameDocToc: "ChooseVersionToc"},
    },
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

// TODO : pas besoin de ça, mais c'est juste pour tester.
// https://squarity.pythonanywhere.com/#fetchez_githubgist_darkrecher/9f4abdcecb567b7e6d7d8abb9f2c44a0/raw/skweek-breakout.txt
// http://localhost:5173/#fetchez_githubgist_darkrecher/9f4abdcecb567b7e6d7d8abb9f2c44a0/raw/skweek-breakout.txt
