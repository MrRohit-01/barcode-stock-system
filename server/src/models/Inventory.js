const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    enum: ['purchase', 'sale', 'return', 'adjustment'],
    required: true,
  },
  reference: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema); 