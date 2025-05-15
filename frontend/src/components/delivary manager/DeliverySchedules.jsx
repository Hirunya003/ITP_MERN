import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Spinner from '../Spinner';
import './DeliverySchedules.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const DeliverySchedules = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/delivery-schedules?status=${statusFilter}`, config);
        setSchedules(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching delivery schedules:', error);
        enqueueSnackbar('Failed to load delivery schedules', { variant: 'error' });
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [statusFilter, enqueueSnackbar]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery schedule?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        };
        await axios.delete(`${API_BASE_URL}/api/delivery-schedules/${id}`, config);
        setSchedules(schedules.filter((schedule) => schedule._id !== id));
        enqueueSnackbar('Delivery schedule deleted successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting delivery schedule:', error);
        enqueueSnackbar('Failed to delete delivery schedule', { variant: 'error' });
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-delivery-schedule/${id}`);
  };

  if (loading) {
    return <div className="delivery-schedules-container"><Spinner /></div>;
  }

  return (
    <div className="delivery-schedules-container">
      <h2>Delivery Schedules</h2>
      <p>Manage all your delivery schedules in one place</p>
      <div className="controls">
        <input type="text" placeholder="Search deliveries..." className="search-bar" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-filter">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="schedules-list">
        {schedules.map((schedule) => (
          <div key={schedule._id} className="schedule-card">
            <h3>Order #{schedule.order._id}</h3>
            <span className={`status ${schedule.status}`}>{schedule.status}</span>
            <p><strong>Driver</strong><br />{schedule.driverName}</p>
            <p><strong>Scheduled Time</strong><br />{new Date(schedule.scheduledDate).toLocaleString()}</p>
            <p><strong>Customer</strong><br />{schedule.customerName}<br />{schedule.customerAddress}</p>
            <div className="schedule-actions">
              <button onClick={() => handleEdit(schedule._id)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(schedule._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverySchedules;