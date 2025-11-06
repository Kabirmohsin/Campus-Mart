import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, getCartItems } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    const cartItems = getCartItems();
    
    // ✅ YEH LINE CHANGE KARO:
    const existingItem = cartItems.find(item => item.product?._id === product._id || item._id === product._id);
    
    if (existingItem && existingItem.quantity >= product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    addToCart(product);
  };

  // Baaki sab code same hai...
  const getCategoryColor = (category) => {
    switch (category) {
      case 'textbook':
        return 'bg-blue-100 text-blue-800';
      case 'gadget':
        return 'bg-green-100 text-green-800';
      case 'notes':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'textbook':
        return '📚';
      case 'gadget':
        return '💻';
      case 'notes':
        return '📝';
      default:
        return '📦';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          <img
            src={product.image || '/api/placeholder/300/200'}
            alt={product.name}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
            {getCategoryIcon(product.category)} {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded ${
            product.condition === 'Like New' ? 'bg-green-100 text-green-800' :
            product.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
            product.condition === 'Very Good' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {product.condition}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{product.seller}</span>
          </div>
          <span>Stock: {product.stock}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors duration-200 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;