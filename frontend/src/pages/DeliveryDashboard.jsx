import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import { FiPackage, FiTruck, FiMap, FiCalendar, FiUsers, FiClipboard, FiRefreshCw, FiCheck, FiX, FiAlertCircle, FiSearch } from "react-icons/fi";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Spinner from '../components/Spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([
    { id: 1, name: "John Doe", available: true, contact: "123-456-7890" },
    { id: 2, name: "Jane Smith", available: true, contact: "123-456-7891" },
    { id: 3, name: "Mike Johnson", available: true, contact: "123-456-7892" },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [deliveryStats, setDeliveryStats] = useState({
    pendingDeliveries: 0,
    inTransit: 0,
    completed: 0,
    cancelled: 0,
    totalDrivers: 0,
  });

  if (!user || user.email !== "storekeeper@example.com") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const ordersResponse = await axios.get(`${API_BASE_URL}/api/orders/all`, config);
      const allOrders = ordersResponse.data;

      const deliveryOrders = allOrders.filter(order =>
        order.paymentMethod === 'online-payment' ||
        order.status === 'processing' ||
        order.status === 'shipped' ||
        order.status === 'delivered' ||
        order.status === 'cancelled'
      );

      setOrders(deliveryOrders);

      const stats = {
        pendingDeliveries: deliveryOrders.filter(o => o.status === 'processing').length,
        inTransit: deliveryOrders.filter(o => o.status === 'shipped').length,
        completed: deliveryOrders.filter(o => o.status === 'delivered').length,
        cancelled: deliveryOrders.filter(o => o.status === 'cancelled').length,
        totalDrivers: drivers.length,
      };
      console.log('Updated deliveryStats:', stats); // Debug log
      setDeliveryStats(stats);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch orders', { variant: 'error' });
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm
      ? order.billingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesTab = activeTab === 'all' ? true : order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAssignDriver = async (orderId, driverId) => {
    try {
      // Optimistically update the orders state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'shipped', driverName: drivers.find(d => d.id === driverId).name } : order
        )
      );

      // Optimistically update deliveryStats
      setDeliveryStats(prevStats => {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: 'shipped', driverName: drivers.find(d => d.id === driverId).name } : order
        );
        return {
          ...prevStats,
          pendingDeliveries: updatedOrders.filter(o => o.status === 'processing').length,
          inTransit: updatedOrders.filter(o => o.status === 'shipped').length,
          completed: updatedOrders.filter(o => o.status === 'delivered').length,
          cancelled: updatedOrders.filter(o => o.status === 'cancelled').length,
        };
      });

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const scheduleData = {
        orderId,
        driverName: drivers.find(d => d.id === driverId).name,
        scheduledTime: new Date(),
        deliveryStatus: 'Pending',
        customerName: selectedOrder.billingInfo.fullName,
        customerAddress: selectedOrder.shippingAddress,
      };

      await axios.post(`${API_BASE_URL}/api/delivery-schedules`, scheduleData, config);

      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        { status: 'shipped' },
        config
      );

      enqueueSnackbar('Driver assigned successfully', { variant: 'success' });
      setShowAssignModal(false);
      await fetchOrders(); // Sync with server
    } catch (error) {
      console.error('Error assigning driver:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to assign driver', { variant: 'error' });
      await fetchOrders(); // Revert to server state on error
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistically update the orders state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Optimistically update deliveryStats
      setDeliveryStats(prevStats => {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        return {
          ...prevStats,
          pendingDeliveries: updatedOrders.filter(o => o.status === 'processing').length,
          inTransit: updatedOrders.filter(o => o.status === 'shipped').length,
          completed: updatedOrders.filter(o => o.status === 'delivered').length,
          cancelled: updatedOrders.filter(o => o.status === 'cancelled').length,
        };
      });

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        config
      );

      enqueueSnackbar(`Order status updated to ${newStatus}`, { variant: 'success' });
      setShowStatusModal(false);
      await fetchOrders(); // Sync with server
    } catch (error) {
      console.error('Error updating order status:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to update status', { variant: 'error' });
      await fetchOrders(); // Revert to server state on error
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReport = () => {
    if (filteredOrders.length === 0) {
      enqueueSnackbar('No orders found for the selected customer', { variant: 'info' });
      return;
    }

    const statusCounts = {
      processing: filteredOrders.filter(o => o.status === 'processing').length,
      shipped: filteredOrders.filter(o => o.status === 'shipped').length,
      delivered: filteredOrders.filter(o => o.status === 'delivered').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    };

    const totalOrders = filteredOrders.length;
    const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yOffset = 20;

    doc.setFontSize(18);
    doc.text('Delivery Report', margin, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text(`Customer: ${searchTerm || 'All Customers'}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Total Orders: ${totalOrders}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Total Value: Rs.${totalValue.toFixed(2)}`, margin, yOffset);
    yOffset += 10;

    doc.setFontSize(14);
    doc.text('Status Distribution', margin, yOffset);
    yOffset += 8;
    doc.setFontSize(12);
    doc.text(`Processing: ${statusCounts.processing}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Shipped: ${statusCounts.shipped}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Delivered: ${statusCounts.delivered}`, margin, yOffset);
    yOffset += 6;
    doc.text(`Cancelled: ${statusCounts.cancelled}`, margin, yOffset);
    yOffset += 10;

    doc.setFontSize(14);
    doc.text('Order Details', margin, yOffset);
    yOffset += 8;

    const tableData = filteredOrders.map(order => [
      order._id,
      order.billingInfo.fullName,
      order.shippingAddress,
      order.status.charAt(0).toUpperCase() + order.status.slice(1),
      `Rs.${order.totalPrice.toFixed(2)}`,
      order.items.map(item => `${item.product.name} (x${item.quantity})`).join(', '),
    ]);

    autoTable(doc, {
      startY: yOffset,
      head: [['Order ID', 'Customer', 'Address', 'Status', 'Total', 'Items']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 50 },
      },
      margin: { left: margin, right: margin },
    });

    const fileName = `delivery_report_${searchTerm || 'all'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    enqueueSnackbar(
      `PDF Report Generated: ${totalOrders} orders for "${searchTerm || 'All Customers'}"`,
      { variant: 'success' }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
            <p className="mt-2 text-gray-600">Manage orders and assign drivers</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiClipboard className="text-lg" />
              Generate Report
            </button>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <FiRefreshCw className="text-lg" />
              Refresh Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiPackage size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.pendingDeliveries}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiTruck size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">In Transit</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.inTransit}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiCheck size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <FiX size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.cancelled}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiUsers size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Drivers</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveryStats.totalDrivers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4 mb-6">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.billingInfo.fullName}<br/>
                      <span className="text-gray-500">{order.billingInfo.email}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.shippingAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.driverName || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs.{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Update Status"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </button>
                        {order.status === 'processing' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAssignModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Assign Driver"
                          >
                            <FiTruck className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FiClipboard className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Driver</h2>
            <div className="mb-4">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Customer:</strong> {selectedOrder.billingInfo.fullName}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Available Drivers:</h3>
              {drivers.filter(d => d.available).map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => handleAssignDriver(selectedOrder._id, driver.id)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-500">{driver.contact}</p>
                </button>
              ))}
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Order Information</p>
                <p>Order ID: {selectedOrder._id}</p>
                <p>Status: <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span></p>
                <p>Total: Rs.{selectedOrder.totalPrice.toFixed(2)}</p>
                <p>Payment Method: {selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Information</p>
                <p>Name: {selectedOrder.billingInfo.fullName}</p>
                <p>Email: {selectedOrder.billingInfo.email}</p>
                <p>Shipping Address: {selectedOrder.shippingAddress}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Order Items</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <div className="mb-4">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Customer:</strong> {selectedOrder.billingInfo.fullName}</p>
              <p><strong>Current Status:</strong> {selectedOrder.status}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleStatusChange(selectedOrder._id, 'processing')}
                className="w-full bg-yellow-100 text-yellow-800 py-2 px-4 rounded hover:bg-yellow-200"
              >
                Mark as Processing
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder._id, 'shipped')}
                className="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded hover:bg-blue-200"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                className="w-full bg-green-100 text-green-800 py-2 px-4 rounded hover:bg-green-200"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => handleStatusChange(selectedOrder._id, 'cancelled')}
                className="w-full bg-red-100 text-red-800 py-2 px-4 rounded hover:bg-red-200"
              >
                Mark as Cancelled
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;