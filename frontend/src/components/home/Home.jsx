import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import Header from '../home/Header';

// API base URL - default to localhost if not specified
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Frozen Foods', 'Gas']);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    
    // Fetch products from the API instead of using dummy data
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/inventory/products`);
        // Filter out inactive products
        const activeProducts = data.filter(product => product.isActive !== false);
        setProducts(activeProducts);
        
        // Extract unique categories from actual products
        const uniqueCategories = [...new Set(activeProducts.map(product => product.category))];
        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For special offers, identify products with lower price than usual
  // We'll consider items with highest price difference as featured
  const featuredProducts = products
    .filter(product => product.currentStock > 0) // Only show in-stock items
    .sort((a, b) => b.price - a.price) // Sort by highest price
    .slice(0, 4); // Take top 4 as featured

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Use the new Header component */}
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={cartCount}
      />

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-4 min-w-[140px] cursor-pointer hover:shadow-lg transition-all text-center"
              onClick={() => setSearchTerm(category)}
            >
              <div className="font-medium">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products - Show top products as special offers */}
      {featuredProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-500 relative">
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                  FEATURED
                </span>
                <div className="h-40 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded ${showType === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setShowType('grid')}
            >
              Grid
            </button>
            <button 
              className={`px-3 py-1 rounded ${showType === 'table' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setShowType('table')}
            >
              Table
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No products found matching "{searchTerm}"</p>
          </div>
        ) : showType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                  {product.currentStock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={addToCart}
                      disabled={product.currentStock <= 0}
                      className={`bg-green-600 text-white px-3 py-1 rounded ${
                        product.currentStock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border p-2 text-left">Product</th>
                  <th className="border p-2 text-left">Category</th>
                  <th className="border p-2 text-left">Price</th>
                  <th className="border p-2 text-left">Stock</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 flex items-center gap-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      {product.name}
                    </td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="p-2">
                      {product.currentStock > 0 ? (
                        <span className="text-green-600">{product.currentStock} {product.unit}(s)</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link to={`/products/${product._id}`}>
                          <BsInfoCircle className="text-blue-600 text-xl" />
                        </Link>
                        <button 
                          onClick={addToCart}
                          disabled={product.currentStock <= 0}
                          className={product.currentStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          <MdOutlineAddBox className="text-green-600 text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
