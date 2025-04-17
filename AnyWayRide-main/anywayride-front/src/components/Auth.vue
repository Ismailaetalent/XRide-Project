<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">{{ isSignup ? 'Inscription' : 'Connexion' }}</h1>
  
      <!-- Formulaire -->
      <div class="mb-4">
        <div class="grid grid-cols-2 gap-4">
          <input v-if="isSignup" v-model="form.nom" placeholder="Nom" class="border p-2" />
          <input v-model="form.email" placeholder="Email" class="border p-2" />
          <input v-model="form.motDePasse" type="password" placeholder="Mot de passe" class="border p-2" />
          <select v-if="isSignup" v-model="form.typeUser" @change="resetSpecificFields" class="border p-2">
            <option disabled value="">Sélectionner un type</option>
            <option value="CHAUFFEUR">Chauffeur</option>
            <option value="ADMIN">Admin</option>
            <option value="PASSAGER">Passager</option>
          </select>
          <!-- Champs spécifiques pour signup -->
          <input v-if="isSignup && form.typeUser === 'CHAUFFEUR'" v-model="form.permis" placeholder="Numéro de permis" class="border p-2" />
          <input v-if="isSignup && form.typeUser === 'ADMIN'" v-model="form.droits.canModerate" type="checkbox" class="mr-2" />
          <label v-if="isSignup && form.typeUser === 'ADMIN'">Peut modérer</label>
          <input v-if="isSignup && form.typeUser === 'PASSAGER'" v-model="form.dateNaissance" type="date" class="border p-2" />
        </div>
        <button @click="submit" class="bg-blue-500 text-white p-2 mt-2">
          {{ isSignup ? 'S\'inscrire' : 'Se connecter' }}
        </button>
        <button @click="toggleMode" class="bg-gray-500 text-white p-2 mt-2 ml-2">
          {{ isSignup ? 'Se connecter' : 'S\'inscrire' }}
        </button>
      </div>
  
      <!-- Services tiers -->
      <div class="mt-4">
        <h2 class="text-xl mb-2">Connexion avec services tiers</h2>
        <button @click="thirdPartyLogin('google')" class="bg-red-500 text-white p-2 mr-2">Google</button>
        <button @click="thirdPartyLogin('facebook')" class="bg-blue-600 text-white p-2 mr-2">Facebook</button>
        <button @click="thirdPartyLogin('twilio')" class="bg-green-500 text-white p-2">Twilio</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        isSignup: true,
        form: {
          nom: '',
          email: '',
          motDePasse: '',
          typeUser: '',
          permis: '',
          droits: { canModerate: false },
          dateNaissance: '',
        },
      };
    },
    methods: {
      async submit() {
        try {
          const payload = { ...this.form };
          if (this.isSignup) {
            if (payload.typeUser !== 'CHAUFFEUR') delete payload.permis;
            if (payload.typeUser !== 'ADMIN') delete payload.droits;
            if (payload.typeUser !== 'PASSAGER') delete payload.dateNaissance;
            const response = await axios.post('/signup', payload);
            localStorage.setItem('token', response.data.token);
            this.$router.push('/users');
          } else {
            const response = await axios.post('/login', {
              email: payload.email,
              motDePasse: payload.motDePasse,
            });
            localStorage.setItem('token', response.data.token);
            this.$router.push('/users');
          }
        } catch (error) {
          console.error('Erreur:', error.response?.data?.error || error.message);
        }
      },
      async thirdPartyLogin(provider) {
        try {
          const data = provider === 'twilio' ? { phone: '+1234567890' } : { email: `mock@${provider}.com`, name: `Mock ${provider} User` };
          const response = await axios.post('/third-party-login', { provider, data });
          localStorage.setItem('token', response.data.token);
          this.$router.push('/users');
        } catch (error) {
          console.error('Erreur:', error.response?.data?.error || error.message);
        }
      },
      toggleMode() {
        this.isSignup = !this.isSignup;
        this.resetForm();
      },
      resetForm() {
        this.form = {
          nom: '',
          email: '',
          motDePasse: '',
          typeUser: '',
          permis: '',
          droits: { canModerate: false },
          dateNaissance: '',
        };
      },
      resetSpecificFields() {
        this.form.permis = '';
        this.form.droits = { canModerate: false };
        this.form.dateNaissance = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles Tailwind inclus dans le template */
  </style>