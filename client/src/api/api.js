// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://job-pilot-ai.onrender.com/api', // ✅ Use deployed backend + `/api`
  withCredentials: true,
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
