<template>
  <div class="p-4 sm:p-6 md:p-8 safe-content">
    <header class="mb-6 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-brand-primary">互动数字认知</h1>
      <p class="mt-2 text-lg text-brand-text">
        点击下面的数字宝宝，听听它的声音吧！
      </p>
    </header>

    <!-- 故事背景 -->
    <div v-if="showStory" class="mb-8 mx-auto max-w-3xl rounded-2xl bg-brand-secondary/20 p-6 shadow-md">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 text-4xl">{{ gameStore.activeCharacter?.type === 'wizard' ? '🧙‍♂️' : gameStore.activeCharacter?.type === 'robot' ? '🤖' : '🧚‍♀️' }}</div>
        <div>
          <h3 class="mb-2 text-xl font-bold text-brand-primary">{{ gameStore.activeCharacter?.name || '数学巫师' }}的挑战</h3>
          <p class="text-gray-800">
            欢迎来到数字王国！我是{{ gameStore.activeCharacter?.name || '数学巫师' }}，我需要你的帮助来探索这个神奇的数字世界。
            点击每个数字，听听它们的声音，帮助我收集所有的数字能量！
            <span class="font-semibold">已探索: {{ gameStore.numberExplorationProgress.explored }}/100</span>
          </p>
          <div class="mt-3 flex justify-end">
            <button 
              @click="showStory = false" 
              class="text-sm text-brand-primary hover:underline"
            >
              收起故事
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="mb-4 flex justify-center">
      <button 
        @click="showStory = true" 
        class="text-sm text-brand-primary hover:underline"
      >
        显示故事背景
      </button>
    </div>

    <!-- 进度条 -->
    <div class="mb-4 mx-auto max-w-2xl">
      <div class="flex items-center justify-between text-sm text-brand-text">
        <span>探索进度</span>
        <span>{{ gameStore.numberExplorationProgress.percentage }}%</span>
      </div>
      <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div 
          class="h-full bg-brand-primary transition-all duration-500" 
          :style="{ width: `${gameStore.numberExplorationProgress.percentage}%` }"
        ></div>
      </div>
    </div>

    <div class="mb-6 text-center">
      <button
        ref="playbackButton"
        @click="togglePlayback"
        class="transform rounded-full bg-brand-accent px-8 py-4 text-2xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-brand-accent/90 active:scale-95"
      >
        {{ isPlaying ? '■ 停止播放' : '▶ 自动播放' }}
      </button>
      
      <!-- 播放速度控制 -->
      <div class="mt-3 flex items-center justify-center gap-2">
        <span class="text-sm text-brand-text">速度:</span>
        <button 
          @click="setPlaybackSpeed('slow')" 
          class="rounded-full px-3 py-1 text-sm transition-colors"
          :class="playbackSpeed === 'slow' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          慢速
        </button>
        <button 
          @click="setPlaybackSpeed('normal')" 
          class="rounded-full px-3 py-1 text-sm transition-colors"
          :class="playbackSpeed === 'normal' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          正常
        </button>
        <button 
          @click="setPlaybackSpeed('fast')" 
          class="rounded-full px-3 py-1 text-sm transition-colors"
          :class="playbackSpeed === 'fast' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          快速
        </button>
      </div>
    </div>

    <main
      class="mx-auto max-w-6xl rounded-3xl bg-brand-secondary/50 p-4 shadow-inner sm:p-6"
    >
      <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">数字特性:</span>
          <div class="flex gap-1">
            <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
              <span class="mr-1 h-2 w-2 rounded-full bg-purple-700"></span>质数
            </span>
            <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              <span class="mr-1 h-2 w-2 rounded-full bg-blue-700"></span>5的倍数
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">已探索:</span>
          <span class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <span class="mr-1 h-2 w-2 rounded-full bg-green-700"></span>{{ gameStore.numberExplorationProgress.explored }}个数字
          </span>
        </div>
      </div>
      
      <NumberGrid />
    </main>

    <NumberPopup :show="showPopup" :number="currentNumber" />
    
    <!-- 角色引导 -->
    <CharacterGuide 
      :message="guideMessage" 
      :character="gameStore.selectedCharacter"
      :is-active="showGuide"
      :auto-speak="true"
      :disable-voice="isPlaying"
      @close="showGuide = false"
    />
    
    <!-- 成就解锁提示 -->
    <div 
      v-if="showAchievement" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click="showAchievement = false"
    >
      <div 
        class="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
        @click.stop
      >
        <div class="mb-4 text-5xl">🎉</div>
        <h2 class="mb-2 text-2xl font-bold text-brand-primary">恭喜获得新徽章！</h2>
        <div class="mb-4 flex justify-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-full bg-brand-accent/20 text-5xl">
            {{ lastUnlockedBadge?.icon }}
          </div>
        </div>
        <h3 class="mb-2 text-xl font-bold text-brand-primary">{{ lastUnlockedBadge?.name }}</h3>
        <p class="mb-6 text-gray-800">{{ lastUnlockedBadge?.description }}</p>
        <p class="mb-4 text-sm text-gray-600">获得 +5 数学币</p>
        <button 
          @click="showAchievement = false"
          class="rounded-full bg-brand-primary px-6 py-2 text-white hover:bg-brand-primary/90"
        >
          太棒了！
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'
import NumberGrid from '../components/NumberGrid.vue'
import NumberPopup from '../components/NumberPopup.vue'
import CharacterGuide from '../components/CharacterGuide.vue'
import { audioService } from '../services/AudioService'
import { useGameStore } from '../store/game'
import type { Badge } from '../store/game'

