import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkout, getOrders, cancelOrder, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

// @desc    Checkout and place an order
// @route   POST /api/orders/checkout
// @access  Private
router.post('/checkout', protect, checkout);

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, getOrders);

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, getOrderById);

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

export default router;