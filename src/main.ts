import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import { createI18n } from 'vue-i18n'
import router from './router'
import App from './App.vue'
import { dbService } from './services'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import 'quasar/dist/quasar.css'
import './style.css'

// Import Leaflet CSS files
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

// Import language files
import en from './i18n/en.json'
import es from './i18n/es.json'
import fr from './i18n/fr.json'
import de from './i18n/de.json'
import ru from './i18n/ru.json'

// Configure i18n
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    fr,
    de,
    ru
  }
})

// Initialize mock database
dbService.initializeDb().then(() => {
  console.log('Mock database initialized');
}).catch(err => {
  console.error('Error initializing mock database:', err);
});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }]
    }
  }
})

app.mount('#app')
