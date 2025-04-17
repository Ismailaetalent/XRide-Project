<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>
  
      <!-- Formulaire pour ajouter/modifier un utilisateur -->
      <div class="mb-4">
        <h2 class="text-xl mb-2">{{ editing ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.email" placeholder="Email" class="border p-2" />
          <input v-model="form.nom" placeholder="Nom" class="border p-2" />
          <input v-model="form.motDePasse" type="password" placeholder="Mot de passe" class="border p-2" />
          <select v-model="form.typeUser" @change="resetSpecificFields" class="border p-2">
            <option disabled value="">Sélectionner un type</option>
            <option value="CHAUFFEUR">Chauffeur</option>
            <option value="ADMIN">Admin</option>
            <option value="PASSAGER">Passager</option>
          </select>
          <!-- Champs spécifiques -->
          <input v-if="form.typeUser === 'CHAUFFEUR'" v-model="form.permis" placeholder="Numéro de permis" class="border p-2" />
          <input v-if="form.typeUser === 'ADMIN'" v-model="form.droits.canModerate" type="checkbox" class="mr-2" />
          <label v-if="form.typeUser === 'ADMIN'">Peut modérer</label>
          <input v-if="form.typeUser === 'PASSAGER'" v-model="form.dateNaissance" type="date" class="border p-2" />
        </div>
        <button @click="saveUser" class="bg-blue-500 text-white p-2 mt-2">
          {{ editing ? 'Mettre à jour' : 'Ajouter' }}
        </button>
        <button v-if="editing" @click="cancelEdit" class="bg-gray-500 text-white p-2 mt-2 ml-2">
          Annuler
        </button>
      </div>
  
      <!-- Liste des utilisateurs -->
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Email</th>
            <th class="p-2">Nom</th>
            <th class="p-2">Type</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">{{ user.nom }}</td>
            <td class="p-2">{{ user.typeUser }}</td>
            <td class="p-2">
              <button @click="editUser(user)" class="bg-yellow-500 text-white p-1 mr-2">Modifier</button>
              <button @click="deleteUser(user.id)" class="bg-red-500 text-white p-1">Supprimer</button>
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
        users: [],
        form: {
          email: '',
          nom: '',
          motDePasse: '',
          typeUser: '',
          permis: '',
          droits: { canModerate: false },
          dateNaissance: '',
        },
        editing: false,
        editingId: null,
      };
    },
    async created() {
      await this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        const response = await axios.get('http://localhost:3000/api/users');
        this.users = response.data;
      },
      async saveUser() {
        try {
          const payload = { ...this.form };
          // Nettoyer les champs inutiles selon le type
          if (payload.typeUser !== 'CHAUFFEUR') delete payload.permis;
          if (payload.typeUser !== 'ADMIN') delete payload.droits;
          if (payload.typeUser !== 'PASSAGER') delete payload.dateNaissance;
  
          if (this.editing) {
            await axios.put(`http://localhost:3000/api/users/${this.editingId}`, payload);
          } else {
            await axios.post('http://localhost:3000/api/users', payload);
          }
          this.resetForm();
          await this.fetchUsers();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      async deleteUser(id) {
        try {
          await axios.delete(`http://localhost:3000/api/users/${id}`);
          await this.fetchUsers();
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      editUser(user) {
        this.editing = true;
        this.editingId = user.id;
        this.form = { ...user, droits: user.droits || { canModerate: false } };
      },
      cancelEdit() {
        this.resetForm();
      },
      resetForm() {
        this.form = {
          email: '',
          nom: '',
          motDePasse: '',
          typeUser: '',
          permis: '',
          droits: { canModerate: false },
          dateNaissance: '',
        };
        this.editing = false;
        this.editingId = null;
      },
      resetSpecificFields() {
        this.form.permis = '';
        this.form.droits = { canModerate: false };
        this.form.dateNaissance = '';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles Tailwind inclus dans le template */
  </style>