<template>
    <div class="q-gutter-md">
      <q-select
        v-model="localClientType"
        :options="clientTypeOptions"
        label="Type de client"
        outlined
        map-options
        option-value="value"
        option-label="label"
        :rules="[(val) => !!val || 'Type requis']"
        @update:model-value="onClientTypeChange"
      />
      <div>Type de client : {{ localClientType }}</div>
      
      <passager-fields
        v-if="localClientType === 'passager'"
        v-model="form.passager"
      />
      <entreprise-fields
        v-if="localClientType === 'entreprise'"
        v-model="form.entreprise"
      />
    </div>
  </template>
  
  <script>
  import PassagerFields from './PassagerFields.vue';
  import EntrepriseFields from './EntrepriseFields.vue';
  
  export default {
    name: 'ClientFields',
    components: {
      PassagerFields,
      EntrepriseFields,
    },
    props: {
      clientType: {
        type: String,
        default: '',
      },
      form: {
        type: Object,
        required: true,
        default: () => ({
          passager: { prenom: '', dateNaissance: '' },
          entreprise: { nomEntreprise: '', siret: '' },
        }),
      },
    },
    emits: ['update:clientType'],
    data() {
      return {
        clientTypeOptions: [
          { label: 'Passager', value: 'passager' },
          { label: 'Entreprise', value: 'entreprise' },
        ],
      };
    },
    computed: {
      localClientType: {
        get() {
          return this.clientType;
        },
        set(value) {
          this.$emit('update:clientType', value);
        },
      },
    },
    methods: {
      onClientTypeChange(newType) {
        console.log('Type de client sélectionné :', newType);
        const value = typeof newType === 'object' ? newType.value : newType;
        this.$emit('update:clientType', value);
        this.form.passager = { prenom: '', dateNaissance: '' };
        this.form.entreprise = { nomEntreprise: '', siret: '' };
      },
    },
  };
  </script>