const { Router } = require('express');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { generateBarcode } = require('../utils/barcodeGenerator');
const upload = require('../middleware/upload');

const router = Router();

router.post('/', auth, authorize(['admin', 'staff']), upload.single('image'), async (req, res) => {
  try {
    const { name, sku, price, category, description, stockQuantity, minStockLevel } = req.body;
    
    // Validate required fields
    if (!name || !sku || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if product with SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const barcode = await generateBarcode(sku);
    
    // Structure the price object correctly
    const priceObject = {
      cost: price.cost,
      retail: price.retail
    };
    
    const product = await Product.create({
      name,
      sku,
      barcode,
      price: priceObject,
      category,
      description,
      stockQuantity: Number(stockQuantity) || 0,
      minStockLevel: Number(minStockLevel) || 0,
      image: req.file ? `/uploads/products/${req.file.filename}` : null
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
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

router.put('/:id', auth, authorize(['admin', 'staff']), upload.single('image'), async (req, res) => {
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

router.delete('/:id', auth, authorize(['admin', 'staff']), async (req, res) => {
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

module.exports = router;
