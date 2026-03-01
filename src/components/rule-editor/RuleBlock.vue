<script setup lang="ts">
import { ref } from 'vue'
import type { RuleBlock as RuleBlockType, Segment } from '@/types/ruleeditor'
import InlineDropdown from './InlineDropdown.vue'
import InlineInput from './InlineInput.vue'

const props = defineProps<{
  block: RuleBlockType
  color: string
  icon: string
}>()
const emit = defineEmits<{
  delete: []
  segmentsChange: [segments: Segment[]]
}>()

const hover = ref(false)

function isDropdown(s: Segment): s is import('@/types/ruleeditor').DropdownSegment {
  return s.type === 'dropdown'
}
function isInput(s: Segment): s is import('@/types/ruleeditor').InputSegment {
  return s.type === 'input'
}

function onDropdownChange(idx: number, value: string) {
  const next = props.block.segments.map((s, i) =>
    i === idx && s.type === 'dropdown' ? { ...s, value } : s
  )
  emit('segmentsChange', next)
}

function onInputChange(idx: number, value: string) {
  const next = props.block.segments.map((s, i) =>
    i === idx && s.type === 'input' ? { ...s, value } : s
  )
  emit('segmentsChange', next)
}
</script>

<template>
  <div
    class="group flex items-center gap-2 rounded-lg border-l-4 px-3 py-2 transition-all duration-150"
    :class="{ 'translate-x-1': hover }"
    :style="{ borderLeftColor: color }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <span
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition"
      :style="{ backgroundColor: `${color}30`, color }"
      :class="{ 'shadow-[0_0_10px_currentColor]': hover }"
    >
      {{ icon }}
    </span>
    <div class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-stone-300">
      <template v-for="(seg, idx) in block.segments" :key="idx">
        <span v-if="seg.type === 'text'" class="text-stone-500">{{ seg.value }}</span>
        <InlineDropdown
          v-else-if="isDropdown(seg)"
          :segment="seg"
          :color="color"
          @change="onDropdownChange(idx, $event)"
        />
        <InlineInput
          v-else-if="isInput(seg)"
          :segment="seg"
          :color="color"
          @change="onInputChange(idx, $event)"
        />
        <span v-else class="text-stone-400">[ref]</span>
      </template>
    </div>
    <button
      v-show="hover"
      type="button"
      class="ml-auto shrink-0 rounded p-1 text-stone-500 hover:bg-red-500/20 hover:text-red-400 transition"
      aria-label="Supprimer le bloc"
      @click="emit('delete')"
    >
      ×
    </button>
  </div>
</template>
