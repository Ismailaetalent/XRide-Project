<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Voitures</h1>
  
      <!-- Formulaire pour ajouter/modifier une voiture -->
      <div class="mb-4">
        <h2 class="text-xl mb-2">{{ editing ? 'Modifier' : 'Ajouter' }} une voiture</h2>
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.marque" placeholder="Marque" class="border p-2" />
          <input v-model="form.modele" placeholder="Modèle" class="border p-2" />
          <input v-model="form.immatriculation" placeholder="Immatriculation" class="border p-2" />
          <select v-model="form.typeVoitureId" class="border p-2">
            <option disabled value="">Sélectionner un type</option>
            <option v-for="type in typeVoitures" :key="type.id" :value="type.id">
              {{ type.nom }}
            </option>
          </select>
        </div>
        <button @click="saveVoiture" class="bg-blue-500 text-white p-2 mt-2">
          {{ editing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button v-if="editing" @click="cancelEdit" class="bg-gray-500 text-white p-2 mt-2 ml-2">
          Annuler
        </button>
      </div>
  
      <!-- Liste des voitures -->
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Marque</th>
            <th class="p-2">Modèle</th>
            <th class="p-2">Immatriculation</th>
            <th class="p-2">Type</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="voiture in voitures" :key="voiture.id">
            <td class="p-2">{{ voiture.marque }}</td>
            <td class="p-2">{{ voiture.modele }}</td>
            <td class="p-2">{{ voiture.immatriculation }}</td>
            <td class="p-2">{{ voiture.typeVoiture ? voiture.typeVoiture.nom : '-' }}</td>
            <td class="p-2">
              <button @click="editVoiture(voiture)" class="bg-yellow-500 text-white p-1 mr-2">Modifier</button>
              <button @click="deleteVoiture(voiture.id)" class="bg-red-500 text-white p-1">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        voitures: [],
        typeVoitures: [],
        form: {
          marque: '',
          modele: '',
          immatriculation: '',
          typeVoitureId: '',
        },
        editing: false,
        editingId: null,
      };
    },
    async created() {
      await this.fetchVoitures();
      await this.fetchTypeVoitures();
    },
    methods: {
      async fetchVoitures() {
        const response = await axios.get('http://localhost:3000/api/voitures');
        this.voitures = response.data;
      },
      async fetchTypeVoitures() {
        const response = await axios.get('http://localhost:3000/api/type-voitures');
        this.typeVoitures = response.data;
      },
      async saveVoiture() {
        try {
          if (this.editing) {
            await axios.put(`http://localhost:3000/api/voitures/${this.editingId}`, this.form);
          } else {
            await axios.post('http://localhost:3000/api/voitures', this.form);
          }
          this.resetForm();
          await this.fetchVoitures();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      async deleteVoiture(id) {
        try {
          await axios.delete(`http://localhost:3000/api/voitures/${id}`);
          await this.fetchVoitures();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      editVoiture(voiture) {
        this.editing = true;
        this.editingId = voiture.id;
        this.form = { ...voiture };
      },
      cancelEdit() {
        this.resetForm();
      },
      resetForm() {
        this.form = {
          marque: '',
          modele: '',
          immatriculation: '',
          typeVoitureId: '',
        };
        this.editing = false;
        this.editingId = null;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles Tailwind inclus dans le template */
  </style>