import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const DeliverySchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/delivery-schedules', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching delivery schedules:', error);
        enqueueSnackbar('Failed to fetch delivery schedules', { variant: 'error' });
      }
    };
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/api/delivery-schedules/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedules(schedules.filter((schedule) => schedule._id !== id));
      enqueueSnackbar('Delivery schedule deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting delivery schedule:', error);
      enqueueSnackbar('Failed to delete delivery schedule', { variant: 'error' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Schedules</h1>
      <button
        onClick={() => navigate('/create-delivery-schedule')}
        className="mb-4 bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Create Delivery Schedule
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Driver Name</th>
              <th className="border p-2">Scheduled Time</th>
              <th className="border p-2">Delivery Status</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Customer Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td className="border p-2">ORD-{schedule.order._id.slice(-3)}</td>
                <td className="border p-2">{schedule.driverName}</td>
                <td className="border p-2">{new Date(schedule.scheduledTime).toLocaleString()}</td>
                <td className="border p-2">{schedule.deliveryStatus}</td>
                <td className="border p-2">{schedule.customerName}</td>
                <td className="border p-2">{schedule.customerAddress}</td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/edit-delivery-schedule/${schedule._id}`)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliverySchedules;