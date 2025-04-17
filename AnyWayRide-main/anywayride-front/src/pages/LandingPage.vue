<template>
    <div class="full-height bg-primary text-white">
      <!-- Section héro -->
      <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg" :height="600">
        <div class="column items-center justify-center full-height">
          <h1 class="text-h2 text-bold text-center q-mb-md">Bienvenue sur AnywayRide</h1>
          <p class="text-h5 text-center q-mb-md">Votre plateforme de covoiturage simple et rapide</p>
          <div class="q-gutter-md">
            <q-btn
              to="/register"
              label="S'inscrire"
              color="secondary"
              size="lg"
              unelevated
              :ripple="{ color: 'white', early: true }"
            />
            <q-btn
              to="/login"
              label="Se connecter"
              outline
              color="white"
              size="lg"
              :ripple="{ color: 'secondary' }"
            />
          </div>
        </div>
      </q-parallax>
  
      <!-- Section fonctionnalités -->
      <q-section class="q-pa-lg bg-white text-primary">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-pa-md text-center">
              <q-icon name="directions_car" size="xl" color="primary" />
              <h6 class="q-mt-md">Pour les chauffeurs</h6>
              <p>Proposez vos trajets et gagnez de l'argent facilement.</p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-pa-md text-center">
              <q-icon name="people" size="xl" color="primary" />
              <h6 class="q-mt-md">Pour les passagers</h6>
              <p>Réservez un trajet en quelques clics, où que vous soyez.</p>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-pa-md text-center">
              <q-icon name="security" size="xl" color="primary" />
              <h6 class="q-mt-md">Sécurisé</h6>
              <p>Vos données et trajets sont protégés avec soin.</p>
            </q-card>
          </div>
        </div>
      </q-section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LandingPage',
  };
  </script>
  
  <style scoped>
  .full-height {
    min-height: 100vh;
  }
  </style>