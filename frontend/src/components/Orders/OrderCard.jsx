import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight } from 'lucide-react';
import OrderStatus from './OrderStatus';

const OrderCard = ({ order }) => {
  // ✅ FIX: Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // ✅ FIX: Safe total items calculation
  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // ✅ FIX: Safe price formatting
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0.00';
    }
    return Number(price).toFixed(2);
  };

  // ✅ FIX: Validate order data
  const safeOrder = {
    _id: order?._id || 'unknown',
    createdAt: order?.createdAt || new Date().toISOString(),
    status: order?.status || 'unknown',
    items: Array.isArray(order?.items) ? order.items : [],
    totalAmount: order?.totalAmount || 0
  };

  console.log('🛒 OrderCard: Rendering order:', safeOrder);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Order #{safeOrder._id.slice(-8)} {/* Show only last 8 chars */}
              </h3>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(safeOrder.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="h-4 w-4" />
                  <span>{getTotalItems(safeOrder.items)} items</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 sm:mt-0">
              <OrderStatus status={safeOrder.status} />
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="mb-4">
            {safeOrder.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center space-x-3 py-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {item.name || 'Unnamed Product'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity || 1} × ${formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
            {safeOrder.items.length > 2 && (
              <p className="text-sm text-gray-500 mt-2">
                +{safeOrder.items.length - 2} more items
              </p>
            )}
            
            {safeOrder.items.length === 0 && (
              <p className="text-sm text-gray-500 py-2">No items in this order</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {/* ✅ FIX: Safe toFixed usage */}
                ${formatPrice(safeOrder.totalAmount)}
              </p>
            </div>
            
            <Link
              to={`/order/${safeOrder._id}`}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;