import React, { useEffect, useState } from 'react';
import api from '../axios';
import AddSupplier from './AddSupplier';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierToEdit, setSupplierToEdit] = useState(null); // State to hold the supplier being edited

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

  const handleSupplierUpdated = (updatedSupplier) => {
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier.supplierId === updatedSupplier.supplierId ? updatedSupplier : supplier
      )
    );
    setSupplierToEdit(null); // Clear the supplier being edited
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await api.delete(`/suppliers/${supplierId}`);
      setSuppliers((prevSuppliers) => prevSuppliers.filter(supplier => supplier.supplierId !== supplierId));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleEditSupplier = (supplier) => {
    setSupplierToEdit(supplier); // Set the supplier to be edited
  };

  return (
    <div>
      <AddSupplier 
        onSupplierAdded={handleSupplierAdded} 
        supplierToEdit={supplierToEdit} 
        onSupplierUpdated={handleSupplierUpdated} 
      /> {/* Pass the callback and supplier to edit */}
      <h2>Supplier Database</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Product Name</th>
            <th>Price</th>
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
                <button onClick={() => handleEditSupplier(supplier)}>Edit</button> {/* Edit button */}
                <button onClick={() => handleDeleteSupplier(supplier.supplierId)}>Delete</button> {/* Delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