const gameStore = useGameStore()

// 确保商店已初始化
if (gameStore.badges.length === 0) {
  gameStore.initializeStore()
}

const isPlaying = ref(false)
const currentNumber = ref(0)
const showPopup = ref(false)
const playbackButton = ref<HTMLButtonElement | null>(null)
const playbackSpeed = ref<'slow' | 'normal' | 'fast'>('normal')
const showStory = ref(true)
const showGuide = ref(false)
const showAchievement = ref(false)
const lastUnlockedBadge = ref<Badge | null>(null)
let intervalId: number | undefined

// 监听徽章变化，显示成就解锁提示
watch(() => gameStore.badgeCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    // 找出最新解锁的徽章
    const newBadge = gameStore.badges.find(b => b.unlocked && b.unlockedAt && 
      new Date().getTime() - b.unlockedAt.getTime() < 5000)
    
    if (newBadge) {
      lastUnlockedBadge.value = newBadge
      showAchievement.value = true
      
      // 5秒后自动关闭
      setTimeout(() => {
        showAchievement.value = false
      }, 5000)
    }
  }
})

// 角色引导消息
const guideMessage = computed(() => {
  const progress = gameStore.numberExplorationProgress
  
  if (progress.explored === 0) {
    return '欢迎来到数字认知世界！点击数字卡片，听听它们的声音吧！'
  } else if (progress.explored < 10) {
    return '做得很好！继续探索更多数字，看看它们有什么特别之处。'
  } else if (progress.explored < 50) {
    return `太棒了！你已经探索了${progress.explored}个数字，继续加油！`
  } else if (progress.explored < 100) {
    return `你已经探索了${progress.explored}个数字，即将完成全部探索！`
  } else {
    return '恭喜你探索了所有100个数字！你是真正的数字大师！'
  }
})

// 设置播放速度
const setPlaybackSpeed = (speed: 'slow' | 'normal' | 'fast') => {
  playbackSpeed.value = speed
  
  // 如果正在播放，更新播放间隔而不重新开始
  if (isPlaying.value && intervalId) {
    clearInterval(intervalId)
    intervalId = window.setInterval(() => {
      if (currentNumber.value < 100) {
        currentNumber.value++
        playAndShowNumberCycle()
        
        // 记录已探索的数字
        gameStore.exploreNumber(currentNumber.value)
      } else {
        stopPlayback()
        
        // 延迟显示完成提示，确保数字语音播放完毕
        setTimeout(() => {
          showGuide.value = true
          setTimeout(() => {
            showGuide.value = false
          }, 5000)
        }, 1000) // 延迟1秒后显示引导
      }
    }, getIntervalBySpeed())
  }
}

