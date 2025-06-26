<template>
  <div class="p-4 sm:p-6 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-5xl font-bold text-brand-primary">互动数字认知</h1>
      <p class="mt-2 text-lg text-brand-text">
        点击下面的数字宝宝，听听它的声音吧！
      </p>
    </header>

    <div class="mb-8 text-center">
      <button
        ref="playbackButton"
        @click="togglePlayback"
        class="transform rounded-full bg-brand-accent px-8 py-4 text-2xl font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-brand-accent/90 active:scale-95"
      >
        {{ isPlaying ? '■ 停止播放' : '▶ 自动播放' }}
      </button>
    </div>

    <main
      class="mx-auto max-w-6xl rounded-3xl bg-brand-secondary/50 p-4 shadow-inner sm:p-6"
    >
      <NumberGrid />
    </main>

    <NumberPopup :show="showPopup" :number="currentNumber" />
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import NumberGrid from '../components/NumberGrid.vue'
import NumberPopup from '../components/NumberPopup.vue'
import { audioService } from '../services/AudioService'

const isPlaying = ref(false)
const currentNumber = ref(0)
const showPopup = ref(false)
const playbackButton = ref<HTMLButtonElement | null>(null)
let intervalId: number | undefined

const startPlayback = () => {
  isPlaying.value = true
  currentNumber.value = 1
  playAndShowNumberCycle()

  intervalId = window.setInterval(() => {
    if (currentNumber.value < 100) {
      currentNumber.value++
      playAndShowNumberCycle()
    } else {
      stopPlayback()
    }
  }, 2000) // 每2秒读一个数字
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

  // 2. 在下一个数字出现前，提前隐藏当前弹窗，为动画留出时间
  setTimeout(() => {
    showPopup.value = false
  }, 1500) // 弹窗显示1.5秒后开始消失
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
})

onUnmounted(() => {
  stopPlayback() // 组件卸载时确保停止播放
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', handlePageClick)
})
</script>
