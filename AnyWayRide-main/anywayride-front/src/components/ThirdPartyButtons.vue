<template>
    <div class="q-gutter-md">
      <q-btn
        class="full-width google-btn"
        color="white"
        text-color="black"
        :loading="loading.google"
        :disable="loading.google || loading.facebook"
        @click="loginWithGoogle"
        unelevated
        :ripple="{ color: 'grey', early: true }"
      >
        <q-icon name="fab fa-google" left size="sm" />
        Continuer avec Google
      </q-btn>
      <q-btn
        class="full-width facebook-btn"
        color="blue-9"
        text-color="white"
        :loading="loading.facebook"
        :disable="loading.google || loading.facebook"
        @click="loginWithFacebook"
        unelevated
        :ripple="{ color: 'white', early: true }"
      >
        <q-icon name="fab fa-facebook" left size="sm" />
        Continuer avec Facebook
      </q-btn>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { Notify } from 'quasar';
  
  export default {
    setup() {
      const loading = ref({
        google: false,
        facebook: false,
      });
      return { loading };
    },
    methods: {
      async loginWithGoogle() {
        this.loading.google = true;
        try {
          // Simuler une requête au backend (à remplacer par ton flux OAuth)
          const response = await axios.post('/api/third-party-login', {
            provider: 'google',
            token: 'mock-google-token', // Remplacer par un vrai token OAuth
          });
          localStorage.setItem('token', response.data.token);
          Notify.create({
            type: 'positive',
            message: 'Connecté via Google !',
            position: 'top',
          });
          this.$router.push('/users');
        } catch (error) {
          Notify.create({
            type: 'negative',
            message: error.response?.data?.error || 'Erreur lors de la connexion Google',
            position: 'top',
          });
        } finally {
          this.loading.google = false;
        }
      },
      async loginWithFacebook() {
        this.loading.facebook = true;
        try {
          const response = await axios.post('/api/third-party-login', {
            provider: 'facebook',
            token: 'mock-facebook-token', // Remplacer par un vrai token OAuth
          });
          localStorage.setItem('token', response.data.token);
          Notify.create({
            type: 'positive',
            message: 'Connecté via Facebook !',
            position: 'top',
          });
          this.$router.push('/users');
        } catch (error) {
          Notify.create({
            type: 'negative',
            message: error.response?.data?.error || 'Erreur lors de la connexion Facebook',
            position: 'top',
          });
        } finally {
          this.loading.facebook = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .google-btn {
    border: 1px solid #dadce0;
    transition: transform 0.2s;
  }
  .google-btn:hover {
    transform: scale(1.02);
  }
  .facebook-btn {
    transition: transform 0.2s;
  }
  .facebook-btn:hover {
    transform: scale(1.02);
  }
  .full-width {
    width: 100%;
  }
  </style>