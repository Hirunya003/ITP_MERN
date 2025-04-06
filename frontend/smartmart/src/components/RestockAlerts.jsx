import React, { useEffect, useState } from 'react';
import api from '../axios';


const RestockAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await api.get('/restock-alerts');
      setAlerts(res.data);
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Restocking Alerts</h2>
      {alerts.length === 0 ? (
        <p>No low stock items.</p>
      ) : (
        <ul>
          {alerts.map((item) => (
            <li key={item.itemId}>
              {item.itemName} (Stock: {item.stockLevel}) - Contact {item.supplierId.supplierName} ({item.supplierId.contact})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestockAlerts;