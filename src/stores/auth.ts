import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<SupabaseUser | null>(null)
    const session = ref<Session | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!session.value)

    async function init() {
      loading.value = true
      const {
        data: { session: s },
        error: e,
      } = await supabase.auth.getSession()
      session.value = s
      user.value = s?.user ?? null
      error.value = e?.message ?? null
      loading.value = false

      supabase.auth.onAuthStateChange((_event, s) => {
        session.value = s
        user.value = s?.user ?? null
      })
    }

    async function signIn(email: string, password: string) {
      error.value = null
      const { data, error: e } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (e) {
        error.value = e.message
        return { ok: false as const, error: e.message }
      }
      session.value = data.session
      user.value = data.user
      return { ok: true as const }
    }

    async function signUp(email: string, password: string) {
      error.value = null
      const { data, error: e } = await supabase.auth.signUp({
        email,
        password,
      })
      if (e) {
        error.value = e.message
        return { ok: false as const, error: e.message }
      }
      session.value = data.session
      user.value = data.user
      return { ok: true as const }
    }

    async function signOut() {
      error.value = null
      await supabase.auth.signOut()
      session.value = null
      user.value = null
    }

    return {
      user,
      session,
      loading,
      error,
      isAuthenticated,
      init,
      signIn,
      signUp,
      signOut,
    }
  },
  { persist: false }
)
