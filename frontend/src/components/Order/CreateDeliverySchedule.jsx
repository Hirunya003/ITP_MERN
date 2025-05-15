import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const CreateDeliverySchedule = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderId: orderId || '',
    driverName: '',
    scheduledTime: '',
    deliveryStatus: 'Pending',
    customerName: '',
    customerAddress: '',
  });
  const [orders, setOrders] = useState([]);

  // Fetch orders for the dropdown
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/orders/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(response.data);
        if (orderId) {
          const selectedOrder = response.data.find((order) => order._id === orderId);
          if (selectedOrder) {
            setFormData({
              ...formData,
              orderId,
              customerName: selectedOrder.billingInfo.fullName,
              customerAddress: selectedOrder.shippingAddress,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        enqueueSnackbar('Failed to fetch orders', { variant: 'error' });
      }
    };
    fetchOrders();
  }, [orderId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5555/api/delivery-schedules', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      enqueueSnackbar('Delivery schedule created successfully', { variant: 'success' });
      navigate('/delivery-schedules');
    } catch (error) {
      console.error('Error creating delivery schedule:', error);
      enqueueSnackbar('Failed to create delivery schedule', { variant: 'error' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Create Delivery Schedule</h1>
      <p className="text-gray-500 mb-6">Assign a driver to an order with a specific time and status</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Order ID</label>
            <select
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order._id} value={order._id}>
                  ORD-{order._id.slice(-3)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Scheduled Time</label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Delivery Status</label>
            <select
              name="deliveryStatus"
              value={formData.deliveryStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. Alice Smith"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Customer Address</label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Anytown"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-800"
        >
          Create Delivery Schedule
        </button>
      </div>
    </div>
  );
};

export default CreateDeliverySchedule;