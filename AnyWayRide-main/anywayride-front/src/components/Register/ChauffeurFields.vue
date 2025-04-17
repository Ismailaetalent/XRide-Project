<template>
  <q-slide-transition>
    <div class="q-mt-md">
      <q-input
        v-model="localForm.permis"
        label="Numéro de permis"
        filled
        lazy-rules
        :rules="[val => !!val || 'Le numéro de permis est requis']"
        prepend-icon="directions_car"
      />
      <!-- Liste des voitures -->
      <div v-for="(voiture, index) in localForm.voitures" :key="index" class="q-mt-md">
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
              v-if="localForm.voitures.length > 1"
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
        flat
        color="primary"
        icon="add"
        label="Ajouter une voiture"
        @click="addVoiture"
        class="q-mt-md"
      />
    </div>
  </q-slide-transition>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
    typeVoitureOptions: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    const localForm = computed({
      get: () => props.form,
      set: (value) => emit('update:form', value),
    });

    const addVoiture = () => {
      const updatedVoitures = [...localForm.value.voitures, { marque: '', modele: '', typeVoitureId: null }];
      emit('update:form', { ...localForm.value, voitures: updatedVoitures });
    };

    const removeVoiture = (index) => {
      const updatedVoitures = localForm.value.voitures.filter((_, i) => i !== index);
      emit('update:form', { ...localForm.value, voitures: updatedVoitures });
    };

    return {
      localForm,
      addVoiture,
      removeVoiture,
    };
  },
};
</script>