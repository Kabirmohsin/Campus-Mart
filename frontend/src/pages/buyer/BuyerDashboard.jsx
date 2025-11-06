import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Star, Heart, Clock, TrendingUp, MapPin, Eye, Plus } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const { orders } = useOrders();
  const { user } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();

  const userOrders = orders.filter(order => order.userId === user?.id);
  const pendingOrders = userOrders.filter(order => order.status === 'pending' || order.status === 'confirmed');
  const deliveredOrders = userOrders.filter(order => order.status === 'delivered');

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: userOrders.length,
      color: 'bg-blue-500',
      description: 'All your purchases'
    },
    {
      icon: Package,
      label: 'Pending Orders',
      value: pendingOrders.length,
      color: 'bg-yellow-500',
      description: 'Awaiting delivery'
    },
    {
      icon: Star,
      label: 'Delivered Orders',
      value: deliveredOrders.length,
      color: 'bg-green-500',
      description: 'Successfully received'
    },
    {
      icon: TrendingUp,
      label: 'Total Spent',
      value: `$${userOrders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}`,
      color: 'bg-purple-500',
      description: 'Overall spending'
    }
  ];

  const recommendedProducts = products.slice(0, 6);
  const recentProducts = products.slice(6, 12);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickBuy = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    // You can redirect to cart page here if needed
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Buyer Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Track your orders and discover new products.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Buyer Profile Card */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{user?.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-green-100">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user?.campus || 'University Campus'}</span>
                  </div>
                  <span>•</span>
                  <span>{userOrders.length} Orders Completed</span>
                  <span>•</span>
                  <span>Member since 2024</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{userOrders.length}</div>
              <p className="text-green-100">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link
                to="/my-orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {userOrders.slice(0, 5).map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="p-4 hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order._id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
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
              </Link>
            ))}
            {userOrders.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No orders yet</p>
                <p className="text-sm text-gray-400">Your orders will appear here</p>
                <Link
                  to="/products"
                  className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended For You */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recommended For You</h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                See All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recommendedProducts.map((product) => (
              <div key={product._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`}>
                      <p className="font-medium text-gray-800 truncate hover:text-blue-600">{product.name}</p>
                    </Link>
                    <p className="text-sm text-gray-600">${product.price} • {product.seller}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-yellow-600">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{product.views || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleQuickBuy(product)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">New Arrivals</h2>
          <p className="text-sm text-gray-600 mt-1">Fresh products added by sellers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {recentProducts.map((product) => (
            <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
              <p className="text-lg font-bold text-gray-900 mb-2">${product.price}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">{product.seller}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${product._id}`}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <ShoppingBag className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Browse Products</p>
            <p className="text-sm text-gray-500">Find textbooks and gadgets</p>
          </Link>
          <Link
            to="/my-orders"
            className="p-4 border-2 border-dashed border-green-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Package className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Track Orders</p>
            <p className="text-sm text-gray-500">Check order status</p>
          </Link>
          <Link
            to="/sell-product"
            className="p-4 border-2 border-dashed border-purple-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="font-medium text-gray-700">Become a Seller</p>
            <p className="text-sm text-gray-500">Start selling your items</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;