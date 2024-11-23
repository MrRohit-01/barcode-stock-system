const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [transactionItemSchema],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    required: true
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'refunded'],
    default: 'completed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 