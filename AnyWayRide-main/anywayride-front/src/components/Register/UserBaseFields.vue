<template>
  <div class="q-gutter-md">
    <q-input
      v-model="localForm.nom"
      label="Nom"
      filled
      lazy-rules
      :rules="[val => !!val || 'Le nom est requis']"
      prepend-icon="person"
    />
    <q-input
      v-model="localForm.email"
      label="Email"
      type="email"
      filled
      lazy-rules
      :rules="[val => !!val || 'L\'email est requis', val => /.+@.+\..+/.test(val) || 'Email invalide']"
      prepend-icon="email"
    />
    <q-input
      v-model="localForm.motDePasse"
      label="Mot de passe"
      type="password"
      filled
      lazy-rules
      :rules="[val => !!val || 'Le mot de passe est requis', val => val.length >= 6 || 'Minimum 6 caractères']"
      prepend-icon="lock"
    />
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    const localForm = computed({
      get: () => props.form,
      set: (value) => emit('update:form', value),
    });

    return { localForm };
  },
};
</script>