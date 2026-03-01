<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRuleEditorStore } from '@/stores/ruleeditor'
import RuleSidebar from '@/components/rule-editor/RuleSidebar.vue'
import RuleBlockEditor from '@/components/rule-editor/RuleBlockEditor.vue'
import PreviewPanel from '@/components/rule-editor/PreviewPanel.vue'

const route = useRoute()
const router = useRouter()
const store = useRuleEditorStore()
const { systems, loading, error } = storeToRefs(store)

const systemId = ref(
  (Array.isArray(route.params.systemId) ? route.params.systemId[0] : route.params.systemId) ?? undefined
)
const creating = ref(false)
const newName = ref('')

onMounted(async () => {
  await store.fetchSystems()
  if (systemId.value) {
    await store.fetchSystem(systemId.value)
  }
})

watch(
  () => route.params.systemId,
  async (id) => {
    const sid = Array.isArray(id) ? id[0] : id
    systemId.value = sid
    if (sid) {
      await store.fetchSystem(sid)
    } else {
      store.clearCurrent()
    }
  }
)

async function openSystem(id: string) {
  await router.push({ name: 'rule-editor-system', params: { systemId: id } })
}

async function createAndOpen() {
  if (!newName.value.trim()) return
  creating.value = true
  const sys = await store.createSystem({ name: newName.value.trim(), description: '' })
  creating.value = false
  newName.value = ''
  if (sys) {
    await router.push({ name: 'rule-editor-system', params: { systemId: sys.id } })
  }
}

function startNew() {
  newName.value = ''
  creating.value = true
}

function cancelNew() {
  creating.value = false
  newName.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
    <header class="border-b border-stone-800/60 shrink-0">
      <div class="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        <router-link
          to="/dashboard"
          class="font-semibold tracking-tight text-amber-400/90 hover:text-amber-400"
        >
          ← Cherryfire
        </router-link>
        <span class="text-stone-500 text-sm">Éditeur de règles</span>
      </div>
    </header>

    <!-- No system selected: list or create -->
    <main
      v-if="!systemId"
      class="flex-1 max-w-2xl mx-auto w-full px-4 py-8"
    >
      <p v-if="error" class="text-red-400 mb-4">{{ error }}</p>
      <div v-if="loading && !systems.length" class="text-stone-500">Chargement…</div>
      <template v-else>
        <h1 class="text-xl font-bold mb-6">Vos systèmes de règles</h1>
        <ul class="space-y-2 mb-8">
          <li
            v-for="sys in systems"
            :key="sys.id"
            class="rounded-xl border border-stone-800 bg-stone-900/50 p-4 hover:border-amber-500/40 transition cursor-pointer"
            @click="openSystem(sys.id)"
          >
            <p class="font-medium text-stone-200">{{ sys.name }}</p>
            <p class="text-sm text-stone-500 truncate">{{ sys.description || 'Aucune description' }}</p>
          </li>
        </ul>
        <div v-if="!creating" class="flex gap-2">
          <button
            type="button"
            class="rounded-lg bg-amber-500/20 text-amber-400 px-4 py-2 text-sm font-medium hover:bg-amber-500/30 transition"
            @click="startNew"
          >
            + Nouveau système
          </button>
        </div>
        <div v-else class="rounded-xl border border-stone-700 bg-stone-900/50 p-4 max-w-md">
          <input
            v-model="newName"
            type="text"
            placeholder="Nom du système"
            class="w-full rounded-lg bg-stone-800 border border-stone-600 px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            @keydown.enter="createAndOpen"
          />
          <div class="flex gap-2 mt-3">
            <button
              type="button"
              class="rounded-lg bg-amber-500/20 text-amber-400 px-4 py-2 text-sm font-medium hover:bg-amber-500/30 transition"
              @click="createAndOpen"
            >
              Créer et ouvrir
            </button>
            <button
              type="button"
              class="rounded-lg border border-stone-600 text-stone-400 px-4 py-2 text-sm hover:bg-stone-800 transition"
              @click="cancelNew"
            >
              Annuler
            </button>
          </div>
        </div>
      </template>
    </main>

    <!-- System selected: 3-column editor -->
    <main
      v-else
      class="flex-1 flex min-h-0"
    >
      <p v-if="error" class="absolute top-14 left-4 text-red-400 text-sm z-20">{{ error }}</p>
      <aside class="w-56 shrink-0 flex flex-col min-h-0">
        <RuleSidebar />
      </aside>
      <section class="flex-1 min-w-0 flex flex-col border-r border-stone-800">
        <div class="border-b border-stone-800 px-4 py-2">
          <h2 class="text-sm font-medium text-stone-400">Blocs de la règle</h2>
        </div>
        <div class="flex-1 min-h-0 overflow-hidden">
          <RuleBlockEditor />
        </div>
      </section>
      <aside class="w-72 shrink-0 flex flex-col min-h-0">
        <PreviewPanel />
      </aside>
    </main>
  </div>
</template>
