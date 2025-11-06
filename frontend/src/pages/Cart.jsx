import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import EmptyCart from '../components/Cart/EmptyCart';

const Cart = () => {
  const { getCartItems, getCartItemsCount, getCartTotal } = useCart();
  const { user } = useAuth();
  
  const cartItems = getCartItems();
  const itemCount = getCartItemsCount();
  const subtotal = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Cart Items</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item._id} className="p-6">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

      {/* Trust Message */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">Why Shop with CampusMart?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Cash on Delivery Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Verified Student Sellers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Campus-Wide Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;