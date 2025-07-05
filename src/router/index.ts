import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/LevelSelectPage.vue'),
  },
  {
    path: '/counting',
    name: 'CountingGame',
    component: () => import('../pages/CountingGamePage.vue'),
  },
  {
    path: '/cognition',
    name: 'NumberCognition',
    component: () => import('../pages/NumberCognitionPage.vue'),
  },
  {
    path: '/addition',
    name: 'AdditionGame',
    component: () => import('../pages/AdditionGamePage.vue'),
  },
  {
    path: '/badges',
    name: 'BadgeWall',
    component: () => import('../pages/BadgeWallPage.vue'),
  },
  {
    path: '/levels',
    name: 'LevelSelect',
    component: () => import('../pages/LevelSelectPage.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
