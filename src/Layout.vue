<template>
  <div class="flex h-screen flex-col font-comic">
    <nav class="fixed top-0 left-0 right-0 z-50 bg-brand-primary shadow-lg">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <span class="text-3xl font-bold text-white">🎨 数字乐园</span>
            </router-link>
          </div>
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <!-- 导航按钮 - 在移动设备上隐藏 -->
            <div class="hidden md:flex md:flex-wrap md:items-center md:gap-2 md:sm:gap-3">
              <router-link
                v-for="route in routes"
                :key="route.to"
                :to="route.to"
                v-slot="{ isActive }"
              >
                <button
                  :class="[
                    'rounded-full px-3 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105 sm:px-4 sm:text-base',
                    isActive
                      ? (route.color || 'bg-brand-accent') + ' text-brand-bg scale-110 shadow-inner'
                      : 'bg-white/10 hover:bg-white/20',
                  ]"
                >
                  <span class="mr-1">{{ route.icon }}</span>
                  <span class="hidden sm:inline">{{ route.name }}</span>
                </button>
              </router-link>
            </div>
            
            <!-- 用户信息 -->
            <div class="ml-2 flex items-center rounded-full bg-white/10 px-3 py-1 text-white">
              <div class="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-white">
                {{ gameStore.level }}
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex items-center">
                  <span class="mr-1">⭐</span>
                  <span>{{ gameStore.totalStars }}</span>
                </div>
                <div class="flex items-center">
                  <span class="mr-1">🪙</span>
                  <span>{{ gameStore.mathCoins }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-grow overflow-y-auto bg-brand-bg pt-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 底部导航栏（移动端） -->
    <div class="fixed bottom-0 left-0 right-0 z-40 block border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div class="flex justify-around">
        <router-link
          v-for="route in mobileRoutes"
          :key="route.to"
          :to="route.to"
          v-slot="{ isActive }"
          custom
        >
          <button
            @click="$router.push(route.to)"
            class="flex flex-1 flex-col items-center py-2"
            :class="isActive ? 'text-brand-primary' : 'text-gray-500'"
          >
            <span class="text-2xl">{{ route.icon }}</span>
            <span class="mt-1 text-xs">{{ route.name }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from './store/game'

const gameStore = useGameStore()

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore()
}

// 顶部导航
const routes = [
  { to: '/levels', name: '关卡地图', icon: '🗺️', color: 'bg-blue-500' },
  { to: '/counting', name: '数数游戏', icon: '🔢', color: 'bg-green-500' },
  { to: '/cognition', name: '数字认知', icon: '🧠', color: 'bg-purple-500' },
  { to: '/addition', name: '加法游戏', icon: '➕', color: 'bg-orange-500' },
  { to: '/badges', name: '成就墙', icon: '🏆', color: 'bg-yellow-500' },
]

// 移动端底部导航
const mobileRoutes = [
  { to: '/levels', name: '关卡', icon: '🗺️' },
  { to: '/counting', name: '数数', icon: '🔢' },
  { to: '/cognition', name: '认知', icon: '🧠' },
  { to: '/addition', name: '加法', icon: '➕' },
  { to: '/badges', name: '成就', icon: '🏆' },
]
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 为移动端底部导航添加额外的底部内边距 */
@media (max-width: 768px) {
  .flex-grow {
    padding-bottom: 60px;
  }
}
</style>
