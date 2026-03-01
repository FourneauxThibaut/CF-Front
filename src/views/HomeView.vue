<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8">
    <div class="flex gap-6 justify-center">
      <a href="https://vite.dev" target="_blank" class="transition hover:opacity-80">
        <img src="/vite.svg" class="h-24 w-auto" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank" class="transition hover:opacity-80">
        <img src="@/assets/vue.svg" class="h-24 w-auto" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>
