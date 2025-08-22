import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
const fetchFeaturedProducts = async () => {
  try {
    const response = await axios.get('/products?limit=6');

    // حماية من أي response مش Array
    setFeaturedProducts(
      Array.isArray(response.data) ? response.data.slice(0, 6) :
      Array.isArray(response.data.products) ? response.data.products.slice(0, 6) :
      [] // fallback لو response مش array
    );

  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to E-Commerce Store</h1>
          <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
          <Link
            to="/products"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-flex items-center"
          >
            Shop Now
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Clothing', 'Footwear', 'Bags'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">
                  {category === 'Electronics' && '💻'}
                  {category === 'Clothing' && '👕'}
                  {category === 'Footwear' && '👟'}
                  {category === 'Bags' && '👜'}
                </div>
                <h3 className="text-lg font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 inline-flex items-center"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
