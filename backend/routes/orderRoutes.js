import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { checkout, getOrders, cancelOrder, getOrderById, generateOrderReport, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// @desc    Checkout and place an order
// @route   POST /api/orders/checkout
// @access  Private
router.post('/checkout', protect, checkout);

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, getOrders);

// @desc    Generate order report by status
// @route   GET /api/orders/report
// @access  Private
router.get('/report', protect, (req, res) => {
    console.log('Handling /report route');
    return generateOrderReport(req, res);
  });

// @desc    Get all orders (for storekeeper and cashier)
// @route   GET /api/orders/all
// @access  Private
router.get('/all', protect, getAllOrders);

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, getOrderById);

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @desc    Update order status (for cashier)
// @route   PUT /api/orders/:id/status
// @access  Private
router.put('/:id/status', protect, updateOrderStatus);

export default router;