<template>
  <div
    class="font-display flex aspect-square cursor-pointer select-none items-center justify-center rounded-2xl border-4 border-brand-secondary bg-brand-bg/80 text-4xl font-bold text-brand-text shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-accent hover:shadow-2xl active:scale-90"
    :class="{ 'animate-jump': isJumping }"
    @click="handleClick"
  >
    {{ number }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { audioService } from '../services/AudioService'

const props = defineProps<{
  number: number
}>()

const isJumping = ref(false)

const handleClick = () => {
  if (isJumping.value) return // Prevent re-triggering animation

  isJumping.value = true
  setTimeout(() => {
    isJumping.value = false
  }, 400) // Match animation duration

  audioService.playNumber(props.number)
}
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
