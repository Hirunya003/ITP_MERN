import React from 'react';
import SupplierList from './components/SupplierList';
import RestockAlerts from './components/RestockAlerts';
import PurchaseOrder from './components/PurchaseOrder';
import PerformanceReport from './components/PerformanceReport';

const App = () => {
  return (
    <div>
      <h1>Supplier Management Dashboard</h1>
      <SupplierList />
      <RestockAlerts />
      <PurchaseOrder />
      <PerformanceReport />
    </div>
  );
};

export default App;