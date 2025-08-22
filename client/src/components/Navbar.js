import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { selectCartItemsCount } from '../features/cart/cartSlice';
import { logout } from '../features/user/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartItemsCount);
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            E-Commerce Store
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="hover:text-primary-200">
              Products
            </Link>

            <Link to="/cart" className="relative hover:text-primary-200">
              <FaShoppingCart className="text-xl" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/orders" className="hover:text-primary-200">
                  My Orders
                </Link>
                {currentUser.isAdmin && (
                  <Link to="/admin" className="hover:text-primary-200">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <FaUser />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-primary-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-primary-200">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;