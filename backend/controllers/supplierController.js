const { body, validationResult } = require('express-validator');
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');

// Add a supplier
exports.addSupplier = async (req, res) => {
  const {
    supplierId,
    supplierName,
    contact,
    productName,
    costPrice,
    sellingPrice,
    performance,
  } = req.body;

  // Supplier ID validation: only letters and numbers allowed
  const supplierIdPattern = /^[A-Za-z0-9]+$/;

  // Phone validation: exactly 10 digits
  const phonePattern = /^\d{10}$/;

  // Validate Supplier ID (no symbols)
  if (!supplierIdPattern.test(supplierId)) {
    return res.status(400).json({ message: 'Invalid Supplier ID. Only letters and numbers are allowed.' });
  }

  // Validate phone number
  if (!phonePattern.test(contact.phone)) {
    return res.status(400).json({ message: 'Invalid phone number. Must be exactly 10 digits and contain no letters.' });
  }

  try {
    const supplier = new Supplier({
      supplierId,
      supplierName,
      contact,
      productName,
      costPrice,
      sellingPrice,
      performance,
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error adding supplier', error });
  }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};

// Check restock alerts (Automated Restocking Alerts)
exports.checkRestockAlerts = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({ $expr: { $lte: ['$stockLevel', '$threshold'] } }).populate('supplierId');
    if (lowStockItems.length > 0) {
      // Trigger alert (e.g., log or notify manager)
      console.log('Low stock alert:', lowStockItems);
      res.json({ message: 'Low stock detected', items: lowStockItems });
    } else {
      res.json({ message: 'No low stock items' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking restock', error });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier', error });
  }
};

// Generate purchase order (Purchase Order Generation)
exports.generatePurchaseOrder = async (req, res) => {
  const { supplierId, items } = req.body;
  try {
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const orderId = `PO-${Date.now()}`;

    // Validate that all items match supplier products
    const invalidItems = items.filter(item =>
      item.name.trim().toLowerCase() !== supplier.productName.trim().toLowerCase()
    );
    if (invalidItems.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid product names in order', 
        invalidItems 
      });
    }

    // Calculate total cost (sum of all matching items)
    let totalCost = 0;
    items.forEach(item => {
      if (item.name === supplier.productName) {
        totalCost += item.quantity * supplier.costPrice;
      }
    });

    // Push order to purchase history
    supplier.purchaseHistory.push({
      orderId,
      items,
      totalCost,
      date: new Date()
    });
    await supplier.save();

    // Optional: send email to supplier
    const transporter = require('nodemailer').createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: supplier.contact.email,
      subject: `Purchase Order ${orderId}`,
      text: `Order Details: ${JSON.stringify(items)}\nTotal Cost: ${totalCost}`
    });

    res.status(200).json({ message: 'Purchase order generated successfully', orderId });
  } catch (error) {
    console.error('Order generation error:', error);
    res.status(500).json({ message: 'Error generating order', error: error.message });
  }
};

// Supplier performance monitoring
exports.getSupplierPerformance = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier.performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance', error });
  }
};

// Get supplier orders
exports.getSupplierOrders = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ supplierId: req.params.id });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    
    res.json(supplier.purchaseHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Update supplier performance based on a new order
exports.updateSupplierPerformance = async (req, res) => {
  try {
    const { supplierId, orderId, deliveryTime, qualityRating, isAccurate } = req.body;
    
    if (!supplierId || !orderId) {
      return res.status(400).json({ message: 'Supplier ID and Order ID are required' });
    }

    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    
    // Verify the order exists
    const orderExists = supplier.purchaseHistory.some(order => order.orderId === orderId);
    if (!orderExists) {
      return res.status(404).json({ message: 'Order not found for this supplier' });
    }
    
    // Update performance metrics
    const performance = supplier.performance || { 
      deliveryTime: 0, 
      qualityRating: 0, 
      accuracy: 0, 
      totalOrders: 0 
    };
    
    // Calculate new values
    if (deliveryTime !== undefined) {
      // Calculate new average delivery time
      const totalDeliveryTime = performance.deliveryTime * performance.totalOrders + parseFloat(deliveryTime);
      const newTotalOrders = performance.totalOrders + 1;
      performance.deliveryTime = totalDeliveryTime / newTotalOrders;
    }
    
    if (qualityRating !== undefined) {
      // Calculate new average quality rating
      const totalQualityRating = performance.qualityRating * performance.totalOrders + parseFloat(qualityRating);
      const newTotalOrders = performance.totalOrders + 1;
      performance.qualityRating = totalQualityRating / newTotalOrders;
    }
    
    if (isAccurate !== undefined) {
      // Update accuracy percentage
      const accurateOrders = (performance.accuracy * performance.totalOrders) / 100;
      const newAccurateOrders = isAccurate ? accurateOrders + 1 : accurateOrders;
      const newTotalOrders = performance.totalOrders + 1;
      performance.accuracy = (newAccurateOrders / newTotalOrders) * 100;
    }
    
    // Increment total orders only once per update, regardless of which metrics were updated
    const metricsUpdated = deliveryTime !== undefined || qualityRating !== undefined || isAccurate !== undefined;
    if (metricsUpdated) {
      performance.totalOrders += 1;
    }
    
    // Update supplier performance
    supplier.performance = performance;
    await supplier.save();
    
    res.json({ message: 'Performance updated successfully', performance: supplier.performance });
  } catch (error) {
    console.error('Performance update error:', error);
    res.status(500).json({ message: 'Error updating performance', error: error.message });
  }
};