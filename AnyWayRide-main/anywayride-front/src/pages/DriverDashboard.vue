<template>
    <q-page class="q-pa-md">
      <q-card class="q-pa-md q-mb-md" bordered>
        <q-card-section>
          <div class="text-h5 text-primary">Tableau de bord Chauffeur</div>
        </q-card-section>
        <q-card-section>
          <p class="text-body1">
            Bienvenue, chauffeur ! Gérez vos trajets, véhicules et revenus ici.
          </p>
        </q-card-section>
      </q-card>
  
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="q-pa-md" bordered>
            <q-card-section>
              <div class="text-h6">Mes Trajets</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item v-for="trajet in trajets" :key="trajet.id">
                  <q-item-section>
                    <q-item-label>{{ trajet.depart }} → {{ trajet.arrivee }}</q-item-label>
                    <q-item-label caption>{{ trajet.date }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      color="primary"
                      label="Détails"
                      :to="`/trajet/${trajet.id}`"
                      :ripple="{ color: 'primary' }"
                      aria-label="Voir les détails du trajet"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="q-pa-md" bordered>
            <q-card-section>
              <div class="text-h6">Mes Véhicules</div>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-item v-for="voiture in voitures" :key="voiture.id">
                  <q-item-section>
                    <q-item-label>{{ voiture.marque }} {{ voiture.modele }}</q-item-label>
                    <q-item-label caption>Type: {{ voiture.type }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      color="primary"
                      label="Modifier"
                      :to="`/voiture/${voiture.id}`"
                      :ripple="{ color: 'primary' }"
                      aria-label="Modifier le véhicule"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
  
      <q-card class="q-pa-md q-mt-md" bordered>
        <q-card-section>
          <div class="text-h6">Revenus</div>
        </q-card-section>
        <q-card-section>
          <p>Total ce mois : <strong>{{ revenusMensuels }} €</strong></p>
          <q-btn
            label="Voir l'historique"
            color="primary"
            flat
            :to="'/revenus'"
            :ripple="{ color: 'primary' }"
            aria-label="Voir l'historique des revenus"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'DriverDashboard',
    setup() {
      const trajets = ref([]);
      const voitures = ref([]);
      const revenusMensuels = ref(0);
  
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
  
          // Récupérer les trajets
          const trajetsResponse = await axios.get('http://localhost:3000/api/trajets', config);
          trajets.value = trajetsResponse.data;
  
          // Récupérer les véhicules
          const voituresResponse = await axios.get('http://localhost:3000/api/voitures', config);
          voitures.value = voituresResponse.data;
  
          // Récupérer les revenus
          const revenusResponse = await axios.get('http://localhost:3000/api/revenus', config);
          revenusMensuels.value = revenusResponse.data.total;
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      };
  
      onMounted(fetchData);
  
      return {
        trajets,
        voitures,
        revenusMensuels,
      };
    },
  };
  </script>
  
  <style scoped>
  .q-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  </style>