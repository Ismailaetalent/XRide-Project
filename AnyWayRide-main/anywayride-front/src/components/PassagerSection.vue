<template>
    <q-section class="q-pa-lg text-center bg-primary text-white full-height">
      <q-slide-transition>
        <div>
          <h1 class="text-h3 text-weight-bold q-mb-sm">Voyagez Facilement avec AnyWayRide</h1>
          <p class="text-h6 q-mb-lg">
            Trouvez des trajets rapides, abordables et fiables, où que vous soyez.
          </p>
          <div class="q-gutter-md">
            <q-btn
              v-if="!authStore.isAuthenticated"
              label="S’inscrire comme Passager"
              to="/register/passager"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="S’inscrire comme passager"
            />
            <q-btn
              v-if="!authStore.isAuthenticated"
              label="Se connecter"
              :to="{ path: '/login', query: { type: 'passager' } }"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="Se connecter comme passager"
            />
            <q-btn
              v-if="authStore.isAuthenticated && authStore.userType === 'PASSAGER'"
              label="Rechercher un trajet"
              to="/map"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="Aller à la page de recherche de trajets"
            />
          </div>
        </div>
      </q-slide-transition>
    </q-section>
  </template>
  
  <script>
  import { useAuthStore } from '../store/auth';
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  
  export default {
    name: 'PassagerSection',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const $q = useQuasar();
  
      onMounted(() => {
        if (authStore.isAuthenticated && authStore.userType !== 'PASSAGER') {
          $q.notify({
            type: 'negative',
            message: 'Accès réservé aux passagers.',
          });
          router.push(
            authStore.userType === 'CHAUFFEUR'
              ? '/driver-dashboard'
              : authStore.userType === 'ADMIN'
              ? '/users'
              : '/',
          );
        }
      });
  
      return {
        authStore,
      };
    },
  };
  </script>
  
  <style scoped>
  .q-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  </style>