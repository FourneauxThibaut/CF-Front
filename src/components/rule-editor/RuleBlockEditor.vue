<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRuleEditorStore } from '@/stores/ruleeditor'
import type { RuleBlock as RuleBlockType, Segment, BlockDefinition } from '@/types/ruleeditor'
import RuleBlock from './RuleBlock.vue'
import BlockPalette from './BlockPalette.vue'

const store = useRuleEditorStore()
const { currentSystem, currentRule, currentBlocks, blockDefinitions } = storeToRefs(store)

const paletteOpen = ref(false)
let updateTimeout: ReturnType<typeof setTimeout> | null = null

const systemId = computed(() => currentSystem.value?.id ?? '')
const ruleId = computed(() => currentRule.value?.id ?? '')

const defByType = computed(() => {
  const map = new Map<string, BlockDefinition>()
  for (const d of blockDefinitions.value) {
    map.set(d.type, d)
  }
  return map
})

function getDef(block: RuleBlockType) {
  return defByType.value.get(block.type)
}

function openPalette() {
  paletteOpen.value = true
}

function closePalette() {
  paletteOpen.value = false
}

async function addBlock(def: BlockDefinition) {
  if (!systemId.value || !ruleId.value) return
  const block: Partial<RuleBlockType> = {
    type: def.type,
    segments: def.templateSegments.map((s) => ({ ...s })),
    order: currentBlocks.value.length,
  }
  await store.addBlock(systemId.value, ruleId.value, block)
  paletteOpen.value = false
}

function onSegmentsChange(blockId: string, segments: Segment[]) {
  if (!ruleId.value) return
  store.setBlockSegmentsLocal(ruleId.value, blockId, segments)
  if (updateTimeout) clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    if (!systemId.value || !ruleId.value) return
    store.updateBlock(systemId.value, ruleId.value, blockId, { segments })
    updateTimeout = null
  }, 500)
}

async function deleteBlock(blockId: string) {
  if (!systemId.value || !ruleId.value) return
  await store.deleteBlock(systemId.value, ruleId.value, blockId)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto space-y-2 p-4">
      <RuleBlock
        v-for="block in currentBlocks"
        :key="block.id"
        :block="block"
        :color="getDef(block)?.color ?? '#64748b'"
        :icon="getDef(block)?.icon ?? '•'"
        @delete="deleteBlock(block.id)"
        @segments-change="onSegmentsChange(block.id, $event)"
      />
    </div>
    <div class="border-t border-stone-800 p-4">
      <button
        type="button"
        class="w-full rounded-lg border border-dashed border-stone-600 py-3 text-sm text-stone-500 hover:border-amber-500/50 hover:text-amber-500/80 transition"
        @click="openPalette"
      >
        + Ajouter un bloc
      </button>
    </div>
    <BlockPalette
      :definitions="blockDefinitions"
      :visible="paletteOpen"
      @close="closePalette"
      @select="addBlock"
    />
  </div>
</template>
