import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Phosphor Icons
import PhosphorIcons from '@phosphor-icons/vue'

// Auth
import { authStore } from './store/authStore'

const app = createApp(App)

app.use(router)
app.use(PhosphorIcons)

// Initialize auth session before mounting
authStore.init().then(() => {
  app.mount('#app')
})
