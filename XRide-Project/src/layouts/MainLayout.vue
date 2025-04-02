<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          Xride.com
        </q-toolbar-title>
        <div>
          <q-btn label="Log in" />
          <q-btn label="Sign up" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer (menu de navigation) -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            Home
          </q-item-section>
        </q-item>
        <!-- Ajoute d'autres items de menu ici -->
      </q-list>
    </q-drawer>

    <!-- Contenu principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-primary text-white">
      <q-row class="items-center justify-center">
        <q-col>
          <div class="text-center">
            <p>&copy; 2025 Xride.com - Tous droits réservés</p>
          </div>
        </q-col>
      </q-row>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
    };
  },
};
</script>