// 根据速度设置获取间隔时间
const getIntervalBySpeed = () => {
  switch (playbackSpeed.value) {
    case 'slow': return 3000 // 慢速：3秒
    case 'fast': return 1000 // 快速：1秒
    default: return 2000 // 正常：2秒
  }
}

const startPlayback = () => {
  isPlaying.value = true
  currentNumber.value = 1
  playAndShowNumberCycle()

  intervalId = window.setInterval(() => {
    if (currentNumber.value < 100) {
      currentNumber.value++
      playAndShowNumberCycle()
      
      // 记录已探索的数字
      gameStore.exploreNumber(currentNumber.value)
    } else {
      stopPlayback()
      
      // 延迟显示完成提示，确保数字语音播放完毕
      setTimeout(() => {
        showGuide.value = true
        setTimeout(() => {
          showGuide.value = false
        }, 5000)
      }, 1000) // 延迟1秒后显示引导
    }
  }, getIntervalBySpeed()) // 根据速度设置间隔
}

const stopPlayback = () => {
  isPlaying.value = false
  showPopup.value = false
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
  // 停止任何正在播放的语音
  if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }
}

const playAndShowNumberCycle = () => {
  // 1. 显示弹窗并朗读数字
  showPopup.value = true
  audioService.playNumber(currentNumber.value)
  
  // 记录已探索的数字
  gameStore.exploreNumber(currentNumber.value)

  // 2. 在下一个数字出现前，提前隐藏当前弹窗，为动画留出时间
  setTimeout(() => {
    showPopup.value = false
  }, getIntervalBySpeed() * 0.75) // 弹窗显示时间为间隔的75%
}

const togglePlayback = () => {
  if (isPlaying.value) {
    stopPlayback()
  } else {
    startPlayback()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (isPlaying.value && event.key === 'Escape') {
    stopPlayback()
  }
}

const handlePageClick = (event: MouseEvent) => {
  // 如果正在播放，并且点击的不是播放/停止按钮本身
  if (
    isPlaying.value &&
    playbackButton.value &&
    !playbackButton.value.contains(event.target as Node)
  ) {
    stopPlayback()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', handlePageClick)
  
  // 如果是第一次访问，显示故事背景
  showStory.value = gameStore.numberExplorationProgress.explored < 10
  
  // 延迟显示引导，避免与可能的自动播放冲突
  setTimeout(() => {
    // 只有在非播放状态下才显示引导
    if (!isPlaying.value) {
      showGuide.value = true
      
      // 5秒后隐藏引导
      setTimeout(() => {
        showGuide.value = false
      }, 5000)
    }
  }, 1500) // 延长初始延迟时间，给用户更多时间查看页面
})

onUnmounted(() => {
  stopPlayback() // 组件卸载时确保停止播放
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handlePageClick)
})
</script>

<style scoped>
/* 针对移动设备的安全区域内边距 */
.safe-content {
  padding-top: max(1.5rem, env(safe-area-inset-top, 0px) + 5rem);
  padding-bottom: max(5rem, env(safe-area-inset-bottom, 0px) + 5rem);
  min-height: 100vh;
}

/* 针对iOS Safari的特殊处理 */
@supports (-webkit-touch-callout: none) {
  .safe-content {
    padding-top: calc(env(safe-area-inset-top, 0px) + 5rem);
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 5rem);
  }
  
  .fixed.inset-0 {
    top: env(safe-area-inset-top, 0px);
    bottom: env(safe-area-inset-bottom, 0px);
  }
}
</style>
