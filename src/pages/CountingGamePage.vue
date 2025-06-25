<template>
  <div class="flex h-full w-full items-center justify-center">
    <div
      class="w-full max-w-3xl rounded-3xl bg-brand-bg/90 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-10"
    >
      <h1 class="mb-4 text-4xl font-bold text-brand-primary sm:text-5xl">
        数一数有多少个
        <span class="inline-block animate-bounce">{{ currentEmoji }}</span>
        ？
      </h1>

      <div
        class="my-8 grid min-h-[220px] grid-cols-4 gap-4 rounded-2xl bg-brand-secondary/50 p-6 sm:grid-cols-6"
      >
        <div
          v-for="n in itemsToCount"
          :key="n"
          class="flex animate-bounce items-center justify-center text-5xl"
          :style="{ animationDelay: `${n * 50}ms` }"
        >
          {{ currentEmoji }}
        </div>
      </div>

      <div class="mb-8 flex flex-wrap justify-center gap-4">
        <button
          v-for="option in answerOptions"
          :key="option"
          @click="selectAnswer(option)"
          class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-secondary bg-white text-3xl font-bold text-brand-text shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          :class="{
            '!scale-110 !border-brand-accent !bg-brand-accent/30 ring-4 ring-brand-accent':
              selectedAnswer === option,
          }"
        >
          {{ option }}
        </button>
      </div>

      <div class="text-center">
        <button
          @click="checkAnswer"
          class="transform rounded-full bg-brand-primary px-10 py-4 text-2xl font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-400"
          :disabled="selectedAnswer === null"
        >
          确认答案
        </button>
        <p
          v-if="feedbackMessage"
          class="mt-6 text-3xl font-bold"
          :class="isCorrect ? 'text-green-500' : 'text-red-500'"
        >
          {{ feedbackMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '../store/game'

// 使用Pinia Store
const gameStore = useGameStore()

// 组件内部状态
const itemsToCount = ref(0)
const answerOptions = ref<number[]>([])
const selectedAnswer = ref<number | null>(null)
const feedbackMessage = ref('')
const isCorrect = ref(false)
const currentEmoji = ref('🍎')
const emojiPool = ['🍎', '🍌', '⭐', '🎈', '🚗', '🎁', '🍭']

// 生成新游戏
const setupNewGame = () => {
  // 随机选择一个新的 emoji
  currentEmoji.value = emojiPool[Math.floor(Math.random() * emojiPool.length)]

  // 实际数量 (例如，3到8之间)
  const actualCount = Math.floor(Math.random() * 6) + 3
  itemsToCount.value = actualCount

  // 生成答案选项
  const options = new Set<number>()
  options.add(actualCount)
  while (options.size < 4) {
    const randomOption = Math.max(1, actualCount + Math.floor(Math.random() * 5) - 2)
    options.add(randomOption)
  }
  answerOptions.value = Array.from(options).sort((a, b) => a - b)

  // 重置状态
  selectedAnswer.value = null
  feedbackMessage.value = ''
  isCorrect.value = false
}

// 选择答案
const selectAnswer = (option: number) => {
  selectedAnswer.value = option
}

// 检查答案
const checkAnswer = () => {
  if (selectedAnswer.value === null) return

  if (selectedAnswer.value === itemsToCount.value) {
    feedbackMessage.value = '太棒了，完全正确！'
    isCorrect.value = true
    gameStore.incrementScore(10) // 答对加10分
    // 延迟1.5秒开始新游戏
    setTimeout(setupNewGame, 1500)
  } else {
    feedbackMessage.value = '哎呀，再试一次吧！'
    isCorrect.value = false
  }
}

// 组件挂载时开始第一局游戏
onMounted(() => {
  setupNewGame()
})
</script>
