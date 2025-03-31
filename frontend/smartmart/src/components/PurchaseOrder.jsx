import React, { useState } from 'react';
import api from '../axios';

const PurchaseOrder = () => {
  const [supplierId, setSupplierId] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post('/generate-order', { supplierId, items });
    alert(res.data.message);
  };

  return (
    <div>
      <h2>Generate Purchase Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Supplier ID"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        />
        {items.map((item, idx) => (
          <div key={idx}>
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].name = e.target.value;
                setItems(newItems);
              }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx].quantity = Number(e.target.value);
                setItems(newItems);
              }}
            />
          </div>
        ))}
        <button type="submit">Generate Order</button>
      </form>
    </div>
  );
};

export default PurchaseOrder;