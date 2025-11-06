import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';

const AdminDashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();

  const stats = [
    {
      icon: Package,
      label: 'Total Products',
      value: products.length,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: orders.length,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      icon: Users,
      label: 'Total Users',
      value: '1,250',
      color: 'bg-purple-500',
      link: '/admin/users'
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: `$${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}`,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    }
  ];

  const recentOrders = orders.slice(0, 5);
  const popularProducts = products.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your administration panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Order #{order._id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Popular Products</h2>
              <Link
                to="/admin/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No products yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/add"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Add New Product</p>
          </Link>
          <Link
            to="/admin/orders"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Manage Orders</p>
          </Link>
          <Link
            to="/admin/users"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">View Users</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;