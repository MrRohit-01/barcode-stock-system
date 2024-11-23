const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
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
  category: String,
  brand: String,
  manufacturer: String,
  price: {
    cost: {
      type: Number,
      required: true,
    },
    retail: {
      type: Number,
      required: true,
    },
    wholesale: Number
  },
  stock: {
    quantity: {
      type: Number,
      default: 0,
    },
    minQuantity: Number,
    maxQuantity: Number,
    location: String
  },
  specifications: {
    weight: String,
    dimensions: String,
    color: String,
    size: String
  },
  supplier: {
    name: String,
    contact: String,
    code: String
  },
  status: {
    type: String,
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema); 