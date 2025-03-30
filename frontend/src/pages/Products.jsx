import { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/home/Header';
import Spinner from '../components/Spinner';
import { FiSearch, FiGrid, FiList, FiShoppingCart } from 'react-icons/fi';

// API base URL - default to localhost if not specified
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [cartCount, setCartCount] = useState(0);

  // Fetch products from the inventory
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Add authorization header if user is logged in
        const config = user ? {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        } : {};

        const { data } = await axios.get(`${API_BASE_URL}/api/inventory/products`, config);
        setProducts(data.filter(product => product.isActive !== false));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Show appropriate error based on authentication status
        if (error.response && error.response.status === 401) {
          enqueueSnackbar('Please login to view products', { variant: 'warning' });
        } else {
          enqueueSnackbar('Failed to load products', { variant: 'error' });
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, [enqueueSnackbar, user]);

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  // Add to cart functionality (placeholder)
  const addToCart = (product) => {
    setCartCount(prev => prev + 1);
    enqueueSnackbar(`${product.name} added to cart`, { variant: 'success' });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartCount={cartCount} />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">All Products</h2>
          
          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button
                className={`p-2 ${viewType === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewType('grid')}
              >
                <FiGrid />
              </button>
              <button
                className={`p-2 ${viewType === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setViewType('list')}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            {searchTerm ? (
              <>
                <p className="text-gray-500 mb-2">No products found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-green-600 hover:text-green-700"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p className="text-gray-500">No products available at this time.</p>
            )}
          </div>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden border border-transparent hover:border-gray-200"
              >
                <div className="h-40 overflow-hidden bg-gray-100 relative">
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
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="ml-1 font-medium text-gray-900">${product.price.toFixed(2)}</span>
                    </div>
                    {product.currentStock > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">In Stock:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {product.currentStock} {product.unit}(s)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {product.expiryDate && (
                    <div className="text-xs text-gray-500 mb-3">
                      Expires: {new Date(product.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.currentStock <= 0}
                    className={`mt-2 w-full flex items-center justify-center py-2 rounded-md ${
                      product.currentStock > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.currentStock > 0 ? (
                          <div className="text-sm text-gray-900">
                            {product.currentStock} {product.unit}(s)
                          </div>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.currentStock <= 0}
                          className={`inline-flex items-center px-3 py-1 rounded ${
                            product.currentStock > 0
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <FiShoppingCart className="mr-1" /> Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
