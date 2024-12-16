import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../stores/authStore';

// Update API URL to use environment variable
const API_URL = import.meta.env.VITE_API_URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update token getter to use Zustand
const getToken = () => useAuthStore.getState().token;

// Improve token handling
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Improve error handling in response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
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
    try {
      console.log('Fetching product by barcode:', barcode, 'from URL:', API_URL);
      const response = await api.get(`/products/barcode/${barcode}`);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Barcode API error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else if (error.response?.status === 404) {
        return { status: 404, data: null };
      } else {
        toast.error('Error checking barcode: ' + (error.response?.data?.message || error.message));
      }
      throw error;
    }
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
  },
  
  create: async (data) => {
    try {
      const response = await api.post('/products', data);
      return response;
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
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
    // try {
    //   const response = await api.get(`/api/products/sku/${sku}`);
    //   return response;
    // } catch (error) {
    //   if (error.response?.status === 404) {
    //     return { status: 404 };
    //   }
    //   throw error;
    // }
  }
};

// Billing Service
export const billingService = {
  createTransaction: async (transactionData) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await api.post('/billing/transaction', transactionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Billing service error:', error);
      throw error;
    }
  },

  getAllTransactions: async () => {
    const response = await api.get('/billing/transactions');
    return response;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/billing/transaction/${id}`);
    return response;
  },

  getDashboardStats: () => axios.get(`${API_URL}/billing/dashboard-stats`),
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