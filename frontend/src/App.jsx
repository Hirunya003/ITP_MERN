import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/products' element={<Products />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path='/admin' element={<AdminDashboard />} />
          
        {/* Special Roles Routes */}
        <Route path='/cashier' element={<CashierDashboard />} />
        <Route path='/storekeeper' element={<StorekeeperDashboard />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
