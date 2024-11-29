import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'https://qhkg9hgc-5000.inc1.devtunnels.ms/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests without causing re-renders
const getToken = () => localStorage.getItem('token');

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

// Product Service
export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response;
  },
  
  getByBarcode: async (barcode) => {
    
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/api/products/barcode/${barcode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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
    return await api.get(`/products/check-sku/${sku}`);
  }
};

// Billing Service
export const billingService = {
  createTransaction: async (transactionData) => {
    const response = await api.post('/billing/transaction', transactionData);
    return response;
  },

  getTransactions: async () => {
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
    const response = await api.post('/auth/login', credentials);
    return response;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
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