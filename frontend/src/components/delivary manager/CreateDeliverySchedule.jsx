import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Spinner from '../Spinner';
import './CreateDeliverySchedule.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const CreateDeliverySchedule = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    driverName: '',
    scheduledDate: '',
    status: 'pending',
    customerName: '',
    customerAddress: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, config);
        if (data) {
          setOrder(data);
          setFormData({
            driverName: '',
            scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            status: 'pending',
            customerName: data.billingInfo.fullName,
            customerAddress: data.shippingAddress,
          });
        } else {
          enqueueSnackbar('Order not found', { variant: 'error' });
          navigate('/orders');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        enqueueSnackbar('Failed to load order details', { variant: 'error' });
        setLoading(false);
        navigate('/orders');
      }
    };

    fetchOrder();
  }, [orderId, navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
      };
      await axios.post(
        `${API_BASE_URL}/api/delivery-schedules`,
        { orderId, ...formData },
        config
      );
      enqueueSnackbar('Delivery schedule created successfully', { variant: 'success' });
      navigate('/delivery-schedules');
    } catch (error) {
      console.error('Error creating delivery schedule:', error);
      enqueueSnackbar('Failed to create delivery schedule', { variant: 'error' });
    }
  };

  if (loading) {
    return <div className="create-delivery-schedule-container"><Spinner /></div>;
  }

  if (!order) {
    return <div className="create-delivery-schedule-container">Order not found</div>;
  }

  return (
    <div className="create-delivery-schedule-container">
      <h2>Create Delivery Schedule</h2>
      <p>Assign a driver to an order with a specific time and status</p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Order ID</label>
            <input type="text" value={orderId} disabled />
          </div>
          <div className="form-group">
            <label>Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Scheduled Time</label>
            <input
              type="datetime-local"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Delivery Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="e.g. Alice Smith"
              required
            />
          </div>
          <div className="form-group">
            <label>Customer Address</label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Anytown"
              required
            />
          </div>
        </div>
        <button type="submit" className="create-schedule-btn">
          Create Delivery Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateDeliverySchedule;