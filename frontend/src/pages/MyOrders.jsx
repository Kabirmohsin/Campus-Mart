import React from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/Orders/OrderCard';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

const MyOrders = () => {
  const { getUserOrders } = useOrders();
  const { user } = useAuth();
  
  const orders = getUserOrders(user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Track and manage your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;