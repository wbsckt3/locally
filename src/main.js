// npm install vuetify@next --save
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/index.js'
import vuetify from './plugins/vuetify'
import 'vuetify/styles' // Asegúrate de que los estilos de Vuetify están importados

const app = createApp(App) // Crea la instancia de la aplicación Vue
app.use(router)
app.use(store)
app.use(vuetify) // Registra Vuetify como plugin

// Initialize authentication on app start
store.dispatch('checkAuthStatus').then((isAuthenticated) => {
  console.log('🔍 Auth status checked:', isAuthenticated)
  app.mount('#app')
}).catch((error) => {
  console.error('❌ Error checking auth status:', error)
  app.mount('#app')
})
