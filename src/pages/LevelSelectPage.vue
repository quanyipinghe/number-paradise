<template>
  <div class="p-4 sm:p-6 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-5xl font-bold text-brand-primary">数学冒险地图</h1>
      <p class="mt-2 text-lg text-brand-text">
        选择一个关卡开始你的数学冒险吧！
      </p>
    </header>

    <div class="mx-auto max-w-6xl">
      <!-- 玩家状态 -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-brand-secondary/30 p-4">
        <div class="flex items-center">
          <div class="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-2xl text-white">
            {{ gameStore.level }}
          </div>
          <div>
            <div class="text-sm text-brand-text">当前等级</div>
            <div class="text-xl font-bold text-brand-primary">数学探险家</div>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <div class="flex items-center">
            <span class="mr-2 text-2xl">⭐</span>
            <span class="text-xl font-bold text-brand-primary">{{ gameStore.totalStars }}</span>
          </div>
          
          <div class="flex items-center">
            <span class="mr-2 text-2xl">🪙</span>
            <span class="text-xl font-bold text-brand-accent">{{ gameStore.mathCoins }}</span>
          </div>
          
          <div class="flex items-center">
            <span class="mr-2 text-2xl">🏆</span>
            <span class="text-xl font-bold text-green-500">{{ gameStore.badgeCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 关卡地图 -->
      <div class="relative">
        <!-- 背景装饰 -->
        <div class="absolute inset-0 -z-10">
          <div class="h-full w-full bg-[url('/map-bg.png')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <!-- 关卡路径 -->
        <div class="relative mx-auto max-w-4xl py-8">
          <!-- 这里可以添加一些连接关卡的路径线 -->
          <svg class="absolute inset-0 -z-10" width="100%" height="100%">
            <path 
              d="M100,100 C150,150 200,50 250,100 S350,150 400,100 S500,50 550,100 S650,150 700,100" 
              stroke="#FFD166" 
              stroke-width="8" 
              fill="none" 
              stroke-dasharray="10,10"
            />
          </svg>
          
          <!-- 关卡节点 -->
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div 
              v-for="level in gameStore.gameLevels" 
              :key="level.id"
              class="relative flex flex-col items-center"
            >
              <button
                @click="selectLevel(level)"
                class="group relative flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 transition-all duration-300"
                :class="[
                  level.unlocked 
                    ? 'cursor-pointer border-brand-accent bg-white hover:scale-110 hover:shadow-xl' 
                    : 'cursor-not-allowed border-gray-300 bg-gray-100',
                  level.completed ? 'ring-4 ring-green-400' : ''
                ]"
                :disabled="!level.unlocked"
              >
                <!-- 关卡图标 -->
                <div class="text-4xl">{{ getLevelEmoji(level.type) }}</div>
                
                <!-- 关卡名称 -->
                <div 
                  class="mt-2 text-center text-sm font-bold"
                  :class="level.unlocked ? 'text-brand-primary' : 'text-gray-400'"
                >
                  {{ level.name }}
                </div>
                
                <!-- 难度指示器 -->
                <div class="mt-1 flex">
                  <span 
                    v-for="i in 3" 
                    :key="i"
                    class="mx-0.5 text-xs"
                    :class="i <= level.difficulty 
                      ? (level.unlocked ? 'text-brand-accent' : 'text-gray-400') 
                      : 'text-gray-200'"
                  >
                    ●
                  </span>
                </div>
                
                <!-- 锁定图标 -->
                <div 
                  v-if="!level.unlocked" 
                  class="absolute inset-0 flex items-center justify-center rounded-full bg-black/10"
                >
                  <span class="text-3xl">🔒</span>
                </div>
                
                <!-- 星级评分 -->
                <div 
                  v-if="level.completed" 
                  class="absolute -bottom-4 flex"
                >
                  <span 
                    v-for="i in 3" 
                    :key="i"
                    class="text-xl"
                    :class="i <= level.stars ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    ⭐
                  </span>
                </div>
              </button>
              
              <!-- 关卡类型标签 -->
              <div 
                class="mt-6 rounded-full px-3 py-1 text-xs font-semibold"
                :class="level.unlocked ? 'bg-brand-primary text-white' : 'bg-gray-300 text-gray-700'"
              >
                {{ getLevelTypeText(level.type) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 角色引导 -->
    <CharacterGuide 
      :message="guideMessage" 
      :character="gameStore.selectedCharacter"
      :is-active="showGuide"
      :auto-speak="true"
      @close="showGuide = false"
    />
    
    <!-- 关卡详情弹窗 -->
    <div v-if="selectedLevel" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-brand-primary">{{ selectedLevel.name }}</h2>
          <button @click="selectedLevel = null" class="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>
        
        <div class="mb-4 flex items-center justify-center text-6xl">
          {{ getLevelEmoji(selectedLevel.type) }}
        </div>
        
        <div class="mb-4">
          <div class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">类型:</span>
            <span class="text-gray-800">{{ getLevelTypeText(selectedLevel.type) }}</span>
          </div>
          
          <div class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">难度:</span>
            <div>
              <span 
                v-for="i in 3" 
                :key="i"
                class="ml-1 text-lg"
                :class="i <= selectedLevel.difficulty ? 'text-brand-accent' : 'text-gray-200'"
              >
                ●
              </span>
            </div>
          </div>
          
          <div v-if="selectedLevel.completed" class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">最高分:</span>
            <span class="font-bold text-green-600">{{ selectedLevel.bestScore || 0 }}</span>
          </div>
          
          <div v-if="selectedLevel.completed" class="mb-2 flex justify-between">
            <span class="font-semibold text-gray-700">星级:</span>
            <div>
              <span 
                v-for="i in 3" 
                :key="i"
                class="ml-1"
                :class="i <= selectedLevel.stars ? 'text-yellow-400' : 'text-gray-300'"
              >
                ⭐
              </span>
            </div>
          </div>
        </div>
        
        <div class="mb-6 rounded-lg bg-brand-secondary/20 p-3">
          <p class="text-sm text-gray-800">
            {{ getLevelDescription(selectedLevel) }}
          </p>
        </div>
        
        <div class="flex justify-center">
          <button 
            @click="startLevel(selectedLevel)"
            class="rounded-full bg-brand-primary px-8 py-3 text-lg font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            开始挑战
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, GameLevel } from '../store/game'
import CharacterGuide from '../components/CharacterGuide.vue'

const gameStore = useGameStore()
const router = useRouter()

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore()
}

const selectedLevel = ref<GameLevel | null>(null)
const showGuide = ref(true)

// 角色引导消息
const guideMessage = computed(() => {
  const unlockedCount = gameStore.gameLevels.filter(l => l.unlocked).length
  const totalCount = gameStore.gameLevels.length
  
  if (unlockedCount === 0) {
    return '欢迎来到数学冒险地图！点击一个关卡开始你的数学之旅吧！'
  } else if (unlockedCount < totalCount / 2) {
    return '你已经解锁了一些关卡，继续努力可以解锁更多挑战！'
  } else if (unlockedCount < totalCount) {
    return '太棒了！你已经解锁了大部分关卡，继续挑战剩下的吧！'
  } else {
    return '恭喜你解锁了所有关卡！试着在每个关卡获得三颗星吧！'
  }
})

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

// 获取关卡图标
const getLevelEmoji = (type: string) => {
  const emojiMap: Record<string, string> = {
    'counting': '🔢',
    'cognition': '🧠',
    'addition': '➕',
    'subtraction': '➖',
    'sorting': '📊'
  }
  return emojiMap[type] || '📚'
}

// 获取关卡描述
const getLevelDescription = (level: GameLevel) => {
  const descriptions: Record<string, Record<number, string>> = {
    'counting': {
      1: '初级数数挑战！数一数屏幕上有多少个物品，并选择正确的答案。',
      2: '中级数数挑战！物品数量会增加，并且排列更加复杂。',
      3: '高级数数挑战！物品数量更多，并且会有干扰项。'
    },
    'cognition': {
      1: '探索数字1到100，点击数字听听它们的发音。',
      2: '探索更大的数字，学习十位、百位的概念。'
    },
    'addition': {
      1: '学习简单的加法，计算两个数字的和。'
    },
    'subtraction': {
      1: '学习简单的减法，计算两个数字的差。'
    },
    'sorting': {
      1: '将乱序的数字排列成正确的顺序。'
    }
  }
  
  return descriptions[level.type]?.[level.difficulty] || 
    `这是一个${getLevelTypeText(level.type)}关卡，难度级别为${level.difficulty}。`
}

// 选择关卡
const selectLevel = (level: GameLevel) => {
  if (!level.unlocked) return
  selectedLevel.value = level
}

// 开始关卡
const startLevel = (level: GameLevel) => {
  gameStore.setCurrentLevel(level.id)
  selectedLevel.value = null
  
  // 根据关卡类型导航到不同页面
  switch (level.type) {
    case 'counting':
      router.push('/counting')
      break
    case 'cognition':
      router.push('/cognition')
      break
    case 'addition':
      router.push('/addition')
      break
    case 'subtraction':
      // 如果减法页面已实现，则导航到减法页面
      if (gameStore.gameLevels.find(l => l.type === 'subtraction' && l.unlocked)) {
        router.push('/subtraction')
      } else {
        // 否则显示提示信息
        alert('减法游戏即将推出，敬请期待！')
      }
      break
    case 'sorting':
      // 如果排序页面已实现，则导航到排序页面
      if (gameStore.gameLevels.find(l => l.type === 'sorting' && l.unlocked)) {
        router.push('/sorting')
      } else {
        // 否则显示提示信息
        alert('数字排序游戏即将推出，敬请期待！')
      }
      break
    default:
      // 对于未知类型，导航到关卡选择页面
      router.push('/levels')
  }
}
</script>

<style scoped>
/* 可以添加特定于此页面的样式 */
</style>
