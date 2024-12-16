const { Router } = require('express');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { generateBarcode } = require('../utils/barcodeGenerator');
const upload = require('../middleware/upload');

const router = Router();

router.post('/', auth, async (req, res) => {
  try {
    const {
      name, 
      sku, 
      barcode, 
      price, 
      category, 
      description, 
      stockQuantity, 
      minStockLevel
    } = req.body;
    
    console.log('Received data:', req.body);
    console.log('User attempting creation:', req.user);
    
    // Validate required fields including barcode
    if (!name || !sku || !price || !category || !barcode) {
      return res.status(400).json({ message: 'Missing required fields (including barcode)' });
    }

    // Check if product with barcode already exists
    const existingBarcode = await Product.findOne({ barcode });
    if (existingBarcode) {
      return res.status(400).json({ message: 'Product with this barcode already exists' });
    }
    
    const product = await Product.create({
      name,
      sku,
      barcode,
      price: {
        cost: price.cost,
        retail: price.retail
      },
      category,
      description,
      stockQuantity: Number(stockQuantity) || 0,
      minStockLevel: Number(minStockLevel) || 0,
      image: req.file ? `/uploads/products/${req.file.filename}` : null
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/barcode/:barcode', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

router.get('/check-sku/:sku', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku });
    if (!product) {
      return res.status(404).json({ message: 'SKU not found' });
    }
    res.json({ exists: true });
  } catch (error) {
    res.status(500).json({ message: 'Error checking SKU' });
  }
});

module.exports = router;
