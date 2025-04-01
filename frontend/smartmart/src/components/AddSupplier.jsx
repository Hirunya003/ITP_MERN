import React, { useState } from 'react';
import api from '../axios';

const AddSupplier = ({ onSupplierAdded }) => {
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSupplier = {
        supplierName,
        contact: {
          email,
          phone,
        },
        productName,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
      };

      const res = await api.post('/suppliers', newSupplier);
      onSupplierAdded(res.data); // Call the function passed as a prop to update the supplier list
      // Clear the form fields
      setSupplierName('');
      setEmail('');
      setPhone('');
      setProductName('');
      setCostPrice('');
      setSellingPrice('');
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <div>
      <h2>Add New Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Product Name:
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Cost Price:
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Selling Price:
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Add Supplier</button>
      </form>
    </div>
  )};

export default AddSupplier;
