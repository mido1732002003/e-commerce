import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/order/orderSlice';
import Loader from '../components/Loader';
import moment from 'moment';
import { FaBox } from 'react-icons/fa';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Canceled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
        <p className="text-gray-600">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold">{order._id}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {moment(order.createdAt).format('MMMM DD, YYYY')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center">
                    <img
                      src={item.product?.images[0]?.url || 'https://via.placeholder.com/50'}
                      alt={item.product?.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.qty} × ${item.price}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.qty * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Shipping Address</p>
                  <p className="text-sm">
                    {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-primary-600">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;