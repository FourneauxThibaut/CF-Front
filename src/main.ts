import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import { useAuthStore } from '@/stores/auth'
import '@/style.css'
import '@/scss/index.scss'

const app = createApp(App)
app.use(pinia)
app.use(router)

// Init auth (session restore) before first route
const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
