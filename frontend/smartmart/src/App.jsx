import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddSupplier from './components/AddSupplier';
import SupplierList from './components/SupplierList';
import PerformanceReport from './components/PerformanceReport';
import PurchaseOrder from './components/PurchaseOrder';
import RestockAlerts from './components/RestockAlerts';
import {
  FaUserPlus,
  FaList,
  FaChartLine,
  FaFileInvoice,
  FaBell
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const features = [
    { label: "Add Supplier", icon: <FaUserPlus />, path: "/add-supplier" },
    { label: "Supplier List", icon: <FaList />, path: "/supplier-list" },
    { label: "Performance Report", icon: <FaChartLine />, path: "/performance-report" },
    { label: "Purchase Order", icon: <FaFileInvoice />, path: "/purchase-order" },
    { label: "Restock Alerts", icon: <FaBell />, path: "/restock-alerts" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-center text-green-500 mb-12">Supplier Management Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={() => navigate(feature.path)}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col items-center text-center"
          >
            <div className="text-3xl text-green-300 mb-3">{feature.icon}</div>
            <h2 className="text-lg font-semibold text-gray-700">{feature.label}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add-supplier" element={<AddSupplier />} />
      <Route path="/supplier-list" element={<SupplierList />} />
      <Route path="/performance-report" element={<PerformanceReport />} />
      <Route path="/purchase-order" element={<PurchaseOrder />} />
      <Route path="/restock-alerts" element={<RestockAlerts />} />
    </Routes>
  );
};

export default App;
