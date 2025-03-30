import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import Header from '../home/Header';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Frozen Foods']);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch from your API
    setTimeout(() => {
      const dummyProducts = [
        { _id: '1', name: 'Fresh Apples', category: 'Fruits', price: 2.99, discount: false, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6' },
        { _id: '2', name: 'Organic Bananas', category: 'Fruits', price: 1.99, discount: true, discountPrice: 1.49, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224' },
        { _id: '3', name: 'Whole Milk', category: 'Dairy', price: 3.49, discount: false, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b' },
        { _id: '4', name: 'Fresh Bread', category: 'Bakery', price: 2.49, discount: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff' },
        { _id: '5', name: 'Chicken Breast', category: 'Meat', price: 5.99, discount: true, discountPrice: 4.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791' },
        { _id: '6', name: 'Carrots', category: 'Vegetables', price: 1.29, discount: false, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a' },
        { _id: '7', name: 'Frozen Pizza', category: 'Frozen Foods', price: 4.99, discount: true, discountPrice: 3.99, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
        { _id: '8', name: 'Ice Cream', category: 'Frozen Foods', price: 3.99, discount: false, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f' }
      ];
      setProducts(dummyProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredProducts = products.filter(product => product.discount);

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

      {/* Special Offers */}
      {featuredProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-500 relative">
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                  SALE
                </span>
                <div className="h-40 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-red-500">${product.discountPrice.toFixed(2)}</span>
                    <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
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
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    {product.discount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-red-500">${product.discountPrice.toFixed(2)}</span>
                        <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                    )}
                    <button 
                      onClick={addToCart}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
                      />
                      {product.name}
                    </td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">
                      {product.discount ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-red-500">${product.discountPrice.toFixed(2)}</span>
                          <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Link to={`/products/${product._id}`}>
                          <BsInfoCircle className="text-blue-600 text-xl" />
                        </Link>
                        <button onClick={addToCart}>
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
