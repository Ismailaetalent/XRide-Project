// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const register = (data) => axios.post(`${API_URL}/auth/register`, data);
export const login = (data) => axios.post(`${API_URL}/auth/login`, data);
export const getTypeVoitures = () => axios.get(`${API_URL}/type-voitures`);