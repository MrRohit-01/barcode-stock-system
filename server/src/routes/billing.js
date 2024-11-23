const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { auth, authorize } = require('../middleware/auth');

// Billing routes
router.post('/transaction', 
  auth, 
  authorize('admin', 'cashier'), 
  billingController.createTransaction
);

router.get('/transactions', 
  auth, 
  billingController.getTransactions
);

router.get('/transaction/:id', 
  auth, 
  billingController.getTransactionById
);

module.exports = router; 