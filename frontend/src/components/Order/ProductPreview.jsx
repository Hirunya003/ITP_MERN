import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../Spinner';
import Header from '../home/Header';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555';

const ProductPreview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(''); // NEW: State to manage image source

  useEffect(() => {
    const fetchProduct = async () => {
      if (!user || !user.token) {
        setError('Please log in to view product details.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_BASE_URL}/api/inventory/products/${productId}`, config);
        if (!data) {
          throw new Error('Product not found');
        }
        setProduct(data);
        setImageSrc(data.image || 'https://via.placeholder.com/150?text=No+Image'); // NEW: Set initial image source
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, user, navigate]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const productWithQuantity = { ...product, quantity };
      addToCart(productWithQuantity);
      navigate('/cart', { state: { addedProduct: product.name } });
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0 && newQuantity <= (product?.currentStock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // NEW: Handle image loading error
  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/150?text=No+Image');
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!product) return <div className="text-gray-500 text-center py-8">Product not found</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Header searchTerm="" setSearchTerm={() => {}} cartCount={cart.items.length} />

      <div className="max-w-5xl mx-auto mt-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={imageSrc} // MODIFIED: Use state variable for image source
              alt={product.name}
              className="w-full h-80 object-contain rounded-lg"
              onError={handleImageError} // MODIFIED: Simplified onError handler
            />
          </div>
          {/* Product Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
              <p className="text-gray-600 mb-3">Category: {product.category}</p>
              <p className="text-gray-600 mb-4">{product.description || 'No description available.'}</p>
              <p className="text-green-600 font-bold text-2xl mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-4">
                {product.currentStock > 0 ? (
                  <span className="text-green-500">In Stock ({product.currentStock} available)</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>
            </div>

            <div>
              {product.currentStock > 0 && (
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 bg-gray-100">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
                    disabled={quantity >= product.currentStock}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-lg text-white ${
                  product.currentStock > 0
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={product.currentStock <= 0}
              >
                {product.currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;