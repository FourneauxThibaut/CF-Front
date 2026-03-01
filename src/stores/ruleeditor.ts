import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ruleeditorApi } from '@/lib/ruleeditor-api'
import type {
  RuleSystem,
  Rule,
  RuleBlock,
  Segment,
  CreateSystemBody,
  CreateRuleBody,
  UpdateRuleBody,
  UpdateBlockBody,
} from '@/types/ruleeditor'

export const useRuleEditorStore = defineStore('ruleeditor', () => {
  const systems = ref<RuleSystem[]>([])
  const currentSystem = ref<RuleSystem | null>(null)
  const currentRuleId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentRule = computed(() => {
    if (!currentSystem.value || !currentRuleId.value) return null
    return currentSystem.value.rules.find((r) => r.id === currentRuleId.value) ?? null
  })

  const currentBlocks = computed(() => {
    const rule = currentRule.value
    if (!rule) return []
    return [...(rule.blocks ?? [])].sort((a, b) => a.order - b.order)
  })

  const blockDefinitions = computed(() => currentSystem.value?.blockDefinitions ?? [])

  async function fetchSystems() {
    loading.value = true
    error.value = null
    try {
      const { data } = await ruleeditorApi.listSystems()
      systems.value = data ?? []
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load systems'
    } finally {
      loading.value = false
    }
  }

  async function fetchSystem(systemId: string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await ruleeditorApi.getSystem(systemId)
      currentSystem.value = data ?? null
      const first = data?.rules?.[0]
      if (first && !currentRuleId.value) {
        currentRuleId.value = first.id
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load system'
      currentSystem.value = null
    } finally {
      loading.value = false
    }
  }

  async function createSystem(body: CreateSystemBody = {}) {
    error.value = null
    try {
      const { data } = await ruleeditorApi.createSystem(body)
      if (data) {
        systems.value = [data, ...systems.value]
        return data
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to create system'
    }
    return null
  }

  async function updateSystem(systemId: string, body: CreateSystemBody) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const prev = { ...currentSystem.value, name: currentSystem.value.name, description: currentSystem.value.description }
    currentSystem.value.name = body.name ?? prev.name
    currentSystem.value.description = body.description ?? prev.description
    error.value = null
    try {
      const { data } = await ruleeditorApi.updateSystem(systemId, body)
      if (data) currentSystem.value = data
    } catch (e: unknown) {
      currentSystem.value.name = prev.name
      currentSystem.value.description = prev.description
      error.value = e instanceof Error ? e.message : 'Failed to update system'
    }
  }

  async function createRule(systemId: string, body: CreateRuleBody = {}) {
    const sys = currentSystem.value
    if (!sys || sys.id !== systemId) return null
    error.value = null
    try {
      const { data } = await ruleeditorApi.createRule(systemId, {
        name: body.name ?? 'Nouvelle règle',
        description: body.description ?? '',
        icon: body.icon ?? '📋',
        order: body.order ?? sys.rules.length,
      })
      if (data && currentSystem.value) {
        currentSystem.value.rules = [...currentSystem.value.rules, data]
        if (!currentRuleId.value) currentRuleId.value = data.id
        return data
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to create rule'
    }
    return null
  }

  async function updateRule(systemId: string, ruleId: string, body: UpdateRuleBody) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const rule = currentSystem.value.rules.find((r) => r.id === ruleId)
    if (!rule) return
    const prev = { ...rule, name: rule.name, description: rule.description, icon: rule.icon }
    if (body.name != null) rule.name = body.name
    if (body.description != null) rule.description = body.description
    if (body.icon != null) rule.icon = body.icon
    if (body.isActive != null) rule.isActive = body.isActive
    if (body.order != null) rule.order = body.order
    error.value = null
    try {
      await ruleeditorApi.updateRule(systemId, ruleId, body)
    } catch (e: unknown) {
      rule.name = prev.name
      rule.description = prev.description
      rule.icon = prev.icon
      rule.isActive = prev.isActive
      rule.order = prev.order
      error.value = e instanceof Error ? e.message : 'Failed to update rule'
    }
  }

  async function deleteRule(systemId: string, ruleId: string) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const idx = currentSystem.value.rules.findIndex((r) => r.id === ruleId)
    if (idx === -1) return
    const removed = currentSystem.value.rules.splice(idx, 1)[0]!
    if (currentRuleId.value === ruleId) {
      const next = currentSystem.value.rules[idx] ?? currentSystem.value.rules[idx - 1]
      currentRuleId.value = next?.id ?? null
    }
    error.value = null
    try {
      await ruleeditorApi.deleteRule(systemId, ruleId)
    } catch (e: unknown) {
      currentSystem.value.rules.splice(idx, 0, removed)
      error.value = e instanceof Error ? e.message : 'Failed to delete rule'
    }
  }

  async function reorderRules(systemId: string, orderedIds: string[]) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const prev = currentSystem.value.rules.map((r) => ({ ...r }))
    const byId = new Map(prev.map((r) => [r.id, r]))
    const next = orderedIds
      .map((id, i) => {
        const r = byId.get(id)
        if (!r) return null
        return { ...r, order: i } as Rule
      })
      .filter((r): r is Rule => r != null)
    currentSystem.value.rules = next
    error.value = null
    try {
      await ruleeditorApi.reorderRules(systemId, { orderedIds })
    } catch (e: unknown) {
      currentSystem.value.rules = prev
      error.value = e instanceof Error ? e.message : 'Failed to reorder rules'
    }
  }

  async function addBlock(systemId: string, ruleId: string, block: Partial<RuleBlock>) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return null
    const rule = currentSystem.value.rules.find((r) => r.id === ruleId)
    if (!rule) return null
    error.value = null
    try {
      const { data } = await ruleeditorApi.addBlock(systemId, ruleId, block)
      if (data) {
        rule.blocks = [...(rule.blocks ?? []), data]
        return data
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to add block'
    }
    return null
  }

  function setBlockSegmentsLocal(ruleId: string, blockId: string, segments: Segment[]) {
    const rule = currentSystem.value?.rules.find((r) => r.id === ruleId)
    const block = (rule?.blocks ?? []).find((b) => b.id === blockId)
    if (block) block.segments = segments
  }

  async function updateBlock(
    systemId: string,
    ruleId: string,
    blockId: string,
    body: UpdateBlockBody
  ) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const rule = currentSystem.value.rules.find((r) => r.id === ruleId)
    const block = (rule?.blocks ?? []).find((b) => b.id === blockId)
    if (!block) return
    const prevSegments = block.segments.map((s) => ({ ...s }))
    const prevOrder = block.order
    if (body.segments != null) block.segments = body.segments
    if (body.order != null) block.order = body.order
    error.value = null
    try {
      await ruleeditorApi.updateBlock(systemId, ruleId, blockId, body)
    } catch (e: unknown) {
      block.segments = prevSegments
      block.order = prevOrder
      error.value = e instanceof Error ? e.message : 'Failed to update block'
    }
  }

  async function deleteBlock(systemId: string, ruleId: string, blockId: string) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const rule = currentSystem.value.rules.find((r) => r.id === ruleId)
    if (!rule) return
    const blocks = rule.blocks ?? []
    const idx = blocks.findIndex((b) => b.id === blockId)
    if (idx === -1) return
    if (!rule.blocks) rule.blocks = []
    const removed = rule.blocks.splice(idx, 1)[0]!
    error.value = null
    try {
      await ruleeditorApi.deleteBlock(systemId, ruleId, blockId)
    } catch (e: unknown) {
      rule.blocks.splice(idx, 0, removed)
      error.value = e instanceof Error ? e.message : 'Failed to delete block'
    }
  }

  async function reorderBlocks(systemId: string, ruleId: string, orderedIds: string[]) {
    if (!currentSystem.value || currentSystem.value.id !== systemId) return
    const rule = currentSystem.value.rules.find((r) => r.id === ruleId)
    if (!rule) return
    const blocks = rule.blocks ?? []
    const prev = blocks.map((b) => ({ ...b }))
    if (!rule.blocks) rule.blocks = []
    const byId = new Map(prev.map((b) => [b.id, b]))
    const next = orderedIds
      .map((id, i) => {
        const b = byId.get(id)
        if (!b) return null
        return { ...b, order: i } as RuleBlock
      })
      .filter((b): b is RuleBlock => b != null)
    rule.blocks = next
    error.value = null
    try {
      await ruleeditorApi.reorderBlocks(systemId, ruleId, { orderedIds })
    } catch (e: unknown) {
      rule.blocks = prev
      error.value = e instanceof Error ? e.message : 'Failed to reorder blocks'
    }
  }

  function setCurrentRule(ruleId: string | null) {
    currentRuleId.value = ruleId
  }

  function clearCurrent() {
    currentSystem.value = null
    currentRuleId.value = null
  }

  return {
    systems,
    currentSystem,
    currentRuleId,
    currentRule,
    currentBlocks,
    blockDefinitions,
    loading,
    error,
    fetchSystems,
    fetchSystem,
    createSystem,
    updateSystem,
    createRule,
    updateRule,
    deleteRule,
    reorderRules,
    addBlock,
    setBlockSegmentsLocal,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setCurrentRule,
    clearCurrent,
  }
})
