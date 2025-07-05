<template>
  <div
    class="font-display flex aspect-square cursor-pointer select-none items-center justify-center rounded-2xl border-4 text-4xl font-bold shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-accent hover:shadow-2xl active:scale-90"
    :class="[
      { 'animate-jump': isJumping },
      { 'animate-pulse border-green-400 bg-green-100': isExplored },
      isExplored ? 'border-brand-accent bg-brand-bg/90' : 'border-brand-secondary bg-brand-bg/80',
      getColorClass(number)
    ]"
    @click="handleClick"
  >
    <div class="relative">
      {{ number }}
      <div 
        v-if="showParticles" 
        class="absolute inset-0 flex items-center justify-center"
      >
        <div 
          v-for="i in 8" 
          :key="i" 
          class="absolute h-2 w-2 rounded-full bg-yellow-400"
          :style="getParticleStyle(i)"
        ></div>
      </div>
    </div>
    
    <!-- 探索标记 -->
    <div 
      v-if="isExplored" 
      class="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white"
    >
      ✓
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { audioService } from '../services/AudioService'
import { useGameStore } from '../store/game'

const gameStore = useGameStore()

const props = defineProps<{
  number: number
}>()

const isJumping = ref(false)
const showParticles = ref(false)
const isExplored = computed(() => gameStore.numbersExplored.includes(props.number))

// 根据数字特性设置不同的颜色
const getColorClass = (num: number) => {
  // 质数使用特殊颜色
  if (isPrime(num)) {
    return 'text-purple-600'
  }
  
  // 5的倍数使用特殊颜色
  if (num % 5 === 0) {
    return 'text-blue-600'
  }
  
  // 偶数和奇数使用不同颜色
  return num % 2 === 0 ? 'text-brand-primary' : 'text-brand-text'
}

// 判断是否为质数
const isPrime = (num: number) => {
  if (num <= 1) return false
  if (num <= 3) return true
  if (num % 2 === 0 || num % 3 === 0) return false
  
  let i = 5
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false
    i += 6
  }
  return true
}

// 获取粒子动画样式
const getParticleStyle = (index: number) => {
  const angle = (index - 1) * 45 // 均匀分布在圆周上
  const distance = Math.random() * 30 + 20 // 20-50px的随机距离
  const duration = Math.random() * 0.5 + 0.5 // 0.5-1秒的随机持续时间
  const delay = Math.random() * 0.2 // 0-0.2秒的随机延迟
  
  return {
    transform: `translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px)`,
    opacity: 0,
    transition: `all ${duration}s ease-out ${delay}s`
  }
}

// 播放粒子动画
const playParticleAnimation = () => {
  showParticles.value = true
  
  // 重置粒子状态
  setTimeout(() => {
    showParticles.value = false
  }, 1000)
}

const handleClick = () => {
  if (isJumping.value) return // 防止重复触发动画

  isJumping.value = true
  setTimeout(() => {
    isJumping.value = false
  }, 400) // 匹配动画持续时间

  // 播放数字音频
  audioService.playNumber(props.number)
  
  // 播放粒子动画
  playParticleAnimation()
  
  // 记录已探索的数字
  if (!isExplored.value) {
    gameStore.exploreNumber(props.number)
  }
}

onMounted(() => {
  // 如果数字是1，自动标记为已探索
  if (props.number === 1 && !isExplored.value) {
    gameStore.exploreNumber(1)
  }
})
</script>

<style scoped>
@keyframes jump {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15%) scale(1.1);
  }
}

.animate-jump {
  animation: jump 0.4s ease-in-out;
}
</style>
