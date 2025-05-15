import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiX, FiRefreshCw, FiClock, FiInfo, FiMapPin, FiCalendar } from 'react-icons/fi';
import DeliveryForm from '../components/delivary manager/DeliveryForm';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const tabs = [
    { name: 'All', icon: <FiPackage className="mr-2" />, count: 0 },
    { name: 'Processing', icon: <FiClock className="mr-2" />, count: 0 },
    { name: 'On the Way', icon: <FiTruck className="mr-2" />, count: 0 },
    { name: 'Delivered', icon: <FiCheckCircle className="mr-2" />, count: 0 },
    { name: 'Cancelled', icon: <FiX className="mr-2" />, count: 0 }
  ];

  const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      return null;
    }
    try {
      const parsedUserInfo = JSON.parse(userInfo);
      return parsedUserInfo.token;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        enqueueSnackbar('Please login to view deliveries', { variant: 'warning' });
        navigate('/login');
        return;
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch all orders for the current user
      const response = await axios.get(`${API_BASE_URL}/api/orders/myorders`, config);
      
      // Filter only orders that have been paid and are in delivery process
      const validDeliveries = response.data.filter(order => 
        order.paymentMethod === 'online-payment' || 
        order.status === 'processing' ||
        order.status === 'shipped' ||
        order.status === 'delivered' ||
        order.status === 'cancelled'
      );

      setDeliveries(validDeliveries);
      
      // Update tab counts
      tabs.forEach(tab => {
        if (tab.name === 'All') {
          tab.count = validDeliveries.length;
        } else if (tab.name === 'On the Way') {
          tab.count = validDeliveries.filter(d => d.status === 'shipped').length;
        } else {
          tab.count = validDeliveries.filter(d => 
            d.status.toLowerCase() === tab.name.toLowerCase()
          ).length;
        }
      });

      enqueueSnackbar('Deliveries updated successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      if (err.response?.status === 401) {
        enqueueSnackbar('Session expired. Please login again', { variant: 'error' });
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }
      const errorMessage = err.response?.data?.message || 'Failed to fetch deliveries';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDeliveries();
  };

  const handleCancel = async (orderId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        enqueueSnackbar('Please login to perform this action', { variant: 'warning' });
        navigate('/login');
        return;
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {}, config);
      fetchDeliveries();
      enqueueSnackbar('Order cancelled successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error cancelling order:', err);
      if (err.response?.status === 401) {
        enqueueSnackbar('Session expired. Please login again', { variant: 'error' });
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }
      const errorMessage = err.response?.data?.message || 'Failed to cancel order';
      enqueueSnackbar(errorMessage, { variant: 'error' });
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

  const getProgress = (status) => {
    switch (status) {
      case 'processing': return 33;
      case 'shipped': return 66;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const displayStatus = (status) => {
    if (status === 'shipped') return 'On the Way';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredDeliveries = activeTab === 'All'
    ? deliveries
    : deliveries.filter(delivery => {
        if (activeTab === 'On the Way') return delivery.status === 'shipped';
        return delivery.status.toLowerCase() === activeTab.toLowerCase();
      });

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Navigation Bar */}
      <nav className="flex gap-3 p-3 bg-white border-b border-gray-200 mb-6 rounded-lg shadow-sm">
        <Link to="/delivery" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Dashboard
        </Link>
        <Link to="/refund" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Refund Item
        </Link>
        <Link to="/support" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200">
          Contact Support
        </Link>
      </nav>

      {/* Deliveries Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
            <p className="text-gray-600 text-sm">Track your orders and delivery status</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 ${
              refreshing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <FiRefreshCw className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`cursor-pointer bg-white rounded-lg p-4 shadow-sm border-2 transition-all duration-200 ${
                activeTab === tab.name ? 'border-yellow-500' : 'border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </div>
                <span className="text-lg font-semibold">{tab.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
            <p>{error}</p>
            <button onClick={handleRefresh} className="mt-2 text-red-600 hover:text-red-800 underline">
              Try Again
            </button>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              You don't have any orders in this category.
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {displayStatus(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="text-gray-400" />
                          Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <FiMapPin className="text-gray-400" />
                          Shipping to: {order.shippingAddress}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-gray-600">
                          <FiPackage className="text-gray-400" />
                          Items: {order.items.length}
                        </p>
                        <p className="flex items-center gap-2 font-medium">
                          Total: Rs.{order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      <FiInfo />
                      View Details
                    </button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200"
                      >
                        <FiX />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>On the Way</span>
                    <span>Delivered</span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`absolute h-2 rounded-full transition-all duration-500 ${
                        order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${getProgress(order.status)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Information */}
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Order ID:</p>
                      <p className="font-medium">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {displayStatus(selectedOrder.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Order Date:</p>
                      <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method:</p>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <p className="text-gray-600">Total Amount:</p>
                    <p className="text-xl font-bold">Rs.{selectedOrder.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Shipping Information */}
                <div>
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-600">Delivery Address:</p>
                    <p className="font-medium">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPage;