<template>
  <div class="flex flex-center q-pa-md">
    <q-card class="q-pa-md q-ma-md" style="width: 100%; max-width: 600px;" bordered>
      <q-card-section>
        <div class="text-h5 text-primary text-center q-mb-md">Inscription</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit(form)" class="q-gutter-md">
          <!-- Champs communs -->
          <user-base-fields
            :form="form"
            @update:form="form = $event"
            @type-changed="resetSpecificFields"
          />

          <!-- Champs spécifiques -->
          <chauffeur-fields
            v-if="form.typeUser === 'CHAUFFEUR'"
            :form="form"
            :type-voiture-options="typeVoitureOptions"
            @update:form="form = $event"
          />
          <admin-fields
            v-if="form.typeUser === 'ADMIN'"
            :form="form"
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
import { ref } from 'vue';
import UserBaseFields from '../components/Register/UserBaseFields.vue';
import ChauffeurFields from '../components/Register/ChauffeurFields.vue';
import AdminFields from '../components/Register/AdminFields.vue';
import PassagerFields from '../components/Register/PassengerFields.vue';
import ThirdPartyButtons from '../components/ThirdPartyButtons.vue';
import { useRegister } from '../composables/useRegister';

export default {
  components: {
    UserBaseFields,
    ChauffeurFields,
    AdminFields,
    PassagerFields,
    ThirdPartyButtons,
  },
  setup() {
    const form = ref({
      nom: '',
      email: '',
      motDePasse: '',
      typeUser: '',
      permis: '',
      droits: { canModerate: false },
      dateNaissance: '',
      voitures: [],
    });

    const { typeVoitureOptions, loading, fetchTypeVoitures, submit } = useRegister();

    fetchTypeVoitures();

    const resetSpecificFields = () => {
      form.value.permis = '';
      form.value.droits = { canModerate: false };
      form.value.dateNaissance = '';
      form.value.voitures = [];
    };

    return {
      form,
      typeVoitureOptions,
      loading,
      submit,
      resetSpecificFields,
    };
  },
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>