const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  stockLevel: { type: Number, required: true },
  threshold: { type: Number, required: true }, // Low-stock threshold
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }, // Link to Supplier
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);

const cron = require('node-cron');
cron.schedule('0 * * * *', () => supplierController.checkRestockAlerts({}));