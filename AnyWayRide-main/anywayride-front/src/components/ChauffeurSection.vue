<template>
    <q-section class="q-pa-lg text-center bg-primary text-white full-height">
      <q-slide-transition>
        <div>
          <h1 class="text-h3 text-weight-bold q-mb-sm">Devenez Chauffeur avec AnyWayRide</h1>
          <p class="text-h6 q-mb-lg">
            Proposez vos services, gérez vos trajets et gagnez de l’argent.
          </p>
          <div class="q-gutter-md">
            <q-btn
              v-if="!authStore.isAuthenticated"
              label="S’inscrire comme Chauffeur"
              to="/register/chauffeur"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="S’inscrire comme chauffeur"
            />
            <q-btn
              v-if="!authStore.isAuthenticated"
              label="Se connecter"
              :to="{ path: '/login', query: { type: 'chauffeur' } }"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="Se connecter comme chauffeur"
            />
            <q-btn
              v-if="authStore.isAuthenticated && authStore.userType === 'CHAUFFEUR'"
              label="Gérer vos trajets"
              to="/driver-dashboard"
              color="white"
              text-color="primary"
              unelevated
              size="lg"
              :ripple="{ color: 'primary', early: true }"
              aria-label="Aller au tableau de bord chauffeur"
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
    name: 'ChauffeurSection',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const $q = useQuasar();
  
      onMounted(() => {
        if (authStore.isAuthenticated && authStore.userType !== 'CHAUFFEUR') {
          $q.notify({
            type: 'negative',
            message: 'Accès réservé aux chauffeurs.',
          });
          router.push(
            authStore.userType === 'PASSAGER'
              ? '/map'
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

  

    