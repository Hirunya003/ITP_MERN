const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // ✅ use controller functions

router.post('/inventory', inventoryController.insertInventory);

module.exports = router;