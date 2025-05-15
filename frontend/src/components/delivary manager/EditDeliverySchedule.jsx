import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Spinner from '../Spinner';
import './CreateDeliverySchedule.css'; // Reuse the same CSS

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const EditDeliverySchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    driverName: '',
    scheduledDate: '',
    status: 'pending',
    customerName: '',
    customerAddress: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/delivery-schedules`, config);
        const foundSchedule = data.find((s) => s._id === id);
        if (foundSchedule) {
          setSchedule(foundSchedule);
          setFormData({
            driverName: foundSchedule.driverName,
            scheduledDate: new Date(foundSchedule.scheduledDate).toISOString().slice(0, 16),
            status: foundSchedule.status,
            customerName: foundSchedule.customerName,
            customerAddress: foundSchedule.customerAddress,
          });
        } else {
          enqueueSnackbar('Delivery schedule not found', { variant: 'error' });
          navigate('/delivery-schedules');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery schedule:', error);
        enqueueSnackbar('Failed to load delivery schedule', { variant: 'error' });
        setLoading(false);
        navigate('/delivery-schedules');
      }
    };

    fetchSchedule();
  }, [id, navigate, enqueueSnackbar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
      };
      await axios.put(`${API_BASE_URL}/api/delivery-schedules/${id}`, formData, config);
      enqueueSnackbar('Delivery schedule updated successfully', { variant: 'success' });
      navigate('/delivery-schedules');
    } catch (error) {
      console.error('Error updating delivery schedule:', error);
      enqueueSnackbar('Failed to update delivery schedule', { variant: 'error' });
    }
  };

  if (loading) {
    return <div className="create-delivery-schedule-container"><Spinner /></div>;
  }

  if (!schedule) {
    return <div className="create-delivery-schedule-container">Delivery schedule not found</div>;
  }

  return (
    <div className="create-delivery-schedule-container">
      <h2>Edit Delivery Schedule</h2>
      <p>Update the driver, time, and status for this delivery</p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Order ID</label>
            <input type="text" value={schedule.order._id} disabled />
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
          Update Delivery Schedule
        </button>
      </form>
    </div>
  );
};

export default EditDeliverySchedule;