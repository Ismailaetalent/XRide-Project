<template>
  <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md q-ma-md" style="width: 100%; max-width: 600px;" bordered>
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">
          Inscription {{ typeUser === 'chauffeur' ? 'Chauffeur' : 'Passager' }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit(form)" class="q-gutter-md">
          <!-- Champs communs -->
          <user-base-fields :form="form" @update:form="form = $event" />

          <!-- Champs spécifiques -->
          <chauffeur-fields
            v-if="form.typeUser === 'CHAUFFEUR'"
            :form="form"
            :type-voiture-options="typeVoitureOptions"
            @update:form="form = $event"
          />
          <passager-fields
            v-if="form.typeUser === 'PASSAGER'"
            :form="form"
            @update:form="form = $event"
          />

          <!-- Boutons -->
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
import { ref, watch } from 'vue';
import UserBaseFields from './Register/UserBaseFields.vue';
import ChauffeurFields from './Register/ChauffeurFields.vue';
import PassagerFields from './Register/PassengerFields.vue';
import ThirdPartyButtons from './ThirdPartyButtons.vue';
import { useRegister } from '../composables/useRegister';

export default {
  components: {
    UserBaseFields,
    ChauffeurFields,
    PassagerFields,
    ThirdPartyButtons,
  },
  props: {
    typeUser: {
      type: String,
      default: 'passager',
      validator: (val) => ['passager', 'chauffeur'].includes(val),
    },
  },
  setup(props) {
    const form = ref({
      nom: '',
      email: '',
      motDePasse: '',
      typeUser: props.typeUser === 'chauffeur' ? 'CHAUFFEUR' : 'PASSAGER',
      permis: '',
      dateNaissance: '',
      voitures: [],
    });

    const { typeVoitureOptions, loading, fetchTypeVoitures, submit } = useRegister();

    // Charger les types de voitures au montage
    fetchTypeVoitures();

    // Surveiller les changements de props.typeUser
    watch(
      () => props.typeUser,
      (newTypeUser) => {
        // Réinitialiser le formulaire avec le nouveau type
        form.value = {
          nom: '',
          email: '',
          motDePasse: '',
          typeUser: newTypeUser === 'chauffeur' ? 'CHAUFFEUR' : 'PASSAGER',
          permis: '',
          dateNaissance: '',
          voitures: [],
        };
      }
    );

    return {
      form,
      typeVoitureOptions,
      loading,
      submit,
    };
  },
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>