import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useSnackbar } from 'notistack';

export const CartContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const { data } = await axios.get(`${API_BASE_URL}/api/cart`, config);
          setCart(data);
        } catch (error) {
          console.error('Error fetching cart:', error);
          enqueueSnackbar('Failed to load cart', { variant: 'error' });
        }
      } else {
        setCart({ items: [] });
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      enqueueSnackbar('Please log in to add items to your cart', { variant: 'warning' });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/api/cart`,
        { productId: product._id, quantity },
        config
      );
      setCart(data);
      enqueueSnackbar(`${product.name} added to cart`, { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to add to cart', { variant: 'error' });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      enqueueSnackbar('Please log in to update your cart', { variant: 'warning' });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
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
      console.error('Error updating cart:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to update cart', { variant: 'error' });
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      enqueueSnackbar('Please log in to modify your cart', { variant: 'warning' });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, config);
      setCart(data);
      enqueueSnackbar('Item removed from cart', { variant: 'success' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to remove from cart', { variant: 'error' });
    }
  };

  const clearCart = async () => {
    if (!user) {
      enqueueSnackbar('Please log in to clear your cart', { variant: 'warning' });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.delete(`${API_BASE_URL}/api/cart`, config);
      setCart(data);
      enqueueSnackbar('Cart cleared', { variant: 'success' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to clear cart', { variant: 'error' });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};