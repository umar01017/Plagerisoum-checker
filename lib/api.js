import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090/api',
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const loginAPI = (email, password) => api.post('/auth/login', { email, password });
export const registerAPI = (name, email, password) => api.post('/auth/register', { name, email, password });

export const rewriteTextAPI = (text, mode) => api.post('/rewrite/', { text, mode });
export const detectPlagiarismAPI = (text) => api.post('/rewrite/detect', { text });
export const getHistoryAPI = () => api.get('/rewrite/history');

export const uploadDocumentAPI = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
