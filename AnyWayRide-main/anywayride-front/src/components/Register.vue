<template>
  <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md q-ma-md" style="width: 100%; max-width: 600px;" bordered>
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">Inscription</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit" class="q-gutter-md">
          <q-input
            v-model="form.nom"
            label="Nom"
            filled
            lazy-rules
            :rules="[val => !!val || 'Le nom est requis']"
            prepend-icon="person"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            filled
            lazy-rules
            :rules="[val => !!val || 'L\'email est requis', val => /.+@.+\..+/.test(val) || 'Email invalide']"
            prepend-icon="email"
          />
          <q-input
            v-model="form.motDePasse"
            label="Mot de passe"
            type="password"
            filled
            lazy-rules
            :rules="[val => !!val || 'Le mot de passe est requis', val => val.length >= 6 || 'Minimum 6 caractères']"
            prepend-icon="lock"
          />
          <q-select
            v-model="form.typeUser"
            :options="typeUserOptions"
            label="Type d'utilisateur"
            filled
            emit-value
            map-options
            @update:model-value="resetSpecificFields"
            lazy-rules
            :rules="[val => !!val || 'Le type est requis']"
            prepend-icon="category"
          />

          <!-- Champs spécifiques -->
          <q-slide-transition>
            <div v-if="form.typeUser === 'CHAUFFEUR'" class="q-mt-md">
              <q-input
                v-model="form.permis"
                label="Numéro de permis"
                filled
                lazy-rules
                :rules="[val => !!val || 'Le numéro de permis est requis']"
                prepend-icon="directions_car"
              />
              <!-- Liste des voitures -->
              <div v-for="(voiture, index) in form.voitures" :key="index" class="q-mt-md">
                <q-card flat bordered class="q-pa-md">
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="voiture.marque"
                          label="Marque"
                          filled
                          lazy-rules
                          :rules="[val => !!val || 'La marque est requise']"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          v-model="voiture.modele"
                          label="Modèle"
                          filled
                          lazy-rules
                          :rules="[val => !!val || 'Le modèle est requis']"
                        />
                      </div>
                      <div class="col-12">
                        <q-select
                          v-model="voiture.typeVoitureId"
                          :options="typeVoitureOptions"
                          label="Type de voiture"
                          filled
                          emit-value
                          map-options
                          lazy-rules
                          :rules="[val => !!val || 'Le type est requis']"
                        />
                      </div>
                    </div>
                    <q-btn
                      v-if="form.voitures.length > 1"
                      flat
                      color="negative"
                      icon="delete"
                      label="Supprimer"
                      @click="removeVoiture(index)"
                      class="q-mt-md"
                    />
                  </q-card-section>
                </q-card>
              </div>
              <q-btn
                v-if="form.typeUser === 'CHAUFFEUR'"
                flat
                color="primary"
                icon="add"
                label="Ajouter une voiture"
                @click="addVoiture"
                class="q-mt-md"
              />
            </div>
          </q-slide-transition>
          <q-slide-transition>
            <div v-if="form.typeUser === 'ADMIN'" class="q-mt-md">
              <q-checkbox
                v-model="form.droits.canModerate"
                label="Peut modérer"
                color="primary"
              />
            </div>
          </q-slide-transition>
          <q-slide-transition>
            <div v-if="form.typeUser === 'PASSAGER'" class="q-mt-md">
              <q-input
                v-model="form.dateNaissance"
                label="Date de naissance"
                type="date"
                filled
                lazy-rules
                :rules="[val => !!val || 'La date de naissance est requise']"
                prepend-icon="cake"
              />
            </div>
          </q-slide-transition>

          <div class="q-mt-md flex justify-between">
            <q-btn
              label="S'inscrire"
              type="submit"
              color="primary"
              icon="how_to_reg"
              unelevated
              :ripple="{ color: 'white', early: true }"
              :loading="loading"
            />
            <q-btn
              label="Se connecter"
              to="/login"
              color="secondary"
              flat
              :ripple="{ color: 'primary' }"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <third-party-buttons />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ThirdPartyButtons from './ThirdPartyButtons.vue';
import axios from 'axios';
import { Notify } from 'quasar';

export default {
  components: { ThirdPartyButtons },
  setup() {
    const loading = ref(false);
    return { loading };
  },
  data() {
    return {
      form: {
        nom: '',
        email: '',
        motDePasse: '',
        typeUser: '',
        permis: '',
        droits: { canModerate: false },
        dateNaissance: '',
        voitures: [], // Liste des voitures pour CHAUFFEUR
      },
      typeUserOptions: [
        { label: 'Chauffeur', value: 'CHAUFFEUR' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Passager', value: 'PASSAGER' },
      ],
      typeVoitureOptions: [], // Options pour le type de voiture
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const payload = { ...this.form };
        if (payload.typeUser !== 'CHAUFFEUR') {
          delete payload.permis;
          delete payload.voitures;
        }
        if (payload.typeUser !== 'ADMIN') delete payload.droits;
        if (payload.typeUser !== 'PASSAGER') delete payload.dateNaissance;

        const response = await axios.post('/signup', payload);
        localStorage.setItem('token', response.data.token);
        Notify.create({
          type: 'positive',
          message: 'Inscription réussie !',
          position: 'top',
        });
        this.$router.push('/users');
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.error || 'Erreur lors de l\'inscription',
          position: 'top',
        });
      } finally {
        this.loading = false;
      }
    },
    resetSpecificFields() {
      this.form.permis = '';
      this.form.droits = { canModerate: false };
      this.form.dateNaissance = '';
      this.form.voitures = [];
    },
    addVoiture() {
      this.form.voitures.push({ marque: '', modele: '', typeVoitureId: null });
    },
    removeVoiture(index) {
      this.form.voitures.splice(index, 1);
    },
    async fetchTypeVoitures() {
      try {
        const response = await axios.get('/type-voitures');
        this.typeVoitureOptions = response.data.map((type) => ({
          label: type.nom,
          value: type.id,
        }));
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'Erreur lors du chargement des types de voitures',
          position: 'top',
        });
      }
    },
  },
  mounted() {
    this.fetchTypeVoitures();
  },
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>