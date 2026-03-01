<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRuleEditorStore } from '@/stores/ruleeditor'

const store = useRuleEditorStore()
const { currentSystem, currentRuleId } = storeToRefs(store)

const systemId = () => currentSystem.value?.id ?? ''
const rules = () => currentSystem.value?.rules ?? []

async function addRule() {
  const id = systemId()
  if (!id) return
  await store.createRule(id, { order: rules().length })
}

function selectRule(ruleId: string) {
  store.setCurrentRule(ruleId)
}

async function removeRule(ruleId: string) {
  const id = systemId()
  if (!id) return
  await store.deleteRule(id, ruleId)
}
</script>

<template>
  <div class="flex flex-col h-full border-r border-stone-800 bg-stone-900/50">
    <div class="p-4 border-b border-stone-800">
      <h2 class="text-sm font-semibold text-stone-400 truncate" :title="currentSystem?.name">
        {{ currentSystem?.name || 'Système' }}
      </h2>
      <p class="text-xs text-stone-500 mt-0.5 truncate">
        {{ currentSystem?.description || 'Aucune description' }}
      </p>
    </div>
    <div class="flex-1 overflow-auto p-2">
      <button
        type="button"
        class="w-full rounded-lg border border-dashed border-stone-600 py-2 text-xs text-stone-500 hover:border-amber-500/50 hover:text-amber-500/80 transition mb-2"
        @click="addRule"
      >
        + Nouvelle règle
      </button>
      <ul class="space-y-1">
        <li
          v-for="rule in rules()"
          :key="rule.id"
          class="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition"
          :class="currentRuleId === rule.id ? 'bg-amber-500/15 text-amber-400/90' : 'text-stone-400 hover:bg-stone-800/50'"
        >
          <button
            type="button"
            class="flex-1 text-left truncate flex items-center gap-2"
            @click="selectRule(rule.id)"
          >
            <span class="shrink-0">{{ rule.icon || '📋' }}</span>
            <span class="truncate">{{ rule.name }}</span>
          </button>
          <button
            type="button"
            class="shrink-0 rounded p-1 text-stone-500 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            aria-label="Supprimer la règle"
            @click.stop="removeRule(rule.id)"
          >
            ×
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
