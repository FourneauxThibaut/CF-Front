<script setup lang="ts">
import type { BlockDefinition } from '@/types/ruleeditor'

defineProps<{
  definitions: BlockDefinition[]
  visible: boolean
}>()
const emit = defineEmits<{
  close: []
  select: [def: BlockDefinition]
}>()
</script>

<template>
  <div
    v-show="visible"
    class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-stone-950/90"
    @click.self="emit('close')"
  >
    <div
      class="grid grid-cols-2 gap-3 p-6 rounded-xl border border-stone-700 bg-stone-900 shadow-xl max-w-md"
      @click.stop
    >
      <button
        v-for="def in definitions"
        :key="def.type"
        type="button"
        class="flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 text-left transition hover:opacity-90"
        :style="{ borderLeftColor: def.color }"
        @click="emit('select', def)"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
          :style="{ backgroundColor: `${def.color}30`, color: def.color }"
        >
          {{ def.icon }}
        </span>
        <span class="font-medium text-stone-200">{{ def.label }}</span>
      </button>
    </div>
  </div>
</template>
