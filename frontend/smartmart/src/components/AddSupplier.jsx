import React, { useState, useEffect } from 'react';
import api from '../axios';

const AddSupplier = ({ onSupplierAdded, supplierToEdit, onSupplierUpdated }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phone: '',
    productName: '',
    costPrice: '',
    sellingPrice: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        supplierName: supplierToEdit.supplierName,
        email: supplierToEdit.contact.email,
        phone: supplierToEdit.contact.phone || '',
        productName: supplierToEdit.productName,
        costPrice: supplierToEdit.costPrice.toString(),
        sellingPrice: supplierToEdit.sellingPrice.toString()
      });
    } else {
      setFormData({
        supplierName: '',
        email: '',
        phone: '',
        productName: '',
        costPrice: '',
        sellingPrice: ''
      });
    }
    setErrors({});
  }, [supplierToEdit]);

  const validateForm = () => {
    let tempErrors = {};
    
    if (!formData.supplierName.trim()) 
      tempErrors.supplierName = 'Supplier name is required';
    if (!formData.email) 
      tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) 
      tempErrors.email = 'Email is invalid';
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) 
      tempErrors.phone = 'Phone must be 10 digits';
    if (!formData.productName.trim()) 
      tempErrors.productName = 'Product name is required';
    if (!formData.costPrice) 
      tempErrors.costPrice = 'Cost price is required';
    else if (isNaN(formData.costPrice) || Number(formData.costPrice) <= 0) 
      tempErrors.costPrice = 'Cost price must be a positive number';
    if (!formData.sellingPrice) 
      tempErrors.sellingPrice = 'Selling price is required';
    else if (isNaN(formData.sellingPrice) || Number(formData.sellingPrice) <= 0) 
      tempErrors.sellingPrice = 'Selling price must be a positive number';
    else if (Number(formData.sellingPrice) <= Number(formData.costPrice)) 
      tempErrors.sellingPrice = 'Selling price must be greater than cost price';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const supplierData = {
        supplierName: formData.supplierName,
        contact: {
          email: formData.email,
          phone: formData.phone
        },
        productName: formData.productName,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice)
      };

      let res;
      if (supplierToEdit) {
        res = await api.put(`/suppliers/${supplierToEdit.supplierId}`, supplierData);
        onSupplierUpdated(res.data);
      } else {
        res = await api.post('/suppliers', supplierData);
        onSupplierAdded(res.data);
      }

      setFormData({
        supplierName: '',
        email: '',
        phone: '',
        productName: '',
        costPrice: '',
        sellingPrice: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding/updating supplier:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
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
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
            />
          </label>
          {errors.supplierName && <span style={{ color: 'red' }}>{errors.supplierName}</span>}
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
        </div>
        <div>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </label>
          {errors.productName && <span style={{ color: 'red' }}>{errors.productName}</span>}
        </div>
        <div>
          <label>
            Cost Price:
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              step="0.01"
            />
          </label>
          {errors.costPrice && <span style={{ color: 'red' }}>{errors.costPrice}</span>}
        </div>
        <div>
          <label>
            Selling Price:
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              step="0.01"
            />
          </label>
          {errors.sellingPrice && <span style={{ color: 'red' }}>{errors.sellingPrice}</span>}
        </div>
        {errors.submit && <div style={{ color: 'red' }}>{errors.submit}</div>}
        <button type="submit">{supplierToEdit ? 'Update Supplier' : 'Add Supplier'}</button>
      </form>
    </div>
  );
};

export default AddSupplier; 