import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'CountingGame',
    component: () => import('../pages/CountingGamePage.vue'),
  },
  {
    path: '/cognition',
    name: 'NumberCognition',
    component: () => import('../pages/NumberCognitionPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
