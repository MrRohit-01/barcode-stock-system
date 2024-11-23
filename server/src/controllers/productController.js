const Product = require('../models/Product');
const { generateBarcode } = require('../utils/barcodeGenerator');

exports.createProduct = async (req, res) => {
  try {
    const { name, sku, price, category, description, stockQuantity, minStockLevel } = req.body;
    
    const barcode = await generateBarcode(sku);
    
    const product = new Product({
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

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
}; 