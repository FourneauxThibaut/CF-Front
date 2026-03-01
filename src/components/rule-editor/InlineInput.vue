<script setup lang="ts">
import type { InputSegment } from '@/types/ruleeditor'

const props = defineProps<{
  segment: InputSegment
  color: string
}>()
const emit = defineEmits<{
  change: [value: string]
}>()
</script>

<template>
  <input
    type="text"
    :value="segment.value"
    :placeholder="segment.placeholder"
    class="inline-block rounded px-1.5 py-0.5 text-sm min-w-[4rem] max-w-[8rem] border bg-stone-900/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1"
    :style="{ borderColor: color }"
    @input="emit('change', ($event.target as HTMLInputElement).value)"
  />
</template>
