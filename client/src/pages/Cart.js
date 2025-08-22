import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateCartItemQty,
} from '../features/cart/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { currentUser } = useSelector((state) => state.user);

  const handleQuantityChange = (productId, qty) => {
    dispatch(updateCartItemQty({ productId, qty: Number(qty) }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    if (currentUser) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-lg shadow-md p-6 mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.product.images[0]?.url || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="text-lg font-semibold hover:text-primary-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600">{item.product.brand}</p>
                  <p className="text-primary-600 font-bold">${item.product.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      handleQuantityChange(item.product._id, e.target.value)
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    {[...Array(Math.min(10, item.product.countInStock))].map(
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${cartTotal > 50 ? '0.00' : '10.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      cartTotal +
                      (cartTotal > 50 ? 0 : 10) +
                      cartTotal * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;