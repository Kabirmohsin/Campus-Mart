import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, MapPin, Shield, Truck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, getCartItems } = useCart();
  const { user } = useAuth();
  
  const product = getProductById(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image]; // Mock multiple images

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const cartItems = getCartItems();
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem && (existingItem.quantity + quantity) > product.stock) {
      toast.error(`Only ${product.stock} items available in total`);
      return;
    }

    // Add the product multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(product.category)}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-700">{product.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-green-600 font-semibold">In Stock ({product.stock})</span>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Condition:</span>
                <span className="font-medium text-gray-800">{product.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-medium text-gray-800">{product.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-800 capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className="font-medium text-green-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Max: {product.stock} items
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure Transaction</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* This would typically show related products */}
          <div className="text-center py-8 text-gray-500">
            Related products would appear here
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;