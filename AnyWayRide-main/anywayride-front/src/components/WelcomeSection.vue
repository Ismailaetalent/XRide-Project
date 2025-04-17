<template>
    <div class="q-pa-lg text-center text-white full-height">
      <div class="row items-center q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-slide-transition>
            <div>
              <h1 class="text-h3 text-weight-bold q-mb-sm">
                Bienvenue sur AnyWayRide
              </h1>
              <p class="text-h6 q-mb-lg">
                Votre plateforme de transport pour des trajets simples, rapides et fiables.
                Que vous soyez passager ou chauffeur, nous avons la solution pour vous.
              </p>
              <div class="q-gutter-md q-mt-md">
                <q-btn
                  label="Trouver un trajet"
                  to="/register/passager"
                  color="white"
                  text-color="primary"
                  unelevated
                  size="lg"
                  :ripple="{ color: 'primary', early: true }"
                  aria-label="S'inscrire comme passager pour trouver un trajet"
                />
                <q-btn
                  label="Devenir chauffeur"
                  to="/register/chauffeur"
                  color="white"
                  text-color="primary"
                  unelevated
                  size="lg"
                  :ripple="{ color: 'primary', early: true }"
                  aria-label="S'inscrire comme chauffeur pour proposer des trajets"
                />
              </div>
            </div>
          </q-slide-transition>
        </div>
        <div class="col-12 col-md-6">
          <q-carousel
            v-model="slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="white"
            class="bg-transparent rounded-borders"
            height="300px"
          >
            <q-carousel-slide
              name="passager"
              class="column no-wrap flex-center"
            >
              <q-img
                src="https://via.placeholder.com/400x300?text=Passager+Trajet"
                alt="Trouver un trajet avec AnyWayRide"
                class="rounded-borders"
                fit="contain"
              />
              <div class="text-caption q-mt-sm text-white">
                Trouvez des trajets rapides et abordables
              </div>
            </q-carousel-slide>
            <q-carousel-slide
              name="chauffeur"
              class="column no-wrap flex-center"
            >
              <q-img
                src="https://randomwordgenerator.com/img/picture-generator/54e2d6444d56b10ff3d8992cc12c30771037dbf852547940752779d79e4b_640.jpg"
                alt="Proposer des trajets avec AnyWayRide"
                class="rounded-borders"
                fit="contain"
              />
              <div class="text-caption q-mt-sm text-white">
                Proposez vos services et gagnez de l’argent
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
      <q-separator spaced />
      <div class="q-mt-lg">
        <h5 class="text-h5 q-mb-md">Pourquoi choisir AnyWayRide ?</h5>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-white text-primary q-pa-md">
              <q-icon name="speed" size="lg" class="q-mb-sm" />
              <h6 class="text-h6">Rapidité</h6>
              <p>Réservez ou proposez un trajet en quelques clics.</p>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-white text-primary q-pa-md">
              <q-icon name="security" size="lg" class="q-mb-sm" />
              <h6 class="text-h6">Sécurité</h6>
              <p>Profitez de trajets fiables avec des chauffeurs vérifiés.</p>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat class="bg-white text-primary q-pa-md">
              <q-icon name="savings" size="lg" class="q-mb-sm" />
              <h6 class="text-h6">Économie</h6>
              <p>Des prix compétitifs pour passagers et chauffeurs.</p>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'WelcomeSection',
    setup() {
      const slide = ref('passager');
      return { slide };
    },
  };
  </script>
  
  <style scoped>
  *{
    color:black;
  }
  .q-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .q-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .q-img {
    max-width: 100%;
  }
  </style>