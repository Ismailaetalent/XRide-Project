<template>
    <div class="q-gutter-md">
      <q-input
        v-model="localPassager.prenom"
        label="Prénom"
        outlined
        :rules="[(val) => !!val || 'Prénom requis']"
        @update:model-value="$emit('update:modelValue', localPassager)"
      />
      <q-input
        v-model="localPassager.dateNaissance"
        type="date"
        label="Date de naissance"
        outlined
        :rules="[(val) => !!val || 'Date de naissance requise']"
        @update:model-value="$emit('update:modelValue', localPassager)"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'PassagerFields',
    props: {
      modelValue: {
        type: Object,
        required: true,
        default: () => ({ prenom: '', dateNaissance: '' }),
      },
    },
    emits: ['update:modelValue'],
    computed: {
      localPassager: {
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