import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import Header from '../components/home/Header';
import Spinner from '../components/Spinner';
import { CartContext } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/inventory/products`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartCount={cart.items.length} />

      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-gray-500 text-center text-lg py-8">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-transparent hover:border-gray-200">
              <div className="h-40 overflow-hidden bg-gray-100 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
                {product.currentStock <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Out of Stock</div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Price: <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span></span>
                  {product.currentStock > 0 && <span className="text-sm text-gray-500">Stock: {product.currentStock}</span>}
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.currentStock <= 0}
                  className={`mt-2 w-full flex items-center justify-center py-2 rounded-md ${product.currentStock > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  <FiShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;