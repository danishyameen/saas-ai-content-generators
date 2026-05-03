import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change to your production URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await import('expo-secure-store').then((m) => m.SecureStore.getItemAsync('token'));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const aiAPI = {
  generateProduct: (data) => api.post('/ai/product-generator', data),
  generateSEO: (data) => api.post('/ai/seo-generator', data),
  generateAds: (data) => api.post('/ai/ads-generator', data),
  generateBusinessIdeas: (data) => api.post('/ai/business-ideas', data),
  generateSocialContent: (data) => api.post('/ai/social-content', data),
  generateCompetitorAnalysis: (data) => api.post('/ai/competitor-analysis', data),
};

export const paymentsAPI = {
  getPricing: () => api.get('/payments/pricing'),
};

export default api;
