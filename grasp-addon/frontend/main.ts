import { createApp } from 'vue'
import App from './App.vue'

// Créer l'application Vue
const app = createApp(App)

// Monter l'application
app.mount('#app')

// Types pour le développement
declare global {
  interface Window {
    __GRASP_ADDON_VERSION__: string
  }
}

// Version de l'add-on
window.__GRASP_ADDON_VERSION__ = '1.0.0'

console.log('🔥 Grasp Add-on démarré - Version', window.__GRASP_ADDON_VERSION__)
