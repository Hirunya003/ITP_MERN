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
            <th>Cost Price</th>
            <th>Selling Price</th>
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
              <td>{supplier.costPrice}</td>
              <td>{supplier.sellingPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
