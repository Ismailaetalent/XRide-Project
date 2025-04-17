<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Types de Voitures</h1>
  
      <!-- Formulaire pour ajouter/modifier un type -->
      <div class="mb-4">
        <h2 class="text-xl mb-2">{{ editing ? 'Modifier' : 'Ajouter' }} un type</h2>
        <input v-model="form.nom" placeholder="Nom du type" class="border p-2 w-full mb-2" />
        <input v-model="form.description" placeholder="Description" class="border p-2 w-full mb-2" />
        <button @click="saveTypeVoiture" class="bg-blue-500 text-white p-2">
          {{ editing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button v-if="editing" @click="cancelEdit" class="bg-gray-500 text-white p-2 ml-2">
          Annuler
        </button>
      </div>
  
      <!-- Liste des types -->
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Nom</th>
            <th class="p-2">Description</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in typeVoitures" :key="type.id">
            <td class="p-2">{{ type.nom }}</td>
            <td class="p-2">{{ type.description }}</td>
            <td class="p-2">
              <button @click="editTypeVoiture(type)" class="bg-yellow-500 text-white p-1 mr-2">Modifier</button>
              <button @click="deleteTypeVoiture(type.id)" class="bg-red-500 text-white p-1">Supprimer</button>
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
        typeVoitures: [],
        form: {
          nom: '',
          description: '',
        },
        editing: false,
        editingId: null,
      };
    },
    async created() {
      await this.fetchTypeVoitures();
    },
    methods: {
      async fetchTypeVoitures() {
        const response = await axios.get('http://localhost:3000/api/type-voitures');
        this.typeVoitures = response.data;
      },
      async saveTypeVoiture() {
        try {
          if (this.editing) {
            await axios.put(`http://localhost:3000/api/type-voitures/${this.editingId}`, this.form);
          } else {
            await axios.post('http://localhost:3000/api/type-voitures', this.form);
          }
          this.resetForm();
          await this.fetchTypeVoitures();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      async deleteTypeVoiture(id) {
        try {
          await axios.delete(`http://localhost:3000/api/type-voitures/${id}`);
          await this.fetchTypeVoitures();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      editTypeVoiture(type) {
        this.editing = true;
        this.editingId = type.id;
        this.form = { ...type };
      },
      cancelEdit() {
        this.resetForm();
      },
      resetForm() {
        this.form = {
          nom: '',
          description: '',
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