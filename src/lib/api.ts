import axios from 'axios'
import { supabase } from '@/lib/supabase'

const apiUrl = import.meta.env.VITE_API_URL as string || 'http://localhost:3000'

export const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})
