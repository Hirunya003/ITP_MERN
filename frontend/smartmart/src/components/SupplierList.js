import React, { useEffect, useState } from 'react';
import api from '../axios';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    };
    fetchSuppliers();
  }, []);

  return (
    <div>
      <h2>Supplier Database</h2>
      <table>
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
              <td>{supplier.contact}</td>
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