<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const me = ref<{ id: string; email: string } | null>(null)
const apiError = ref<string | null>(null)

onMounted(async () => {
  try {
    const { data } = await api.get<{ id: string; email: string }>('/api/me')
    me.value = data
  } catch (e: unknown) {
    apiError.value = e instanceof Error ? e.message : 'Failed to load profile'
  }
})

async function handleSignOut() {
  await authStore.signOut()
}
</script>

<template>
  <div class="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
    <header class="border-b border-stone-800/60">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link
          to="/"
          class="font-semibold text-lg tracking-tight text-amber-400/90 hover:text-amber-400"
        >
          Cherryfire
        </router-link>
        <button
          type="button"
          @click="handleSignOut"
          class="text-stone-400 hover:text-stone-200 text-sm transition"
        >
          Sign out
        </button>
      </div>
    </header>

    <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <p v-if="apiError" class="text-red-400 mb-4">{{ apiError }}</p>
      <div
        v-else-if="me"
        class="rounded-xl border border-stone-800/80 bg-stone-900/50 p-6 max-w-md"
      >
        <p class="text-stone-400 text-sm mb-1">Logged in as (from Go API /api/me)</p>
        <p class="font-mono text-amber-400/90">{{ me.email }}</p>
        <p class="text-stone-500 text-xs mt-2">ID: {{ me.id }}</p>
      </div>
      <div v-else class="text-stone-500">Loading…</div>
      <div class="mt-6">
        <router-link
          to="/rule-editor"
          class="inline-flex items-center rounded-lg bg-amber-500/20 text-amber-400 px-4 py-2 text-sm font-medium hover:bg-amber-500/30 transition"
        >
          Éditeur de règles →
        </router-link>
      </div>
      <p class="mt-4 text-stone-500 text-sm">
        Client user: {{ user?.email ?? '—' }}
      </p>
    </main>
  </div>
</template>
