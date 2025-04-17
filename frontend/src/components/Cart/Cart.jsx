import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cart data is already fetched by CartContext, just wait for it
    if (cart) {
      setLoading(false);
    }
  }, [cart]);

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const handleQuantityChange = (productId, delta) => {
    const item = cart.items.find(i => i.product._id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="continue-shopping">Continue Shopping</Link>
        </div>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product._id}>
                  <td>
                    <div className="cart-item">
                      <img src={item.product.image} alt={item.product.name} className="cart-image" />
                      <span>{item.product.name}</span>
                    </div>
                  </td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, -1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, 1)}
                        className="quantity-btn"
                        disabled={item.quantity >= item.product.currentStock}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => removeFromCart(item.product._id)} 
                      className="remove-item"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <span>Total Price: ${getTotalPrice()}</span>
            <div className="clear-cart">
              <button onClick={clearCart} className="clear-btn">Clear Cart</button>
            </div>
            <Link to="/products" className="continue-shopping">Continue Shopping</Link>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;