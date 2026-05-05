
import axios from 'axios';
import puterImageService from './puterImageService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// AI API - Enhanced with Puter.js client-side image generation
export const aiAPI = {
  generateProduct: (data) => api.post('/ai/product-generator', data),
  generateSEO: (data) => api.post('/ai/seo-generator', data),
  generateAds: (data) => api.post('/ai/ads-generator', data),
  generateBusinessIdeas: (data) => api.post('/ai/business-ideas', data),
  generateSocialContent: (data) => api.post('/ai/social-content', data),
  generateCompetitorAnalysis: (data) => api.post('/ai/competitor-analysis', data),
  generateMarketingCampaign: (data) => api.post('/ai/marketing-campaign', data),
  getTemplates: () => api.get('/ai/templates'),

  /**
   * Generate images - Uses Puter.js for client-side generation
   * Falls back to backend API if Puter.js is not available
   *
   * @param {Object} data - Image generation data
   * @param {string} data.prompt - Text prompt for image generation
   * @param {number} data.count - Number of images to generate
   * @param {boolean} usePuterJS - Force use of Puter.js (default: true)
   * @returns {Promise<{success: boolean, data: Array, source: string}>}
   */
  generateImages: (data, usePuterJS = true) => {
    // Use Puter.js for client-side generation (no API key needed!)
    if (usePuterJS && puterImageService.isAvailable()) {
      return puterImageService.generateImages(data.prompt, {
        count: data.count || 4,
        model: 'flux',
        width: 1024,
        height: 1024,
        enhance: true,
        safe: true
      }).then(images => ({
        success: true,
        data: images,
        source: 'puterjs'
      })).catch(error => {
        console.error('Puter.js failed, trying backend fallback:', error);
        // Fallback to backend API
        return api.post('/ai/generate-images', data);
      });
    }

    // Fallback to backend API
    return api.post('/ai/generate-images', data);
  },

  /**
   * Generate logo options - Uses Puter.js client-side
   *
   * @param {Object} data - Logo generation data
   * @param {string} data.brandName - Brand name for logo
   * @param {string} data.industry - Industry type
   * @param {boolean} usePuterJS - Force use of Puter.js (default: true)
   * @returns {Promise<{success: boolean, data: Array, source: string}>}
   */
  generateLogo: (data, usePuterJS = true) => {
    if (usePuterJS && puterImageService.isAvailable()) {
      return puterImageService.generateLogo(data.brandName, data.industry)
        .then(result => ({
          success: true,
          data: result.options,
          primary: result.primary,
          source: 'puterjs'
        }))
        .catch(error => {
          console.error('Puter.js logo failed, trying backend:', error);
          return api.post('/ai/generate-logo', data);
        });
    }
    return api.post('/ai/generate-logo', data);
  },

  getHistory: (params) => api.get('/ai/history', { params }),
  deleteHistory: (id) => api.delete(`/ai/history/${id}`),
};

// Payments API
export const paymentsAPI = {
  createStripeCheckout: (data) => api.post('/payments/stripe/create-checkout', data),
  createStripePortal: () => api.post('/payments/stripe/portal'),
  submitJazzCash: (data) => api.post('/payments/jazzcash/submit', data),
  getHistory: () => api.get('/payments/history'),
  getPricing: () => api.get('/payments/pricing'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  banUser: (id) => api.put(`/admin/users/${id}/ban`),
  changeUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  changeUserPlan: (id, data) => api.put(`/admin/users/${id}/plan`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPayments: (params) => api.get('/admin/payments', { params }),
  approvePayment: (id, data) => api.put(`/admin/payments/${id}/approve`, data),
  rejectPayment: (id, data) => api.put(`/admin/payments/${id}/reject`, data),
  getAIRequests: (params) => api.get('/admin/ai-requests', { params }),
  getAffiliates: () => api.get('/admin/affiliates'),
  getLogs: () => api.get('/admin/logs'),
  getAnalytics: () => api.get('/admin/analytics'),
};

// Affiliates API
export const affiliatesAPI = {
  getDashboard: () => api.get('/affiliates/dashboard'),
  getLeaderboard: () => api.get('/affiliates/leaderboard'),
  getStats: () => api.get('/affiliates/stats'),
};

// Puter.js Image Service (exported for direct use)
export { puterImageService };

export default api;

