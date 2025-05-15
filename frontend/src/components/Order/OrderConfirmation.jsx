import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Spinner from '../Spinner';
import './OrderConfirmation.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/orders`, config);
        const foundOrder = data.find((o) => o._id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
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

  const handleGoToPayment = () => {
    
    navigate(`/payment/${orderId}`);
  };

  if (loading) {
    return (
      <div className="order-confirmation-container">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return <div className="order-confirmation-container">Order not found</div>;
  }

  return (
    <div className="order-confirmation-container">
      <h2>Order Confirmation</h2>
      <div className="order-details">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> Rs.{order.totalPrice.toFixed(2)}
        </p>
        <p>
          <strong>Billing Name:</strong> {order.billingInfo.fullName}
        </p>
        <p>
          <strong>Email:</strong> {order.billingInfo.email}
        </p>
        <p>
          <strong>Shipping Address:</strong> {order.shippingAddress}
        </p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {order.paymentMethod === "online-payment"
            ? "Online Payment"
            : "In-Store Payment"}
        </p>
        <h3>Order Items</h3>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.product?.name || "Unknown Product"}</td>
                <td>{item.quantity}</td>
                <td>Rs.{item.price.toFixed(2)}</td>
                <td>Rs.{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="order-actions">
        {/* Conditionally render the Go to Payment button */}
        {order.paymentMethod === "online-payment" &&
          order.status === "pending" && (
            <button onClick={handleGoToPayment} className="go-to-payment-btn">
              Go to Payment
            </button>
          )}
        <button
          onClick={() => navigate("/products")}
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
        <button onClick={() => navigate("/orders")} className="view-orders-btn">
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;