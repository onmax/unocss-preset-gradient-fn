<script setup lang="ts">
import { ref } from 'vue'

const fromColor = ref<string>()
const toColor = ref<string>()
</script>

<template>
  <div mt-64 flex="~ gap-32 justify-between">
    <form flex-1>
      <input v-model="fromColor" type="color">
      <input v-model="toColor" type="color">
    </form>
    <div max-h-256 flex-1 aspect-1 rounded-8 bg-gradient-fn="to-b from-white to-green-400 ease-out/120" />
  </div>
</template>
