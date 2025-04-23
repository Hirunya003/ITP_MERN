const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController'); // ✅ use controller functions
const Supplier = require('../models/Supplier');


// 1. Get all suppliers
router.get('/suppliers', supplierController.getSuppliers);

// 2. Check restock alerts
router.get('/restock-alerts', supplierController.checkRestockAlerts);

// 3. Generate purchase order
router.post('/generate-order', supplierController.generatePurchaseOrder);

router.get('/suppliers/:id', supplierController.getSupplierById);

// 4. Get supplier performance
router.get('/supplier-performance/:id', supplierController.getSupplierPerformance);

// 5. Add a new supplier
router.post('/suppliers', supplierController.addSupplier);

// 6. Delete a supplier
router.delete('/suppliers/:supplierId', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findOneAndDelete({ supplierId: req.params.supplierId });
    if (!deletedSupplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully', deletedSupplier });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Update a supplier
router.put('/suppliers/:supplierId', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findOneAndUpdate(
      { supplierId: req.params.supplierId },
      req.body,
      { new: true }
    );
    if (!updatedSupplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get supplier orders
router.get('/supplier-orders/:id', supplierController.getSupplierOrders);

// Update supplier performance
router.post('/update-supplier-performance', supplierController.updateSupplierPerformance);

module.exports = router;

