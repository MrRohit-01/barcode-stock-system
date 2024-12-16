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
  billingController.getTransactions || ((req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  })
);

router.get('/transaction/:id', 
  auth, 
  billingController.getTransactionById || ((req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  })
);

router.get('/transactions/daily',
  auth,
  billingController.getDailyTransactions || ((req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  })
);

router.get('/transactions/summary',
  auth,
  authorize('admin'),
  billingController.getTransactionsSummary || ((req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  })
);

router.post('/transaction/:id/void',
  auth,
  authorize('admin'),
  billingController.voidTransaction || ((req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
  })
);

module.exports = router; 