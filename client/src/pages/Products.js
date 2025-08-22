import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '');

  const categories = ['Electronics', 'Clothing', 'Footwear', 'Bags'];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');

      // جذرية: مهما كان شكل response يتحول Array
      const productsArray = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.products)
          ? response.data.products
          : [];

      setProducts(productsArray);

      console.log('Products fetched:', productsArray); // للمتابعة
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // fallback
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSelectedCategory(category);
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    setSortBy(value);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700"
            >
              <FaSearch />
            </button>
          </form>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
