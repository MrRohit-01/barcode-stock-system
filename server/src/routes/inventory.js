const { Router } = require('express');
const Product = require('../models/Product');
const InventoryMovement = require('../models/Inventory');
const { auth, authorize } = require('../middleware/auth');

const router = Router();

router.post('/movement', auth, authorize(['admin', 'staff']), async (req, res) => {
  try {
    const { productId, type, quantity, reason, reference } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (type === 'in') {
      product.stockQuantity += quantity;
    } else {
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stockQuantity -= quantity;
    }

    const movement = await InventoryMovement.create({
      product: productId,
      type,
      quantity,
      reason,
      reference,
      performedBy: req.user.userId
    });

    await product.save();
    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error recording inventory movement' });
  }
});

router.get('/movements', auth, async (req, res) => {
  try {
    const products = await InventoryMovement.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/low-stock', auth, authorize(['admin', 'staff']), async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ['$stockQuantity', '$minStockLevel']
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products' });
  }
});

module.exports = router;
