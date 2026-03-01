<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRuleEditorStore } from '@/stores/ruleeditor'

const store = useRuleEditorStore()
const { currentRule, currentBlocks } = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col h-full border-l border-stone-800 bg-stone-900/30 p-4">
    <h3 class="text-sm font-semibold text-stone-400 mb-3">Aperçu</h3>
    <div v-if="currentRule" class="space-y-2 text-sm">
      <p class="text-stone-500">
        Règle : <span class="text-stone-300">{{ currentRule.name }}</span>
      </p>
      <p class="text-stone-500">
        {{ currentBlocks.length }} bloc(s)
      </p>
      <p class="text-stone-600 text-xs mt-4">
        La simulation (Monte Carlo) pourra être ajoutée ici.
      </p>
    </div>
    <p v-else class="text-stone-500 text-sm">
      Sélectionnez une règle ou ajoutez-en une.
    </p>
  </div>
</template>
