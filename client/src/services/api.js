import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  create: async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  getByBarcode: async (barcode) => {
    try {
      const response = await api.get(`/api/products/barcode/${barcode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  checkSKU: async (sku) => {
    try {
      const response = await api.get(`/api/products/sku/${sku}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 