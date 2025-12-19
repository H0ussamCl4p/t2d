import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // send cookies if you rely on session cookies
});

// Add Authorization header interceptor
api.interceptors.request.use((config) => {
  const token = typeof document !== 'undefined' ? 
    (document.cookie.match(/auth_token=([^;]+)/)?.[1] || localStorage.getItem('auth_token')) : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { api };
