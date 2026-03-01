<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { DropdownSegment } from '@/types/ruleeditor'

const props = defineProps<{
  segment: DropdownSegment
  color: string
}>()
const emit = defineEmits<{
  change: [value: string]
}>()

const open = ref(false)
const container = ref<HTMLElement | null>(null)
const dropdownStyle = ref({ top: '0', left: '0' })

function toggle() {
  if (!open.value && container.value) {
    const rect = container.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + 2}px`,
      left: `${rect.left}px`,
    }
  }
  open.value = !open.value
}

function select(option: string) {
  emit('change', option)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (container.value && !container.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <span ref="container" class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-center rounded px-1.5 py-0.5 text-sm font-medium min-w-[2rem] border transition"
      :style="{ borderColor: color, color, backgroundColor: `${color}18` }"
      @click="toggle"
    >
      {{ segment.value || '…' }}
    </button>
    <Teleport to="body">
      <div
        v-show="open"
        class="fixed rounded-lg shadow-xl border border-stone-700 overflow-hidden z-[1000]"
        style="background: #1e1e2e"
        :style="dropdownStyle"
      >
        <ul class="max-h-48 overflow-auto py-1">
          <li
            v-for="opt in segment.options"
            :key="opt"
            class="px-3 py-1.5 text-sm cursor-pointer hover:bg-stone-700 text-stone-100"
            :class="{ 'bg-stone-700': segment.value === opt }"
            @click="select(opt)"
          >
            {{ opt }}
          </li>
        </ul>
      </div>
    </Teleport>
  </span>
</template>
