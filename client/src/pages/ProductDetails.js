import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { addToCart } from '../features/cart/cartSlice';
import Loader from '../components/Loader';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      const data = response.data;

      // تأكد إن images Array حتى لو الـ API رجع null أو object
      setProduct({
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCart = () => {
    dispatch(addToCart({ product, qty: quantity }));
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-primary-600 mb-4">
            ${product.price}
          </p>

          <div className="mb-6">
            <span className="text-gray-700 font-semibold">Brand:</span>{' '}
            <span className="text-gray-600">{product.brand}</span>
          </div>

          <div className="mb-6">
            <span className="text-gray-700 font-semibold">Category:</span>{' '}
            <span className="text-gray-600">{product.category}</span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-gray-700 font-semibold">Availability:</span>{' '}
            <span
              className={`${
                product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {product.countInStock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-700 font-semibold">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
