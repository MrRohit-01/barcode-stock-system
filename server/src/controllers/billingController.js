const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const InventoryMovement = require('../models/Inventory');

const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
};

const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, customerInfo, paymentMethod, total, subtotal, tax } = req.body;

    // Debug logs
    console.log('User from request:', req.user);
    console.log('Request body:', req.body);

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Cashier information missing' });
    }

    // Create transaction with explicit cashier ID
    const transaction = new Transaction({
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        sku: item.sku
      })),
      total,
      subtotal,
      tax,
      paymentMethod,
      customer: customerInfo,
      cashier: req.user._id // Explicitly set the cashier
    });

    await transaction.save({ session });

    // Update product stock quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();

    // Populate the transaction with product details
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('cashier', 'username')
      .populate('items.product');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction creation error:', error);
    res.status(500).json({ 
      message: 'Error creating transaction',
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('items.product', 'name sku price')
      .populate('cashier', 'username')
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.id })
      .populate('items.product', 'name sku price')
      .populate('cashier', 'username');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionById };