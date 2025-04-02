<template>
  <q-page class="flex column justify-start items-center">
    <div style="width: 80%; max-width: 800px; padding: 20px;">
      <q-card>
        <q-card-section>
          <div class="text-h6">Find Your Transfer</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input filled type="text" label="From: Address, Airport, Hotel" v-model="from" />
            <q-input filled type="text" label="To: Address, Airport, Hotel" v-model="to" />
            <q-input filled type="datetime-local" label="Pickup Date/Time" v-model="pickupTime" />
            <div>
              <q-btn label="Get Offers" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <div class="q-pa-md">
        <div class="text-h6">Our Fleet</div>
        <div class="row q-gutter-sm">
          <q-btn v-for="type in vehicleTypes" :key="type.id" :label="type.label" icon-right="directions_car" color="secondary" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const from = ref('');
    const to = ref('');
    const pickupTime = ref('');
    const vehicleTypes = ref([
      { id: 'economy', label: 'Economy' },
      { id: 'comfort', label: 'Comfort' },
      { id: 'business', label: 'Business' },
      { id: 'vip', label: 'VIP' },
      { id: 'suv', label: 'SUV' },
      { id: 'van', label: 'Van' },
    ]);

    const onSubmit = () => {
      // Handle form submission (e.g., navigate to results page)
      console.log('Form submitted:', { from: from.value, to: to.value, pickupTime: pickupTime.value });
    };

    return {
      from,
      to,
      pickupTime,
      vehicleTypes,
      onSubmit,
    };
  },
};
</script>
