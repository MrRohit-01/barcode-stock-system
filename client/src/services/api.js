import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

// Auth Service
const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

// Product Service
const productService = {
  async getAllProducts() {
    const response = await api.get('/products');
    return response.data;
  },
  
  async getProductByBarcode(barcode) {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },
  
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  async create(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw error;
    }
  },
  
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Inventory Service
const inventoryService = {
  async addMovement(movementData) {
    const response = await api.post('/inventory/movement', movementData);
    return response.data;
  },
  
  async getMovements() {
    const response = await api.get('/inventory/movements');
    return response.data;
  },
  
  async getLowStock() {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  }
};

// Billing Service
const billingService = {
  async createTransaction(transactionData) {
    const response = await api.post('/billing/transaction', transactionData);
    return response.data;
  },
  
  async getAllTransactions() {
    const response = await api.get('/billing/transactions');
    return response.data;
  },
  
  async getTransactionById(id) {
    const response = await api.get(`/billing/transaction/${id}`);
    return response.data;
  }
};

export {
  authService,
  productService,
  inventoryService,
  billingService
};

export default api; 