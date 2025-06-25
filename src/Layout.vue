<template>
  <div class="flex h-screen flex-col font-comic">
    <nav class="bg-brand-primary shadow-lg">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="flex items-center">
            <span class="text-3xl font-bold text-white">🎨 数字乐园</span>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <router-link
              v-for="(route, index) in routes"
              :key="route.to"
              :to="route.to"
              v-slot="{ isActive }"
            >
              <button
                :class="[
                  'rounded-full px-4 py-2 text-base font-bold text-white transition-all duration-300 hover:scale-105',
                  isActive
                    ? (index === 0 ? 'bg-brand-secondary' : 'bg-brand-accent') + ' text-brand-bg scale-110 shadow-inner'
                    : 'bg-white/10 hover:bg-white/20',
                ]"
              >
                {{ route.name }}
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="flex-grow overflow-y-auto bg-brand-bg">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
const routes = [
  { to: '/', name: '数数游戏' },
  { to: '/cognition', name: '数字认知' },
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
</style>
