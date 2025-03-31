// // backend/controllers/productController.js
// const mongoose = require('mongoose');
// const Product = require('../models/productModel');

// exports.getProductById = async (req, res) => {
//   try {
//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid product ID' });
//     }

//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error); // Log the error for debugging
//     res.status(500).json({ message: 'Server error' });
//   }
// };