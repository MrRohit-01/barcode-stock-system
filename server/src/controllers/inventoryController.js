const InventoryMovement = require('../models/Inventory');
const Product = require('../models/Product');

exports.addInventoryMovement = async (req, res) => {
  try {
    const { productId, type, quantity, reason, reference } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product stock
    if (type === 'in') {
      product.stockQuantity += quantity;
    } else {
      if (product.stockQuantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stockQuantity -= quantity;
    }

    // Create inventory movement record
    const movement = new InventoryMovement({
      product: productId,
      type,
      quantity,
      reason,
      reference,
      performedBy: req.user.userId
    });

    await Promise.all([
      movement.save(),
      product.save()
    ]);

    res.status(201).json(movement);
  } catch (error) {
    res.status(500).json({ message: 'Error recording inventory movement' });
  }
};

exports.getInventoryMovements = async (req, res) => {
  try {
    const movements = await InventoryMovement.find()
      .populate('product', 'name sku')
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory movements' });
  }
};

exports.getLowStockProducts = async (req, res) => {
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
}; 