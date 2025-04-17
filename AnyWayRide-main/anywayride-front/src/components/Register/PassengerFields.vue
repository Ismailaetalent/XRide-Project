<template>
  <q-slide-transition>
    <div class="q-mt-md">
      <q-input
        v-model="localForm.dateNaissance"
        label="Date de naissance"
        type="date"
        filled
        lazy-rules
        :rules="[val => !!val || 'La date de naissance est requise']"
        prepend-icon="cake"
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