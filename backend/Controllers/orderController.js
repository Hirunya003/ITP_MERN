// // backend/controllers/orderController.js
// const Order = require('../Models/Order');
// const Cart = require('../Models/Cart');

// exports.createOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.userId });

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     const order = new Order({
//       userId: req.userId,
//       items: cart.items,
//       total: cart.total,
//     });

//     await order.save();

//     // Clear the cart after order placement
//     cart.items = [];
//     cart.total = 0;
//     await cart.save();

//     res.json({ message: 'Order placed successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };