import React from 'react';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({ items }) => {
  const { getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item._id} className="flex items-center space-x-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 text-sm truncate">
                {item.name}
              </h4>
              <p className="text-gray-600 text-sm">
                Qty: {item.quantity} × ${item.price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 text-sm">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 text-sm mb-2">Payment Method</h4>
        <p className="text-blue-700 text-sm">
          💰 Cash on Delivery
        </p>
        <p className="text-blue-600 text-xs mt-1">
          Pay when you receive your items. No online payment required.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;