import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  // Fetch cart data when user is logged in
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const { data } = await axios.get(`${API_BASE_URL}/api/cart`, config);
          setCart(data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };
    fetchCart();
  }, [user]);

  // Modified: Updated addToCart to accept product with quantity
  const addToCart = async (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const quantity = product.quantity || 1; // Use provided quantity or default to 1
      const { data } = await axios.post(
        `${API_BASE_URL}/api/cart`,
        { productId: product._id, quantity },
        config
      );
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_BASE_URL}/api/cart/${productId}`,
        { quantity },
        config
      );
      setCart(data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, config);
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.delete(`${API_BASE_URL}/api/cart`, config);
      setCart(data);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };