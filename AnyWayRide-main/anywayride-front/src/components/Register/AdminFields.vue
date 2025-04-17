<template>
  <q-slide-transition>
    <div class="q-mt-md">
      <q-checkbox
        v-model="localForm.droits.canModerate"
        label="Peut modérer"
        color="primary"
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