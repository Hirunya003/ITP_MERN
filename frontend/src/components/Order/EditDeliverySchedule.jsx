import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const EditDeliverySchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderId: '',
    driverName: '',
    scheduledTime: '',
    deliveryStatus: '',
    customerName: '',
    customerAddress: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/delivery-schedules/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const schedule = response.data;
        setFormData({
          orderId: schedule.order._id,
          driverName: schedule.driverName,
          scheduledTime: new Date(schedule.scheduledTime).toISOString().slice(0, 16),
          deliveryStatus: schedule.deliveryStatus,
          customerName: schedule.customerName,
          customerAddress: schedule.customerAddress,
        });
      } catch (error) {
        console.error('Error fetching delivery schedule:', error);
        enqueueSnackbar('Failed to fetch delivery schedule', { variant: 'error' });
      }
    };
    fetchSchedule();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5555/api/delivery-schedules/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      enqueueSnackbar('Delivery schedule updated successfully', { variant: 'success' });
      navigate('/delivery-schedules');
    } catch (error) {
      console.error('Error updating delivery schedule:', error);
      enqueueSnackbar('Failed to update delivery schedule', { variant: 'error' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Edit Delivery Schedule</h1>
      <p className="text-gray-500 mb-6">Update the delivery schedule details</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Order ID</label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
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
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-800"
        >
          Update Delivery Schedule
        </button>
      </div>
    </div>
  );
};

export default EditDeliverySchedule;