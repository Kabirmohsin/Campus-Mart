import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-6 rounded-full">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to find great deals on textbooks, gadgets, and notes.
      </p>
      
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Start Shopping</span>
      </Link>
    </div>
  );
};

export default EmptyCart;