import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartSummary = () => {
  const { getCartTotal, getCartItemsCount, getCartItems } = useCart();
  const { user } = useAuth();
  
  const cartItems = getCartItems();
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.00 : 0; // Flat rate shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({getCartItemsCount()})</span>
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
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-semibold">
            <span className="text-gray-800">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {user ? (
        <Link
          to="/checkout"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center block"
        >
          Proceed to Checkout
        </Link>
      ) : (
        <Link
          to="/login"
          className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 text-center block"
        >
          Login to Checkout
        </Link>
      )}

      <div className="mt-4 text-center">
        <Link
          to="/products"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Payment Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 text-sm mb-2">Cash on Delivery</h4>
        <p className="text-blue-700 text-xs">
          Pay when you receive your items. No online payment required.
        </p>
      </div>
    </div>
  );
};

export default CartSummary;