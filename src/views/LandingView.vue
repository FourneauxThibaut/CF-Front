<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { error } = storeToRefs(authStore)

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const submitLoading = ref(false)

const title = computed(() =>
  mode.value === 'signin' ? 'Sign in' : 'Create account'
)
const switchPrompt = computed(() =>
  mode.value === 'signin'
    ? "Don't have an account?"
    : 'Already have an account?'
)
const switchLabel = computed(() =>
  mode.value === 'signin' ? 'Sign up' : 'Sign in'
)

function toggleMode() {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  authStore.error = null
  email.value = ''
  password.value = ''
}

async function handleSubmit() {
  submitLoading.value = true
  authStore.error = null
  if (mode.value === 'signin') {
    const result = await authStore.signIn(email.value, password.value)
    if (result.ok) router.push({ name: 'dashboard' })
  } else {
    const result = await authStore.signUp(email.value, password.value)
    if (result.ok) router.push({ name: 'dashboard' })
  }
  submitLoading.value = false
}
</script>

<template>
  <div class="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <section class="text-center max-w-2xl mx-auto mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Build something
          <span class="text-primary/90">that matters</span>
        </h1>
        <p class="text-stone-400 text-lg">
          A simple stack: Vue, Go. Auth via CF-Back API.
        </p>
      </section>

      <section
        id="auth"
        class="w-full max-w-sm rounded-2xl border border-stone-800/80 bg-stone-900/50 p-6 shadow-xl"
      >
        <h2 class="text-xl font-semibold mb-6">{{ title }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-stone-400 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full rounded-lg bg-stone-800/80 border border-stone-700 text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-stone-400 mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
              class="w-full rounded-lg bg-stone-800/80 border border-stone-700 text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              placeholder="••••••••"
            />
          </div>
          <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
          <button
            type="submit"
            :disabled="submitLoading"
            class="w-full rounded-lg bg-primary/90 hover:bg-primary text-white font-medium py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitLoading ? 'Please wait…' : title }}
          </button>
        </form>
        <p class="mt-4 text-center text-sm text-stone-500">
          {{ switchPrompt }}
          <button
            type="button"
            @click="toggleMode"
            class="text-primary/90 hover:text-primary font-medium ml-1"
          >
            {{ switchLabel }}
          </button>
        </p>
      </section>
    </main>

    <footer class="border-t border-stone-800/60 py-6 text-center text-stone-500 text-sm">
      Cherryfire — Vue + Go
    </footer>
  </div>
</template>
