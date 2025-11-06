import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, Eye, Plus, Star, Users, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching seller dashboard data...');

        let sellerProducts = [];
        try {
          const productsResponse = await productService.getAllProducts();
          const allProducts = productsResponse.products || [];
          sellerProducts = allProducts.filter(product => {
            const isSellerProduct =
              product.seller?._id === user?._id ||
              product.seller === user?._id ||
              product.sellerName === user?.name;
            return isSellerProduct;
          });
        } catch (productError) {
          console.error('Error fetching products:', productError);
          sellerProducts = [];
        }

        setProducts(sellerProducts);

        let sellerOrders = [];
        try {
          const ordersResponse = await orderService.getSellerOrders();
          sellerOrders = ordersResponse.orders || [];
        } catch (orderError) {
          console.error('Error fetching orders:', orderError);
          sellerOrders = [];
        }

        setOrders(sellerOrders);
      } catch (error) {
        console.error('❌ Error fetching seller data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const ordersResponse = await orderService.getSellerOrders();
        setOrders(ordersResponse.orders || []);
      } catch (error) {
        console.error('Error refreshing orders:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await productService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p._id !== productId));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Delete product error:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const sellerProducts = products;
  const activeProducts = sellerProducts.filter(product => product.stock > 0);
  const outOfStockProducts = sellerProducts.filter(product => product.stock === 0);

  const totalRevenue = orders.reduce((total, order) => {
    if (order.sellerTotal) return total + order.sellerTotal;

    const sellerItems = order.items?.filter(item =>
      sellerProducts.some(product =>
        product._id === item.product?._id || product._id === item.product
      )
    ) || [];

    return total + sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, 0);

  const totalSales = orders.reduce((total, order) => {
    if (order.itemCount) return total + order.itemCount;

    const sellerItems = order.items?.filter(item =>
      sellerProducts.some(product =>
        product._id === item.product?._id || product._id === item.product
      )
    ) || [];

    return total + sellerItems.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const totalViews = sellerProducts.reduce((total, product) => total + (product.views || 0), 0);

  const recentOrders = orders
    .filter(order => {
      const hasSellerItems = order.items?.some(item =>
        sellerProducts.some(product =>
          product._id === item.product?._id || product._id === item.product
        )
      );
      return hasSellerItems;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Package,
      label: 'Active Listings',
      value: activeProducts.length,
      color: 'bg-blue-500',
      description: 'Products available for sale'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      color: 'bg-green-500',
      description: 'Total earnings from sales'
    },
    {
      icon: ShoppingCart,
      label: 'Total Sales',
      value: totalSales,
      color: 'bg-purple-500',
      description: 'Items sold to buyers'
    },
    {
      icon: Eye,
      label: 'Product Views',
      value: totalViews.toLocaleString(),
      color: 'bg-yellow-500',
      description: 'Total views on your products'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your products and track your sales.
            </p>
          </div>
          <Link
            to="/sell-product"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Seller Profile Card */}
        <div className="mt-6 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{user?.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-blue-100">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    <span>{user?.rating || 5.0} Seller Rating</span>
                  </div>
                  <span>•</span>
                  <span>{totalSales} Sales</span>
                  <span>•</span>
                  <span>{activeProducts.length} Active Listings</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-blue-100">Total Earnings</p>
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

      {/* The rest of your dashboard code remains unchanged */}
      {/* (Products, Orders, Quick Actions etc.) */}
    </div>
  );
};

export default SellerDashboard;
