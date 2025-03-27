const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');

// Add a supplier
exports.addSupplier = async (req, res) => {
  const { supplierId, supplierName, contact, costPrice, sellingPrice } = req.body;
  try {
    const supplier = new Supplier({ supplierId, supplierName, contact, costPrice, sellingPrice });
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
    const lowStockItems = await Inventory.find({ stockLevel: { $lte: '$threshold' } }).populate('supplierId');
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

// Generate purchase order (Purchase Order Generation)
exports.generatePurchaseOrder = async (req, res) => {
  const { supplierId, items } = req.body; // items: [{ itemId, quantity }]
  try {
    const supplier = await Supplier.findOne({ supplierId });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    const orderId = `PO-${Date.now()}`;
    const totalCost = items.reduce((sum, item) => sum + item.quantity * supplier.costPrice, 0);

    // Update purchase history
    supplier.purchaseHistory.push({ orderId, items, totalCost });
    await supplier.save();

    // Send email to supplier (optional)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: supplier.contact.email,
      subject: `Purchase Order ${orderId}`,
      text: `Order Details: ${JSON.stringify(items)}\nTotal Cost: ${totalCost}`,
    });

    res.json({ message: 'Purchase order generated', orderId });
  } catch (error) {
    res.status(500).json({ message: 'Error generating order', error });
  }
};

// Supplier performance monitoring
exports.getSupplierPerformance = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier.performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance', error });
  }
};