<template>
  <q-layout view="lHh Lpr lFf">
    <!-- En-tête avec barre de navigation -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat to="/" label="AnywayRide" />
        </q-toolbar-title>
        <q-space />
        <q-btn flat to="/register" label="S'inscrire" />
        <q-btn flat to="/login" label="Se connecter" />
        <q-btn
          v-if="isAuthenticated"
          flat
          to="/voitures"
          label="Gérer les voitures"
        />
        <q-btn
          v-if="isAuthenticated"
          flat
          to="/type-voitures"
          label="Gérer les types"
        />
        <q-btn
          v-if="isAuthenticated"
          flat
          to="/users"
          label="Gérer les utilisateurs"
        />
        <q-btn
          v-if="isAuthenticated"
          flat
          @click="logout"
          label="Déconnexion"
          icon="logout"
        />
      </q-toolbar>
    </q-header>

    <!-- Conteneur des pages -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const isAuthenticated = computed(() => !!localStorage.getItem('token'));

    const logout = () => {
      localStorage.removeItem('token');
      Notify.create({
        type: 'positive',
        message: 'Déconnexion réussie',
        position: 'top',
      });
      router.push('/login');
    };

    return { isAuthenticated, logout };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>