<template>
    <div class="q-gutter-md">
      <q-input
        v-model="localEntreprise.nomEntreprise"
        label="Nom de l'entreprise"
        outlined
        :rules="[(val) => !!val || 'Nom de l\'entreprise requis']"
        @update:model-value="$emit('update:modelValue', localEntreprise)"
      />
      <q-input
        v-model="localEntreprise.siret"
        label="Numéro SIRET"
        outlined
        :rules="[(val) => !!val || 'SIRET requis']"
        @update:model-value="$emit('update:modelValue', localEntreprise)"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'EntrepriseFields',
    props: {
      modelValue: {
        type: Object,
        required: true,
        default: () => ({ nomEntreprise: '', siret: '' }),
      },
    },
    emits: ['update:modelValue'],
    computed: {
      localEntreprise: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        },
      },
    },
  };
  </script>