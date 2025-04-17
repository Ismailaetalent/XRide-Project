import { defineStore } from 'pinia';
import { ref } from 'vue';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const userType = ref(null);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      isAuthenticated.value = true;
      userType.value = decoded.typeUser;
    } catch (error) {
      console.error('Token invalide:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
    userType.value = null;
  };

  return {
    isAuthenticated,
    userType,
    login,
    logout,
  };
});