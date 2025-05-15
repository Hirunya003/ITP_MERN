import express from "express";
import Order from "../models/orderModel.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  checkout,
  getOrders,
  cancelOrder,
  getOrderById,
  generateOrderReport,
  getAllOrders,
  updateOrderStatus,
  getPaidOrdersForDelivery,
} from "../controllers/orderController.js";

const router = express.Router();

// Customer Order Routes
// @desc    Get user's orders with basic info
// @route   GET /api/orders
// @access  Private
router.get('/', protect, getOrders);

// @desc    Get user's orders with detailed info (including products)
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// @desc    Get user's paid orders for delivery tracking
// @route   GET /api/orders/delivery
// @access  Private
router.get('/delivery', protect, getPaidOrdersForDelivery);

// @desc    Checkout and place an order
// @route   POST /api/orders/checkout
// @access  Private
router.post("/checkout", protect, checkout);

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// Admin/Staff Routes
// @desc    Get all orders (for storekeeper and cashier)
// @route   GET /api/orders/all
// @access  Private (Staff Only)
router.get('/all', protect, getAllOrders);

// @desc    Generate order report
// @route   GET /api/orders/report
// @access  Private (Staff Only)
router.get("/report", protect, generateOrderReport);

// @desc    Update order status (for cashier/storekeeper)
// @route   PUT /api/orders/:id/status
// @access  Private (Staff Only)
router.put('/:id/status', protect, updateOrderStatus);

// General Order Routes
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, getOrderById);

export default router;