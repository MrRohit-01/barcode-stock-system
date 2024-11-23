import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  getProduct: async (barcode) => {
    try {
      const response = await api.get(`/products/${barcode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Product not found');
    }
  },
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
};

export const inventoryAPI = {
  addMovement: (movementData) => api.post('/inventory/movement', movementData),
  getMovements: () => api.get('/inventory/movements'),
  getLowStock: () => api.get('/inventory/low-stock'),
};

export const billingAPI = {
  createTransaction: (transactionData) => api.post('/billing/transaction', transactionData),
  getAllTransactions: () => api.get('/billing/transactions'),
  getTransactionById: (transactionId) => api.get(`/billing/transaction/${transactionId}`),
};

export default api; 