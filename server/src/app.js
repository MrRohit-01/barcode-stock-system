const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');
const billingRoutes = require('./routes/billing');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));
app.use(express.json());

// Add this before your routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend is up and running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/billing', billingRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;