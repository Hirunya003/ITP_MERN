const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');

// 1. Supplier Database Management - Get all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 2. Automated Restocking Alerts - Check low stock and notify
router.get('/restock-alerts', async (req, res) => {
    try {
      const lowStockItems = await Inventory.find({ stockLevel: { $lte: '$threshold' } })
        .populate('supplierId', 'supplierName contact');
      res.json(lowStockItems);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // 3. Purchase Order Generation - Create and send order
router.post('/generate-order', async (req, res) => {
    const { supplierId, items } = req.body;
    try {
      const supplier = await Supplier.findOne({ supplierId });
      const order = {
        orderId: `PO-${Date.now()}`, // Simple unique ID
        date: new Date(),
        items,
        totalCost: items.reduce((sum, item) => sum + item.quantity * supplier.costPrice, 0)
      };
      supplier.purchaseHistory.push(order);
      await supplier.save();
      res.json({ message: 'Purchase order generated', order });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // 4. Supplier Performance Monitoring - Get performance report
router.get('/supplier-performance/:supplierId', async (req, res) => {
    try {
      const supplier = await Supplier.findOne({ supplierId: req.params.supplierId });
      res.json(supplier.performance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// 5. Add a new supplier
router.post('/suppliers', async (req, res) => {
  const { supplierName, contact, costPrice, sellingPrice } = req.body;

  // Generate a unique supplierId (you can customize this logic as needed)
  const supplierId = `SUP-${Date.now()}`; // Example: Unique ID based on timestamp

  try {
    const newSupplier = new Supplier({
      supplierId,
      supplierName,
      contact: {
        email: contact.email, // Assuming contact is an object with email and phone
        phone: contact.phone,
      },
      costPrice,
      sellingPrice,
      purchaseHistory: [], // Initialize with an empty purchase history
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier); // Respond with the created supplier
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  module.exports = router;
