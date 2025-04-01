import React, { useState, useEffect } from 'react';
import api from '../axios';

const AddSupplier = ({ onSupplierAdded, supplierToEdit, onSupplierUpdated }) => {
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  useEffect(() => {
    if (supplierToEdit) {
      setSupplierName(supplierToEdit.supplierName);
      setEmail(supplierToEdit.contact.email);
      setPhone(supplierToEdit.contact.phone);
      setProductName(supplierToEdit.productName);
      setCostPrice(supplierToEdit.costPrice);
      setSellingPrice(supplierToEdit.sellingPrice);
    } else {
      // Reset the form if no supplier is being edited
      setSupplierName('');
      setEmail('');
      setPhone('');
      setProductName('');
      setCostPrice('');
      setSellingPrice('');
    }
  }, [supplierToEdit]);

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

      if (supplierToEdit) {
        // Update existing supplier
        const res = await api.put(`/suppliers/${supplierToEdit.supplierId}`, newSupplier);
        onSupplierUpdated(res.data); // Call the function passed as a prop to update the supplier list
      } else {
        // Add new supplier
        const res = await api.post('/suppliers', newSupplier);
        onSupplierAdded(res.data); // Call the function passed as a prop to update the supplier list
      }

      // Clear the form fields
      setSupplierName('');
      setEmail('');
      setPhone('');
      setProductName('');
      setCostPrice('');
      setSellingPrice('');
    } catch (error) {
      console.error('Error adding/updating supplier:', error);
    }
  };

  return (
    <div>
      <h2>{supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}</h2>
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
        <button type="submit">{supplierToEdit ? 'Update Supplier' : 'Add Supplier'}</button>
      </form>
    </div>
  );
};

export default AddSupplier;
