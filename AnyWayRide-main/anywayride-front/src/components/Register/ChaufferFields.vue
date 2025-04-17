<template>
    <div class="q-gutter-md">
      <q-input
        v-model="localChauffeur.licence"
        label="Numéro de permis"
        outlined
        :rules="[(val) => !!val || 'Numéro de permis requis']"
        @update:model-value="$emit('update:chauffeur', localChauffeur)"
      />
      <q-card flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Ajouter une voiture</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="localChauffeur.voiture.immatriculation"
            label="Immatriculation"
            outlined
            :rules="[(val) => !!val || 'Immatriculation requise']"
            @update:model-value="$emit('update:chauffeur', localChauffeur)"
          />
          <q-input
            v-model="localChauffeur.voiture.modele"
            label="Modèle"
            outlined
            :rules="[(val) => !!val || 'Modèle requis']"
            @update:model-value="$emit('update:chauffeur', localChauffeur)"
          />
          <q-select
            v-model="localChauffeur.voiture.typeVoitureId"
            :options="typeVoitureOptions"
            label="Type de voiture"
            outlined
            map-options
            option-value="id"
            option-label="nom"
            :rules="[(val) => !!val || 'Type de voiture requis']"
            :loading="isLoading"
            @update:model-value="$emit('update:chauffeur', localChauffeur)"
          />
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChauffeurFields',
    props: {
      chauffeur: {
        type: Object,
        required: true,
        default: () => ({
          licence: '',
          voiture: { immatriculation: '', modele: '', typeVoitureId: null },
        }),
      },
      typeVoitureOptions: {
        type: Array,
        required: true,
        default: () => [],
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:chauffeur'],
    computed: {
      localChauffeur: {
        get() {
          return this.chauffeur;
        },
        set(value) {
          this.$emit('update:chauffeur', value);
        },
      },
    },
  };
  </script>