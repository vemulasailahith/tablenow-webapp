import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
