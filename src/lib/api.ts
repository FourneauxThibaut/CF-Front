import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL as string || 'http://localhost:3000'

export const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cf_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
