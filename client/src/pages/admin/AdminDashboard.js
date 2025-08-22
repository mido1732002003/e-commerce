import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <FaBox className="text-4xl text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, or delete products</p>
        </Link>

        <Link
          to="/admin/products/new"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
                    <FaPlus className="text-4xl text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
          <p className="text-gray-600">Create a new product listing</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <FaShoppingCart className="text-4xl text-primary-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">--</p>
            <p className="text-gray-600">Total Products</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">--</p>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">--</p>
            <p className="text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;