<template>
  <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md q-ma-md" style="width: 100%; max-width: 400px;" bordered>
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">Connexion</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[val => !!val || 'Email requis', val => /.+@.+\..+/.test(val) || 'Email invalide']"
          />
          <q-input
            v-model="form.motDePasse"
            label="Mot de passe"
            type="password"
            outlined
            :rules="[val => !!val || 'Mot de passe requis']"
          />
          <q-btn
            label="Se connecter"
            type="submit"
            color="primary"
            unelevated
            :loading="loading"
            :ripple="{ color: 'white', early: true }"
            aria-label="Se connecter avec email et mot de passe"
          />
        </q-form>
      </q-card-section>

      <q-card-section>
        <third-party-buttons @login-success="handleThirdPartyLogin" />
      </q-card-section>

      <q-card-section class="text-center">
        <q-btn
          label="Pas de compte ? S'inscrire"
          to="/register/passager"
          flat
          color="primary"
          :ripple="{ color: 'primary' }"
          aria-label="Aller à la page d'inscription"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import ThirdPartyButtons from './ThirdPartyButtons.vue';
import { useQuasar } from 'quasar';

export default {
  name: 'Login',
  components: { ThirdPartyButtons },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const form = ref({
      email: '',
      motDePasse: '',
    });
    const loading = ref(false);

    const updateAuthState = (token) => {
      localStorage.setItem('token', token);
      // Déclencher un événement personnalisé pour notifier App.vue
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        newValue: token,
      }));
    };

    const handleLogin = async () => {
      try {
        loading.value = true;
        const response = await axios.post('http://localhost:3000/api/login', {
          email: form.value.email,
          motDePasse: form.value.motDePasse,
        });
        const { token } = response.data;
        updateAuthState(token);
        redirectBasedOnUserType(token);
        $q.notify({
          type: 'positive',
          message: 'Connexion réussie !',
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erreur de connexion',
        });
      } finally {
        loading.value = false;
      }
    };

    const handleThirdPartyLogin = async (providerData) => {
      try {
        loading.value = true;
        const response = await axios.post('http://localhost:3000/api/login/third-party', providerData);
        const { token } = response.data;
        updateAuthState(token);
        redirectBasedOnUserType(token);
        $q.notify({
          type: 'positive',
          message: 'Connexion via tiers réussie !',
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Erreur de connexion tiers',
        });
      } finally {
        loading.value = false;
      }
    };

    const redirectBasedOnUserType = (token) => {
      const decoded = jwtDecode(token);
      const typeUser = decoded.typeUser;
      switch (typeUser) {
        case 'ADMIN':
          router.push('/users');
          break;
        case 'CHAUFFEUR':
          router.push('/driver-dashboard');
          break;
        case 'PASSAGER':
          router.push('/map');
          break;
        default:
          router.push('/');
      }
    };

    return {
      form,
      loading,
      handleLogin,
      handleThirdPartyLogin,
    };
  },
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>