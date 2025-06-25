<template>
  <div class="p-4 sm:p-6 md:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-5xl font-bold text-brand-primary">互动数字认知</h1>
      <p class="mt-2 text-lg text-brand-text">
        点击下面的数字宝宝，听听它的声音吧！
      </p>
    </header>
    <main
      class="mx-auto max-w-6xl rounded-3xl bg-brand-secondary/50 p-4 shadow-inner sm:p-6"
    >
      <NumberGrid />
    </main>
  </div>
</template>

<script setup lang="ts">
import NumberGrid from '../components/NumberGrid.vue'
</script>
