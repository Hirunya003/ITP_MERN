import mongoose from 'mongoose';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import StockHistory from '../models/stockHistoryModel.js';

// @desc    Checkout and place an order
// @access  Private
export const checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);

    if (!cart || !cart.items || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const { fullName, email, shippingAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!fullName || !email || !shippingAddress || !paymentMethod) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Missing required checkout information' });
    }

    // Validate payment method
    if (!['online-payment', 'in-store-payment'].includes(paymentMethod)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Validate and update stock
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product not found: ${item.product._id}` });
      }
      if (product.currentStock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      // Update stock
      product.currentStock -= item.quantity;
      await product.save({ session });

      // Record stock history
      await StockHistory.create(
        [{
          product: product._id,
          changeType: 'remove',
          quantity: item.quantity,
          previousStock: product.currentStock + item.quantity,
          newStock: product.currentStock,
          notes: `Stock removed for order`,
          performedBy: userId,
        }],
        { session }
      );

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Calculate total price
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      billingInfo: { fullName, email },
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    await order.save({ session });

    // Clear the cart
    cart.items = [];
    await cart.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single order by ID
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Cancel an order
// @access  Private
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    // Find the order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the order belongs to the user
    if (order.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if the order is still in "pending" status
    if (order.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Order cannot be cancelled as it is already being processed' });
    }

    // Restore stock for each item in the order
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // Update stock
      product.currentStock += item.quantity;
      await product.save({ session });

      // Record stock history
      await StockHistory.create(
        [{
          product: item.product,
          changeType: 'add',
          quantity: item.quantity,
          previousStock: product.currentStock - item.quantity,
          newStock: product.currentStock,
          notes: `Stock restored due to order cancellation`,
          performedBy: userId,
        }],
        { session }
      );
    }

    // Delete the order
    await Order.deleteOne({ _id: orderId }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Order cancelled and removed successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};