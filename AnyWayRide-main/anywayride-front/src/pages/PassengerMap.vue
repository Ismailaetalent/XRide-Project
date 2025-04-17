<template>
    <q-page class="q-pa-md">
      <q-card class="q-pa-md q-mb-md" bordered>
        <q-card-section>
          <div class="text-h5 text-primary">Rechercher un trajet</div>
        </q-card-section>
        <q-card-section>
          <p class="text-body1">Trouvez un trajet en indiquant votre point de départ et votre destination.</p>
        </q-card-section>
      </q-card>
  
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-form @submit="searchTrajet">
            <q-input
              v-model="form.depart"
              label="Point de départ"
              outlined
              :rules="[val => !!val || 'Départ requis']"
              class="q-mb-md"
            />
            <q-input
              v-model="form.arrivee"
              label="Destination"
              outlined
              :rules="[val => !!val || 'Destination requise']"
              class="q-mb-md"
            />
            <q-btn
              label="Rechercher"
              type="submit"
              color="primary"
              unelevated
              :loading="loading"
              :ripple="{ color: 'white', early: true }"
              aria-label="Rechercher un trajet"
            />
          </q-form>
        </div>
        <div class="col-12 col-md-8">
          <div id="map" style="height: 500px; width: 100%;"></div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import axios from 'axios';
  
  export default {
    name: 'Map',
    setup() {
      const $q = useQuasar();
      const form = ref({
        depart: '',
        arrivee: '',
      });
      const loading = ref(false);
      let map;
  
      const initMap = () => {
        // Initialiser Google Maps
        if (window.google && window.google.maps) {
          map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
            zoom: 12,
          });
        } else {
          // Fallback OpenStreetMap
          map = L.map('map').setView([48.8566, 2.3522], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);
        }
      };
  
      const searchTrajet = async () => {
        try {
          loading.value = true;
          const response = await axios.post('http://localhost:3000/api/trajets/search', {
            depart: form.value.depart,
            arrivee: form.value.arrivee,
          });
          const { trajets } = response.data;
          if (window.google && window.google.maps) {
            // Afficher sur Google Maps
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsService.route(
              {
                origin: form.value.depart,
                destination: form.value.arrivee,
                travelMode: google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(result);
                } else {
                  $q.notify({
                    type: 'negative',
                    message: 'Impossible de trouver un trajet',
                  });
                }
              }
            );
          } else {
            // Afficher sur OpenStreetMap (simplifié)
            map.eachLayer((layer) => {
              if (layer instanceof L.Polyline) map.removeLayer(layer);
            });
            L.polyline([
              [48.8566, 2.3522], // Exemple
              [48.8600, 2.3700],
            ]).addTo(map);
          }
          $q.notify({
            type: 'positive',
            message: `${trajets.length} trajets trouvés !`,
          });
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Erreur lors de la recherche',
          });
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        // Charger Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = initMap;
        document.head.appendChild(script);
  
        // Charger Leaflet (OpenStreetMap)
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletScript.async = true;
        document.head.appendChild(leafletScript);
  
        const leafletCss = document.createElement('link');
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCss.rel = 'stylesheet';
        document.head.appendChild(leafletCss);
      });
  
      return {
        form,
        loading,
        searchTrajet,
      };
    },
  };
  </script>
  
  <style scoped>
  .q-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  #map {
    border-radius: 8px;
  }
  </style>