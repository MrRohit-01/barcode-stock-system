import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';

const API_URL = 'https://qhkg9hgc-5000.inc1.devtunnels.ms/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update token getter to use Zustand
const getToken = () => useAuthStore.getState().token;

// Update interceptor to use Zustand token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout(); // Clear auth state on 401
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Product Service
export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response;
  },
  
  getByBarcode: async (barcode) => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
  },
  
  create: async (data) => {
    const response = await api.post('/products', data);
    return response;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response;
  },
  
  checkSKU: async (sku) => {
    const response = await api.get(`/products/check-sku/${sku}`);
    return response;
  }
};

// Billing Service
export const billingService = {
  createTransaction: async (transactionData) => {
    const response = await api.post('/billing/transaction', transactionData);
    return response;
  },

  getAllTransactions: async () => {
    const response = await api.get('/billing/transactions');
    return response;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/billing/transaction/${id}`);
    return response;
  }
};

// Auth Service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data?.token) {
        useAuthStore.getState().setToken(response.data.token);
        useAuthStore.getState().setUser(response.data.user);
      }
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data?.token) {
        useAuthStore.getState().setToken(response.data.token);
        useAuthStore.getState().setUser(response.data.user);
      }
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    useAuthStore.getState().logout();
  }
};

// Inventory Service
export const inventoryService = {
  addMovement: async (movementData) => {
    const response = await api.post('/inventory/movement', movementData);
    return response;
  },
  
  getMovements: async () => {
    const response = await api.get('/inventory/movements');
    return response;
  },
  
  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response;
  }
};

export default api; 