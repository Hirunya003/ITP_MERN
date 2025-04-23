const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');

// Insert inventory data via POST body
exports.insertInventory = async (req, res) => {
  const { itemId, name, stockLevel, threshold, supplierId } = req.body;

  try {
    // Find supplier by supplierId string (e.g., SUP1002)
    const supplier = await Supplier.findOne({ supplierId });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const newInventory = new Inventory({
      itemId,
      name,
      stockLevel,
      threshold,
      supplierId: supplier._id // Use ObjectId reference
    });

    await newInventory.save();

    res.status(201).json({ message: 'Inventory item added', inventory: newInventory });
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory', error });
  }
};

// Get all inventory
exports.getInventory = async (req, res) => {
    try {
      const inventory = await Inventory.find().populate('supplierId', 'supplierName contact');
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching inventory', error });
    }
  };