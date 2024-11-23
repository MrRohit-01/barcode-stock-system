const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  stockQuantity: {
    type: Number,
    default: 0,
  },
  minStockLevel: {
    type: Number,
    default: 10,
  },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 