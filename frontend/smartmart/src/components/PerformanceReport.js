import React, { useState, useEffect } from 'react';
import api from '../axios';

const PerformanceReport = () => {
  const [supplierId, setSupplierId] = useState('');
  const [performance, setPerformance] = useState(null);

  const fetchPerformance = async () => {
    const res = await api.get(`/supplier-performance/${supplierId}`);
    setPerformance(res.data);
  };

  return (
    <div>
      <h2>Supplier Performance</h2>
      <input
        type="text"
        placeholder="Enter Supplier ID"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
      />
      <button onClick={fetchPerformance}>Get Report</button>
      {performance && (
        <div>
          <p>Delivery Time: {performance.deliveryTime} days</p>
          <p>Quality Rating: {performance.qualityRating}/5</p>
          <p>Order Accuracy: {performance.orderAccuracy}%</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceReport;