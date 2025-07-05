import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'

import App from './App.vue'
import router from './router'
import { useGameStore } from './store/game'
import './styles/main.css'
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(TDesign)
app.use(router)

// 初始化游戏状态
const gameStore = useGameStore(pinia)
gameStore.initializeStore()

app.mount('#app')
