import React, { useEffect, useState } from 'react';
import api from '../axios';
import AddSupplier from './AddSupplier'; // Import the AddSupplier component

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    };
    fetchSuppliers();
  }, []);

  const handleSupplierAdded = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await api.delete(`/suppliers/${supplierId}`);
      setSuppliers((prevSuppliers) => prevSuppliers.filter(supplier => supplier.supplierId !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div>
      <AddSupplier onSupplierAdded={handleSupplierAdded} /> {/* Pass the callback */}
      <h2>Supplier Database</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Product Name</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.supplierId}>
              <td>{supplier.supplierId}</td>
              <td>{supplier.supplierName}</td>
              <td>
                {supplier.contact.email} {supplier.contact.phone ? `(${supplier.contact.phone})` : ''}
              </td>
              <td>{supplier.productName}</td>
              <td>{supplier.costPrice}</td>
              <td>{supplier.sellingPrice}</td>
              <td>
                <button onClick={() => handleDeleteSupplier(supplier.supplierId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
