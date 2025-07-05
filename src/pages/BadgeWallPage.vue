<template>
  <div class="p-4 sm:p-6 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-5xl font-bold text-brand-primary">我的成就墙</h1>
      <p class="mt-2 text-lg text-brand-text">
        看看你获得了哪些数学徽章和奖励！
      </p>
    </header>

    <div class="mx-auto max-w-6xl">
      <!-- 学习进度概览 -->
      <div class="mb-10 rounded-2xl bg-brand-secondary/30 p-6 shadow-md">
        <h2 class="mb-4 text-2xl font-bold text-brand-primary">我的学习进度</h2>
        
        <div class="grid gap-6 md:grid-cols-3">
          <!-- 总分数 -->
          <div class="rounded-xl bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-brand-text">总分数</span>
              <span class="text-4xl font-bold text-brand-primary">{{ gameStore.currentScore }}</span>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              再获得 {{ nextLevelScore }} 分可以升到 {{ gameStore.level + 1 }} 级
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div 
                class="h-full bg-brand-primary transition-all duration-500" 
                :style="{ width: `${levelProgress}%` }"
              ></div>
            </div>
          </div>
          
          <!-- 数学币 -->
          <div class="rounded-xl bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-brand-text">数学币</span>
              <div class="flex items-center">
                <span class="mr-1 text-2xl">🪙</span>
                <span class="text-4xl font-bold text-brand-accent">{{ gameStore.mathCoins }}</span>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              可以用来解锁新角色和主题
            </div>
          </div>
          
          <!-- 探索进度 -->
          <div class="rounded-xl bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold text-brand-text">数字探索</span>
              <span class="text-4xl font-bold text-green-500">{{ gameStore.numberExplorationProgress.explored }}/100</span>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              已探索 {{ gameStore.numberExplorationProgress.percentage }}% 的数字
            </div>
            <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div 
                class="h-full bg-green-500 transition-all duration-500" 
                :style="{ width: `${gameStore.numberExplorationProgress.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 徽章展示 -->
      <div class="mb-10 rounded-2xl bg-brand-secondary/30 p-6 shadow-md">
        <h2 class="mb-4 text-2xl font-bold text-brand-primary">我的徽章 ({{ gameStore.badgeCount }}/{{ gameStore.badges.length }})</h2>
        
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <div 
            v-for="badge in gameStore.badges" 
            :key="badge.id"
            class="flex flex-col items-center rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            :class="badge.unlocked ? 'bg-white' : 'bg-gray-100 opacity-60'"
          >
            <div 
              class="mb-2 flex h-16 w-16 items-center justify-center rounded-full text-4xl"
              :class="badge.unlocked ? 'bg-brand-accent/20' : 'bg-gray-200'"
            >
              <span :class="badge.unlocked ? '' : 'text-gray-400 opacity-50'">{{ badge.icon }}</span>
            </div>
            <h3 class="text-center text-lg font-bold" :class="badge.unlocked ? 'text-brand-primary' : 'text-gray-400'">
              {{ badge.name }}
            </h3>
            <p class="mt-1 text-center text-sm" :class="badge.unlocked ? 'text-gray-800' : 'text-gray-400'">
              {{ badge.description }}
            </p>
            <p v-if="badge.unlocked && badge.unlockedAt" class="mt-2 text-xs text-gray-600">
              获得于: {{ formatDate(badge.unlockedAt) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- 关卡进度 -->
      <div class="mb-10 rounded-2xl bg-brand-secondary/30 p-6 shadow-md">
        <h2 class="mb-4 text-2xl font-bold text-brand-primary">关卡进度</h2>
        
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="level in gameStore.gameLevels" 
            :key="level.id"
            class="relative rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            :class="[
              level.unlocked ? 'bg-white cursor-pointer' : 'bg-gray-100 opacity-60',
              level.completed ? 'border-2 border-green-500' : ''
            ]"
            @click="level.unlocked && navigateToLevel(level)"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold" :class="level.unlocked ? 'text-brand-primary' : 'text-gray-400'">
                {{ level.name }}
              </h3>
              <div class="flex">
                <span 
                  v-for="i in 3" 
                  :key="i" 
                  class="ml-1 text-xl"
                  :class="i <= level.stars ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ⭐
                </span>
              </div>
            </div>
            
            <p class="mt-1 text-sm" :class="level.unlocked ? 'text-brand-text' : 'text-gray-400'">
              {{ getLevelTypeText(level.type) }} - 
              {{ getDifficultyText(level.difficulty) }}
            </p>
            
            <p v-if="level.bestScore" class="mt-2 text-sm text-green-600">
              最高分: {{ level.bestScore }}
            </p>
            
            <div v-if="!level.unlocked" class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/10">
              <span class="text-3xl">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 角色引导 -->
    <CharacterGuide 
      :message="'看看你获得的徽章！继续努力，还有更多奖励等着你呢！'" 
      character="wizard"
      :is-active="showGuide"
      :auto-speak="true"
      @close="showGuide = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, GameLevel } from '../store/game'
import CharacterGuide from '../components/CharacterGuide.vue'

const gameStore = useGameStore()
const router = useRouter()
const showGuide = ref(true)

// 5秒后自动隐藏引导
onMounted(() => {
  setTimeout(() => {
    showGuide.value = false
  }, 5000)
})

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore()
}

// 计算下一级所需分数
const nextLevelScore = computed(() => {
  return (gameStore.level + 1) * 100 - gameStore.currentScore
})

// 计算等级进度百分比
const levelProgress = computed(() => {
  const currentLevelScore = gameStore.level * 100
  const nextLevelScore = (gameStore.level + 1) * 100
  const progress = ((gameStore.currentScore - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100
  return Math.min(Math.max(progress, 0), 100)
})

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// 获取关卡类型文本
const getLevelTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'counting': '数数游戏',
    'cognition': '数字认知',
    'addition': '加法练习',
    'subtraction': '减法练习',
    'sorting': '数字排序'
  }
  return typeMap[type] || type
}

// 获取难度文本
const getDifficultyText = (difficulty: number) => {
  const difficultyMap: Record<number, string> = {
    1: '初级难度',
    2: '中级难度',
    3: '高级难度'
  }
  return difficultyMap[difficulty] || `难度 ${difficulty}`
}

// 导航到关卡
const navigateToLevel = (level: GameLevel) => {
  if (!level.unlocked) return
  
  gameStore.setCurrentLevel(level.id)
  
  // 根据关卡类型导航到不同页面
  switch (level.type) {
    case 'counting':
      router.push('/')
      break
    case 'cognition':
      router.push('/cognition')
      break
    // 其他类型的关卡导航将在实现相应页面后添加
    default:
      // 暂时导航到首页
      router.push('/')
  }
}
</script>

<style scoped>
/* 可以添加特定于此页面的样式 */
</style>
