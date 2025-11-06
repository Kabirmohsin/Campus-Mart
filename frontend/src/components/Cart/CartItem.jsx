import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductImage from '../Products/ProductImage';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // ✅ Extract product data from different structures
  const product = item.product || item; // Backend: item.product, Local: item
  const productId = product._id;
  const productName = product.name;
  const productImage = product.image;
  const productCategory = product.category;
  const productCondition = product.condition;
  const productPrice = item.price || product.price;
  const productStock = product.stock;

  const handleIncrease = () => {
    console.log('➕ INCREASE CLICKED for:', productId, 'Current:', item.quantity);
    updateQuantity(productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    console.log('➖ DECREASE CLICKED for:', productId, 'Current:', item.quantity);
    if (item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleRemove = () => {
    console.log('🗑️ REMOVE CLICKED for:', productId);
    removeFromCart(productId);
  };

  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg p-4 border border-gray-200">
      {/* Product Image */}
      <Link to={`/product/${productId}`} className="shrink-0">
        <ProductImage
          src={productImage}
          alt={productName}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${productId}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors truncate">
            {productName}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1">{productCategory}</p>
        <p className="text-gray-500 text-sm">Condition: {productCondition}</p>
        
        {/* Debug Info */}
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p>Debug: ID: {productId}</p>
          <p>Current Qty: {item.quantity}</p>
          <p>Stock: {productStock || 'N/A'}</p>
          <p>Structure: {item.product ? 'Backend' : 'Local'}</p>
        </div>
      </div>

      {/* Controls and Price */}
      <div className="flex items-center space-x-4">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-3 border border-gray-300 rounded-lg p-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="w-8 text-center font-semibold text-gray-800 text-lg">
            {item.quantity}
          </span>
          
          <button
            onClick={handleIncrease}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Price */}
        <div className="text-right min-w-20">
          <p className="font-semibold text-gray-900 text-lg">
            ${(productPrice * item.quantity).toFixed(2)}
          </p>
          {item.quantity > 1 && (
            <p className="text-sm text-gray-500">
              ${productPrice} each
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;