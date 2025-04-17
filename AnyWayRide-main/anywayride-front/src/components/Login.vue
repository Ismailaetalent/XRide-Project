<template>
    <div class="flex flex-center q-pa-md">
      <q-card class="q-pa-md q-ma-md" style="width: 100%; max-width: 600px;" bordered>
        <q-card-section>
          <div class="text-h5 text-primary text-center q-mb-md">Connexion</div>
        </q-card-section>
  
        <!-- Formulaire de connexion avec transition fade -->
        <q-card-section>
          <q-form @submit="submit" class="q-gutter-md">
            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              filled
              lazy-rules
              :rules="[val => !!val || 'L\'email est requis', val => /.+@.+\..+/.test(val) || 'Email invalide']"
              prepend-icon="email"
              transition="fade"
            />
            <q-input
              v-model="form.motDePasse"
              label="Mot de passe"
              type="password"
              filled
              lazy-rules
              :rules="[val => !!val || 'Le mot de passe est requis', val => val.length >= 6 || 'Minimum 6 caractères']"
              prepend-icon="lock"
              transition="fade"
            />
            <div class="q-mt-md flex justify-between">
              <q-btn
                label="Se connecter"
                type="submit"
                color="primary"
                icon="login"
                unelevated
                :ripple="{ color: 'white', early: true }"
                :loading="loading"
              />
              <q-btn
                label="S'inscrire"
                to="/register"
                color="secondary"
                flat
                :ripple="{ color: 'primary' }"
              />
            </div>
          </q-form>
        </q-card-section>
  
        <!-- Boutons tiers -->
        <q-card-section>
          <third-party-buttons />
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import ThirdPartyButtons from './ThirdPartyButtons.vue';
  import axios from 'axios';
  import { Notify } from 'quasar';
  
  export default {
    components: { ThirdPartyButtons },
    setup() {
      const loading = ref(false);
      return { loading };
    },
    data() {
      return {
        form: {
          email: '',
          motDePasse: '',
        },
      };
    },
    methods: {
      async submit() {
        this.loading = true;
        try {
          const response = await axios.post('/login', this.form);
          localStorage.setItem('token', response.data.token);
          Notify.create({
            type: 'positive',
            message: 'Connexion réussie !',
            position: 'top',
          });
          this.$router.push('/users');
        } catch (error) {
          Notify.create({
            type: 'negative',
            message: error.response?.data?.error || 'Erreur lors de la connexion',
            position: 'top',
          });
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .q-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  </style>