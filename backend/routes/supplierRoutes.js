const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.post('/add', supplierController.addSupplier); // Add supplier
router.get('/', supplierController.getSuppliers); // Get all suppliers
router.get('/performance/:id', supplierController.getSupplierPerformance); // Supplier performance
router.post('/order', supplierController.generatePurchaseOrder); // Generate purchase order
router.get('/check-restock', supplierController.checkRestockAlerts); // Check restock alerts

module.exports = router;