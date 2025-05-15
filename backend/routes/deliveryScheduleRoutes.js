import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createDeliverySchedule,
  getDeliverySchedules,
  updateDeliverySchedule,
  deleteDeliverySchedule,
} from '../controllers/deliveryScheduleController.js';

const router = express.Router();

// @desc    Create a delivery schedule
// @route   POST /api/delivery-schedules
// @access  Private
router.post('/', protect, createDeliverySchedule);

// @desc    Get all delivery schedules
// @route   GET /api/delivery-schedules
// @access  Private
router.get('/', protect, getDeliverySchedules);

// @desc    Update a delivery schedule
// @route   PUT /api/delivery-schedules/:id
// @access  Private
router.put('/:id', protect, updateDeliverySchedule);

// @desc    Delete a delivery schedule
// @route   DELETE /api/delivery-schedules/:id
// @access  Private
router.delete('/:id', protect, deleteDeliverySchedule);

export default router;