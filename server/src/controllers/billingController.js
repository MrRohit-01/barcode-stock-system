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
    const { items, paymentMethod } = req.body;
    const transactionId = generateTransactionId();

    // Calculate total and validate stock
    let total = 0;
    const inventoryUpdates = [];
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      total += product.price * item.quantity;
      
      inventoryUpdates.push({
        product: product._id,
        type: 'out',
        quantity: item.quantity,
        reason: 'sale',
        reference: transactionId,
        performedBy: req.user.userId
      });

      product.stockQuantity -= item.quantity;
      await product.save({ session });

      validatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const transaction = await Transaction.create([{
      transactionId,
      items: validatedItems,
      total,
      paymentMethod,
      cashier: req.user.userId
    }], { session });

    await InventoryMovement.insertMany(inventoryUpdates, { session });

    await session.commitTransaction();
    res.status(201).json(transaction[0]);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
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