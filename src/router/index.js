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
      path: '/games-list',
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
      path: '/create/roadmap',
      name: 'roadmap',
      component: () => import('../views/RoadmapView.vue')
    },
    {
      path: '/create/main-doc',
      name: 'maindoc',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "MainDocV2", componentNameDocToc: "MainDocV2Toc"},
    },
    {
      path: '/create/share-your-game',
      name: 'shareyourgame',
      component: () => import('../views/DocArticleView.vue'),
      props: {componentNameDoc: "ShareYourGame"},
    },
    {
      path: '/create/code-lib-squarity',
      name: 'codelibsquarity',
      component: () => import('../views/DocArticleView.vue'),
      props: {componentNameDoc: "CodeLibSquarityV2"},
    },
    {
      path: '/create/choose-version',
      name: 'chooseversion',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "ChooseVersion", componentNameDocToc: "ChooseVersionToc"},
    },
    {
      path: '/create/main-doc-v1',
      name: 'maindocv1',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "MainDocV1", componentNameDocToc: "MainDocV1Toc"},
    },
    {
      path: '/create/tutoriel-sokoban-v1',
      name: 'tutorielsokobanv1',
      component: () => import('../views/DocArticleViewWithToc.vue'),
      props: {componentNameDoc: "TutorielSokobanV1", componentNameDocToc: "TutorielSokobanV1Toc"},
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/about/why-squarity',
      name: 'whysquarity',
      component: () => import('../views/DocArticleView.vue'),
      props: {componentNameDoc: "WhySquarity", headerIsCreate: false},
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

