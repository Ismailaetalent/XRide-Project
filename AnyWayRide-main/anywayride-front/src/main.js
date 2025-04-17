// FILE: main.js

import { createApp } from 'vue';
import { Quasar } from 'quasar';
import router from './router'; // Importation de Vue Router
import store from './store'; // Importation de Vuex
import axios from 'axios';

// Import icon libraries
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css';
import '@quasar/extras/mdi-v7/mdi-v7.css';
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import '@quasar/extras/ionicons-v4/ionicons-v4.css';
import '@quasar/extras/eva-icons/eva-icons.css';
import '@quasar/extras/themify/themify.css';
import '@quasar/extras/line-awesome/line-awesome.css';
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';

// Import Quasar css
import 'quasar/dist/quasar.css';

// Assumes your root component is App.vue
import App from './App.vue';
import { Notify } from 'quasar';

// Configurer Axios
axios.defaults.baseURL = 'http://localhost:3000/api'; // Remplacez par l'URL de votre API
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Créer l'application
const myApp = createApp(App);

// Utiliser les plugins
myApp.use(Quasar, {
  plugins: {
    Notify
  }, // Importez les plugins Quasar ici si nécessaire (ex. Notify, Dialog)
 config: { brand: { google: '#4285F4', facebook: '#3B5998' } } 
});

myApp.use(router); // Intégration de Vue Router
myApp.use(store); // Intégration de Vuex

// Monter l'application
myApp.mount('#app');