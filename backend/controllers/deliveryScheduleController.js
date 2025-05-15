import DeliverySchedule from '../models/deliveryScheduleModel.js';
import Order from '../models/orderModel.js';

// @desc    Create a delivery schedule
// @access  Private
export const createDeliverySchedule = async (req, res) => {
  try {
    const { orderId, driverName, scheduledTime, deliveryStatus, customerName, customerAddress } = req.body;

    if (!orderId || !driverName || !scheduledTime || !deliveryStatus || !customerName || !customerAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const deliverySchedule = new DeliverySchedule({
      order: orderId,
      driverName,
      scheduledTime,
      deliveryStatus,
      customerName,
      customerAddress,
    });

    await deliverySchedule.save();
    res.status(201).json({ message: 'Delivery schedule created successfully', deliverySchedule });
  } catch (error) {
    console.error('Error creating delivery schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all delivery schedules
// @access  Private
export const getDeliverySchedules = async (req, res) => {
  try {
    const deliverySchedules = await DeliverySchedule.find({}).populate('order');
    res.json(deliverySchedules);
  } catch (error) {
    console.error('Error fetching delivery schedules:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a delivery schedule
// @access  Private
export const updateDeliverySchedule = async (req, res) => {
  try {
    const { driverName, scheduledTime, deliveryStatus, customerName, customerAddress } = req.body;
    const deliverySchedule = await DeliverySchedule.findById(req.params.id);

    if (!deliverySchedule) {
      return res.status(404).json({ message: 'Delivery schedule not found' });
    }

    deliverySchedule.driverName = driverName || deliverySchedule.driverName;
    deliverySchedule.scheduledTime = scheduledTime || deliverySchedule.scheduledTime;
    deliverySchedule.deliveryStatus = deliveryStatus || deliverySchedule.deliveryStatus;
    deliverySchedule.customerName = customerName || deliverySchedule.customerName;
    deliverySchedule.customerAddress = customerAddress || deliverySchedule.customerAddress;

    await deliverySchedule.save();
    res.json({ message: 'Delivery schedule updated successfully', deliverySchedule });
  } catch (error) {
    console.error('Error updating delivery schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a delivery schedule
// @access  Private
export const deleteDeliverySchedule = async (req, res) => {
  try {
    const deliverySchedule = await DeliverySchedule.findById(req.params.id);

    if (!deliverySchedule) {
      return res.status(404).json({ message: 'Delivery schedule not found' });
    }

    await DeliverySchedule.deleteOne({ _id: req.params.id });
    res.json({ message: 'Delivery schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};