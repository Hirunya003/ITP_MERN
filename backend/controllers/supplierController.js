const { body, validationResult } = require('express-validator');
const Supplier = require('../models/Supplier');
const Inventory = require('../models/Inventory');
const nodemailer = require('nodemailer');

const validateSupplier = [
  body('supplierName').trim().notEmpty().withMessage('Supplier name is required'),
  body('contact.email').isEmail().withMessage('Valid email is required'),
  body('contact.phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  body('sellingPrice')
    .isFloat({ min: 0 }).withMessage('Selling price must be a positive number')
    .custom((value, { req }) => {
      if (value <= req.body.costPrice) {
        throw new Error('Selling price must be greater than cost price');
      }
      return true;
    })
];

exports.addSupplier = [
  ...validateSupplier,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { supplierId, supplierName, contact, productName, costPrice, sellingPrice } = req.body;
    try {
      const supplier = new Supplier({ 
        supplierId: supplierId || `SUP-${Date.now()}`, 
        supplierName, 
        contact, 
        productName, 
        costPrice, 
        sellingPrice 
      });
      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: 'Error adding supplier', error: error.message });
    }
  }
];

// Update supplier validation
exports.updateSupplier = [
  ...validateSupplier,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { supplierName, contact, productName, costPrice, sellingPrice } = req.body;
    try {
      const updatedSupplier = await Supplier.findOneAndUpdate(
        { supplierId: req.params.supplierId },
        { supplierName, contact, productName, costPrice, sellingPrice },
        { new: true }
      );
      if (!updatedSupplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
      res.json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
  }
];

// In supplierRoutes.js
router.post('/suppliers', supplierController.addSupplier);
router.put('/suppliers/:supplierId', supplierController.updateSupplier);