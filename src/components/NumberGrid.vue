<template>
  <div class="grid grid-cols-5 gap-2 p-4 sm:grid-cols-8 md:grid-cols-10 md:gap-4">
    <NumberCard v-for="n in 100" :key="n" :number="n" />
  </div>
</template>

<script setup lang="ts">
import NumberCard from './NumberCard.vue'
</script>
