import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './components/home/Home';
import Login from './components/Login/Login';
import Register from './components/SignUp/Register';
import AdminLogin from './components/AdminLogin/AdminLogin';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import CashierDashboard from './pages/CashierDashboard';
import StorekeeperDashboard from './pages/StorekeeperDashboard';
import Products from './pages/Products';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './components/Cart/Cart'; 
import CheckoutPage from './pages/CheckoutPage';
import Orders from './components/Order/Orders';
import OrderConfirmation from './components/Order/OrderConfirmation';
import OrderDetails from './components/Order/OrderDetails';
import PrivateRoute from './components/PrivateRoute';
import ProductPreview from './components/Order/ProductPreview';
import UpdateOrderStatus from './pages/UpdateOrderStatus';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
          <Route path="/order-confirmation/:orderId" element={<PrivateRoute element={<OrderConfirmation />} />} />
          <Route path="/order-details/:orderId" element={<PrivateRoute element={<OrderDetails />} />} />
          <Route path="/product-preview/:productId" element={<ProductPreview />} />
        

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Special Roles Routes */}
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/storekeeper" element={<StorekeeperDashboard />} />
          <Route path="/cashier/update-order-status" element={<PrivateRoute element={<UpdateOrderStatus />} />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;