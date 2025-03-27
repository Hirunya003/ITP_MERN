const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true }, // Unique identifier
  supplierName: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String },
  },
  costPrice: { type: Number, required: true }, // Cost price per unit
  sellingPrice: { type: Number, required: true }, // Selling price per unit
  purchaseHistory: [{
    orderId: { type: String },
    date: { type: Date, default: Date.now },
    items: [{ itemId: String, quantity: Number }],
    totalCost: Number,
  }],
  performance: {
    deliveryTime: { type: Number, default: 0 }, // Average delivery time (days)
    qualityRating: { type: Number, default: 0 }, // 0-5 scale
    accuracy: { type: Number, default: 0 }, // Percentage of accurate orders
    totalOrders: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);