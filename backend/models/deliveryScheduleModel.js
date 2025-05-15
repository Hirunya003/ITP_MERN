import mongoose from 'mongoose';

const deliveryScheduleSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const DeliverySchedule = mongoose.model('DeliverySchedule', deliveryScheduleSchema);
export default DeliverySchedule;