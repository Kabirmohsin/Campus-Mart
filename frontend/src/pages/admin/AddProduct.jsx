import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ArrowLeft, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'textbook',
    condition: 'Like New',
    seller: '',
    stock: '1',
    image: '/api/placeholder/300/400'
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'textbook', label: 'Textbook' },
    { value: 'gadget', label: 'Gadget' },
    { value: 'notes', label: 'Notes' }
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Digital'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: 4.5 // Default rating
      };

      addProduct(productData);
      toast.success('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      console.error('Add product error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
        <p className="text-gray-600">Add a new product to the marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="1"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Seller */}
            <div>
              <label htmlFor="seller" className="block text-sm font-medium text-gray-700 mb-2">
                Seller Name *
              </label>
              <input
                type="text"
                id="seller"
                name="seller"
                required
                value={formData.seller}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter seller name"
              />
            </div>

            {/* Image Upload (Mock) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Image upload functionality would be implemented here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Currently using placeholder images
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;