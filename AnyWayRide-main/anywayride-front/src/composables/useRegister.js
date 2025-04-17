import { ref } from 'vue';
import axios from 'axios';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

export function useRegister() {
  const typeVoitureOptions = ref([]);
  const loading = ref(false);
  const router = useRouter();

  const fetchTypeVoitures = async () => {
    try {
      const response = await axios.get('/type-voitures');
      typeVoitureOptions.value = response.data.map((type) => ({
        label: type.nom,
        value: type.id,
      }));
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: 'Erreur lors du chargement des types de voitures',
        position: 'top',
      });
    }
  };

  const submit = async (form) => {
    loading.value = true;
    try {
      const payload = { ...form };
      if (payload.typeUser !== 'CHAUFFEUR') {
        delete payload.permis;
        delete payload.voitures;
      }
      if (payload.typeUser !== 'ADMIN') delete payload.droits;
      if (payload.typeUser !== 'PASSAGER') delete payload.dateNaissance;

      const response = await axios.post('/signup', payload);
      localStorage.setItem('token', response.data.token);
      Notify.create({
        type: 'positive',
        message: 'Inscription réussie !',
        position: 'top',
      });
      router.push('/users');
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.error || 'Erreur lors de l\'inscription',
        position: 'top',
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    typeVoitureOptions,
    loading,
    fetchTypeVoitures,
    submit,
  };
}