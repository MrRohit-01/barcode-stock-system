const { Router } = require('express');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { generateBarcode } = require('../utils/barcodeGenerator');

const router = Router();

router.post('/', auth, authorize(['admin', 'staff']), async (req, res) => {
  try {
    const { name, sku, price, category, description, stockQuantity, minStockLevel } = req.body;
    
    const barcode = await generateBarcode(sku);
    
    const product = await Product.create({
      name,
      sku,
      barcode,
      price,
      category,
      description,
      stockQuantity,
      minStockLevel,
      image: req.file?.path
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
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

router.put('/:id', auth, authorize(['admin', 'staff']), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
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

module.exports = router;
