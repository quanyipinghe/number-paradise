<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <transition name="pop">
      <div v-if="showContent" class="font-display flex h-64 w-64 items-center justify-center rounded-full bg-brand-accent text-9xl font-bold text-white shadow-2xl">
        {{ number }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  number: number
  show: boolean
}>()

const showContent = ref(false)

watch(() => props.show, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showContent.value = true
    }, 10)
  } else {
    showContent.value = false
  }
})
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
