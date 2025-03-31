import { useState } from 'react';
import { useSnackbar } from 'notistack';

const StockAdjustment = ({ product, onAdjustStock, onCancel }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    quantity: '',
    changeType: 'add',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantity || formData.quantity <= 0) {
      enqueueSnackbar('Please enter a valid quantity', { variant: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAdjustStock(formData);
      setIsSubmitting(false);
      setFormData({
        quantity: '',
        changeType: 'add',
        notes: ''
      });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adjust Stock: {product.name}</h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-gray-700 font-medium">Current Stock:</span>
          <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{product.currentStock} {product.unit}(s)</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-700 font-medium">Minimum Stock Level:</span>
          <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{product.minStock} {product.unit}(s)</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Adjustment Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="changeType"
                value="add"
                checked={formData.changeType === 'add'}
                onChange={handleChange}
                className="mr-2"
              />
              Add Stock
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="changeType"
                value="remove"
                checked={formData.changeType === 'remove'}
                onChange={handleChange}
                className="mr-2"
              />
              Remove Stock
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="changeType"
                value="adjust"
                checked={formData.changeType === 'adjust'}
                onChange={handleChange}
                className="mr-2"
              />
              Set Exact Value
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Quantity ({formData.changeType === 'adjust' ? 'New Total' : ''})
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
            placeholder="Reason for adjustment, delivery reference, etc."
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Update Stock'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockAdjustment;
