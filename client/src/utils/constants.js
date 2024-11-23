export const SCANNER_CONFIG = {
  SUPPORTED_FORMATS: [
    'EAN-13',
    'EAN-8',
    'UPC-A',
    'UPC-E',
    'Code-128',
    'Code-39',
    'QR'
  ],
  SCAN_TIMEOUT: 5000,
};

export const MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  PRODUCTS: {
    BASE: '/products',
    BARCODE: (code) => `/products/barcode/${code}`,
    DETAIL: (id) => `/products/${id}`
  },
  INVENTORY: {
    MOVEMENTS: '/inventory/movements',
    LOW_STOCK: '/inventory/low-stock'
  },
  BILLING: {
    TRANSACTIONS: '/billing/transactions',
    CREATE: '/billing/transaction'
  }
};

export const TABLE_HEADERS = {
  INVENTORY_MOVEMENTS: [
    { key: 'date', label: 'Date' },
    { key: 'product', label: 'Product' },
    { key: 'type', label: 'Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'notes', label: 'Notes' }
  ]
};
