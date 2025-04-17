// src/store/index.js
import { createStore } from 'vuex';
import { jwtDecode } from 'jwt-decode'; // Utilisation de l'exportation nommée

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      if (token) {
        try {
          const decoded = jwtDecode(token);
          state.user = { role: decoded.role, id: decoded.id };
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          state.user = null;
        }
      }
    },
    clearToken(state) {
      state.token = '';
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },
});