import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Package, MapPin, Phone, Mail } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import OrderStatus from '../components/Orders/OrderStatus';
import OrderTracking from '../components/Orders/OrderTracking';

const OrderDetails = () => {
  const { id } = useParams();
  const { getOrderById } = useOrders();
  
  const order = getOrderById(id);

  // ✅ FIX: Safe number formatting function
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return Number(price).toFixed(2);
  };

  // ✅ FIX: Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // ✅ FIX: Validate order data
  const safeOrder = order ? {
    _id: order._id || id,
    createdAt: order.createdAt || new Date().toISOString(),
    status: order.status || 'unknown',
    items: Array.isArray(order.items) ? order.items : [],
    totalAmount: order.totalAmount || 0,
    subtotal: order.subtotal || 0,
    shipping: order.shipping || 0,
    tax: order.tax || 0,
    shippingInfo: order.shippingInfo || {
      firstName: 'Not',
      lastName: 'Available',
      address: 'Not available',
      city: 'Not available',
      state: 'Not available',
      zipCode: 'Not available',
      phone: 'Not available',
      email: 'Not available',
      instructions: ''
    }
  } : null;

  console.log('📋 OrderDetails: Order data:', safeOrder);

  if (!safeOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            to="/my-orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/my-orders"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <span>← Back to Orders</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Order #{safeOrder._id.slice(-8)}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(safeOrder.createdAt)}</span>
              </div>
              <OrderStatus status={safeOrder.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
        <OrderTracking status={safeOrder.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {safeOrder.items.map((item, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.name || 'Unnamed Product'}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.category || 'No category'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Condition: {item.condition || 'Not specified'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {/* ✅ FIX: Safe price calculation */}
                        ${formatPrice((item.price || 0) * (item.quantity || 1))}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity || 1} × ${formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {safeOrder.items.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No items found in this order
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {/* ✅ FIX: Safe toFixed */}
                  ${formatPrice(safeOrder.subtotal)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {safeOrder.shipping > 0 ? `$${formatPrice(safeOrder.shipping)}` : 'Free'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  {/* ✅ FIX: Safe toFixed */}
                  ${formatPrice(safeOrder.tax)}
                </span>
              </div>
              
              <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>
                  {/* ✅ FIX: Safe toFixed - YAHAN THA ERROR */}
                  ${formatPrice(safeOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">
                    {safeOrder.shippingInfo.firstName} {safeOrder.shippingInfo.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{safeOrder.shippingInfo.address}</p>
                  <p className="text-gray-600 text-sm">
                    {safeOrder.shippingInfo.city}, {safeOrder.shippingInfo.state} {safeOrder.shippingInfo.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-sm">{safeOrder.shippingInfo.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-sm">{safeOrder.shippingInfo.email}</span>
              </div>
            </div>

            {safeOrder.shippingInfo.instructions && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 text-sm mb-1">Special Instructions</h4>
                <p className="text-blue-700 text-sm">{safeOrder.shippingInfo.instructions}</p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">$</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-gray-600 text-sm">Pay when you receive your items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;