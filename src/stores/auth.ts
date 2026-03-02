import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api'

export interface User {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

export interface Session {
  access_token: string
  refresh_token?: string
  expires_in?: number
  user: User
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    async function init() {
      loading.value = true
      const token = accessToken.value ?? localStorage.getItem('cf_access_token')
      const storedRefresh = refreshToken.value ?? localStorage.getItem('cf_refresh_token')
      if (token) {
        accessToken.value = token
        refreshToken.value = storedRefresh
        localStorage.setItem('cf_access_token', token)
        if (storedRefresh) localStorage.setItem('cf_refresh_token', storedRefresh)
        try {
          const { data } = await api.get<{ id: string; email: string }>('/api/me')
          user.value = { id: data.id, email: data.email }
        } catch {
          clearSession()
        }
      } else {
        clearSession()
      }
      loading.value = false
    }

    function setSession(session: Session) {
      accessToken.value = session.access_token
      user.value = session.user
      refreshToken.value = session.refresh_token ?? null
      localStorage.setItem('cf_access_token', session.access_token)
      if (session.refresh_token) {
        localStorage.setItem('cf_refresh_token', session.refresh_token)
      }
    }

    function clearSession() {
      accessToken.value = null
      user.value = null
      refreshToken.value = null
      localStorage.removeItem('cf_access_token')
      localStorage.removeItem('cf_refresh_token')
    }

    async function signIn(email: string, password: string) {
      error.value = null
      try {
        const { data } = await api.post<Session>('/auth/login', { email, password })
        setSession(data)
        return { ok: true as const }
      } catch (e: unknown) {
        const msg = (e as { response?: { data?: { error_description?: string } } })?.response?.data?.error_description ?? 'Sign in failed'
        error.value = msg
        return { ok: false as const, error: msg }
      }
    }

    async function signUp(email: string, password: string) {
      error.value = null
      try {
        const { data } = await api.post<Session & { session?: Session }>('/auth/signup', { email, password })
        const session = data.session ?? (data.access_token ? data : null)
        if (session?.access_token) {
          setSession(session)
        }
        return { ok: true as const }
      } catch (e: unknown) {
        const msg = (e as { response?: { data?: { error_description?: string } } })?.response?.data?.error_description ?? 'Sign up failed'
        error.value = msg
        return { ok: false as const, error: msg }
      }
    }

    async function signOut() {
      error.value = null
      try {
        await api.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${accessToken.value}` },
        })
      } catch {
        // ignore
      }
      clearSession()
    }

    return {
      user,
      accessToken,
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
