import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // send cookies if you rely on session cookies
});

export default api;
export { api };
