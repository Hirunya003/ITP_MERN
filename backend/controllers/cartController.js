// // backend/controllers/cartController.js
// const Cart = require('../Models/Cart');
// const Product = require('../Models/Product');

// exports.getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.userId });
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.addToCart = async (req, res) => {
//   const { productId, name, price, quantity, image } = req.body;

//   try {
//     // Check product availability
//     const product = await Product.findById(productId);
//     if (!product || !product.isActive || product.currentstock < quantity) {
//       return res.status(400).json({ message: 'Product is out of stock or inactive' });
//     }

//     let cart = await Cart.findOne({ userId: req.userId });

//     if (!cart) {
//       cart = new Cart({ userId: req.userId, items: [], total: 0 });
//     }

//     const itemIndex = cart.items.findIndex((item) => item.productId === productId);

//     if (itemIndex > -1) {
//       const newQuantity = cart.items[itemIndex].quantity + quantity;
//       if (product.currentstock < newQuantity) {
//         return res.status(400).json({ message: 'Not enough stock available' });
//       }
//       cart.items[itemIndex].quantity = newQuantity;
//     } else {
//       cart.items.push({ productId, name, price, quantity, image });
//     }

//     cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.updateCartItem = async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const cart = await Cart.findOne({ userId: req.userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     const product = await Product.findById(productId);
//     if (!product || !product.isActive || product.currentstock < quantity) {
//       return res.status(400).json({ message: 'Product is out of stock or inactive' });
//     }

//     const itemIndex = cart.items.findIndex((item) => item.productId === productId);

//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity = quantity;
//       if (cart.items[itemIndex].quantity <= 0) {
//         cart.items.splice(itemIndex, 1);
//       }
//     }

//     cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.removeFromCart = async (req, res) => {
//   const { productId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId: req.userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     cart.items = cart.items.filter((item) => item.productId !== productId);
//     cart.total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };