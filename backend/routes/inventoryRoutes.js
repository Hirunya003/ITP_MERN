import express from 'express';
import Product from '../models/productModel.js';
import StockHistory from '../models/stockHistoryModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();



// @desc    Get all products
// @route   GET /api/inventory/products
// @access  Public
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get low stock products
// @route   GET /api/inventory/low-stock
// @access  Private
router.get('/low-stock', protect, async (req, res) => {
  try {
    const products = await Product.find({});
    const lowStockProducts = products.filter(product => product.currentStock <= product.minStock);
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get a product by ID
// @route   GET /api/inventory/products/:id
// @access  Private
router.get('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a product
// @route   POST /api/inventory/products
// @access  Private
router.post('/products', protect, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      currentStock,
      minStock,
      unit,
      barcode,
      image,
      expiryDate
    } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      currentStock: currentStock || 0,
      minStock: minStock || 5,
      unit: unit || 'item',
      barcode,
      image,
      expiryDate: expiryDate || null
    });

    // Create stock history record for initial stock
    if (currentStock && currentStock > 0) {
      await StockHistory.create({
        product: product._id,
        changeType: 'add',
        quantity: currentStock,
        previousStock: 0,
        newStock: currentStock,
        notes: 'Initial inventory',
        performedBy: req.user._id
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a product
// @route   PUT /api/inventory/products/:id
// @access  Private
router.put('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      category,
      description,
      price,
      minStock,
      unit,
      barcode,
      image,
      expiryDate,
      isActive
    } = req.body;

    // Update basic product information
    if (name) product.name = name;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (minStock !== undefined) product.minStock = minStock;
    if (unit) product.unit = unit;
    if (barcode !== undefined) product.barcode = barcode;
    if (image) product.image = image;
    if (expiryDate !== undefined) product.expiryDate = expiryDate;
    if (isActive !== undefined) product.isActive = isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/inventory/products/:id
// @access  Private
router.delete('/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await StockHistory.deleteMany({ product: req.params.id });
    await product.deleteOne();

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update stock quantity
// @route   PUT /api/inventory/products/:id/stock
// @access  Private
router.put('/products/:id/stock', protect, async (req, res) => {
  try {
    const { quantity, changeType, notes } = req.body;
    
    if (!quantity || !changeType) {
      return res.status(400).json({ message: 'Quantity and change type are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.currentStock;
    let newStock = previousStock;

    // Calculate new stock based on change type
    if (changeType === 'add') {
      newStock = previousStock + Number(quantity);
    } else if (changeType === 'remove') {
      newStock = Math.max(0, previousStock - Number(quantity));
    } else if (changeType === 'adjust') {
      newStock = Number(quantity);
    }

    // Update product stock
    product.currentStock = newStock;
    await product.save();

    // Record stock history
    await StockHistory.create({
      product: product._id,
      changeType,
      quantity: Math.abs(Number(quantity)),
      previousStock,
      newStock,
      notes,
      performedBy: req.user._id
    });

    res.json({
      product,
      stockChange: {
        previousStock,
        newStock,
        difference: newStock - previousStock
      }
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get stock history for a product
// @route   GET /api/inventory/products/:id/history
// @access  Private
router.get('/products/:id/history', protect, async (req, res) => {
  try {
    const history = await StockHistory.find({ product: req.params.id })
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching stock history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all stock history
// @route   GET /api/inventory/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await StockHistory.find({})
      .populate('product', 'name category')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching stock history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
