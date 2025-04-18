<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>AnyWayRide</q-toolbar-title>
        <q-space />
        <!--<q-btn
          v-if="!authStore.isAuthenticated"
          flat
          label="Connexion"
          to="/login"
          aria-label="Aller à la page de connexion"
        />
        <q-btn
          v-if="!authStore.isAuthenticated"
          flat
          label="Inscription"
          to="/register/passager"
          aria-label="Aller à la page d’inscription"
        />-->
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          label="Déconnexion"
          @click="logout"
          aria-label="Se déconnecter"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen">
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <!-- Non-authentifié -->
        <template v-if="!authStore.isAuthenticated">
          <q-item to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Accueil</q-item-section>
          </q-item>
          <q-item to="/passager">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Service Passager</q-item-section>
          </q-item>
          <q-item to="/chauffeur">
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section>Services Chauffeur</q-item-section>
          </q-item>
        </template>

        <!-- Passager authentifié -->
        <template v-if="authStore.isAuthenticated && authStore.userType === 'PASSAGER'">
          <q-item to="/map">
            <q-item-section avatar>
              <q-icon name="map" />
            </q-item-section>
            <q-item-section>Rechercher un trajet</q-item-section>
          </q-item>
          <!-- Optionnel : Décommenter si implémenté -->
           <q-item to="/my-trips">
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>Mes trajets</q-item-section>
          </q-item> 
        </template>

        <!-- Chauffeur authentifié -->
        <template v-if="authStore.isAuthenticated && authStore.userType === 'CHAUFFEUR'">
          <q-item to="/driver-dashboard">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Tableau de bord</q-item-section>
          </q-item>
          <!-- Optionnel : Décommenter si implémenté -->
          <q-item to="/my-vehicles">
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section>Mes véhicules</q-item-section>
          </q-item> 
        </template>

        <!-- Admin authentifié -->
        <template v-if="authStore.isAuthenticated && authStore.userType === 'ADMIN'">
          <q-item to="/users">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>Gestion des utilisateurs</q-item-section>
          </q-item>
          <!-- Optionnel : Décommenter si implémenté -->
          <q-item to="/reports">
            <q-item-section avatar>
              <q-icon name="assessment" />
            </q-item-section>
            <q-item-section>Rapports</q-item-section>
          </q-item> 
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/auth';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'App',
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    onMounted(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          authStore.login(token);
        } catch (error) {
          authStore.logout();
        }
      }
    });

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      leftDrawerOpen,
      authStore,
      toggleLeftDrawer,
      logout,
    };
  },
};
</script>
