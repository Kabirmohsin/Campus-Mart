import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Laptop, FileText, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService'; // ✅ REAL API
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

const SellProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'textbook',
    condition: 'Like New',
    stock: '1'
  });

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const categories = [
    { value: 'textbook', label: 'Textbook', icon: BookOpen },
    { value: 'gadget', label: 'Gadget', icon: Laptop },
    { value: 'notes', label: 'Notes', icon: FileText }
  ];

  const conditions = [
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Digital'
  ];

  // ✅ IMAGE UPLOAD HANDLING
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Check total images limit (max 5)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImageUploading(true);

    try {
      for (const file of files) {
        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files');
          continue;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          continue;
        }

        // Convert image to base64 for temporary preview
        const base64 = await convertToBase64(file);
        
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: base64,
          name: file.name
        }]);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // ✅ CONVERT IMAGE TO BASE64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // ✅ REMOVE IMAGE
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // ✅ UPLOAD IMAGES TO CLOUDINARY/BACKEND
  const uploadImagesToServer = async () => {
    if (images.length === 0) return [getDefaultImage(formData.category)];

    const uploadedUrls = [];
    
    for (const image of images) {
      try {
        // For now, we'll use the base64 preview as image URL
        // In production, you would upload to Cloudinary/backend here
        uploadedUrls.push(image.preview);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Failed to upload image:', error);
        // Fallback to default image if upload fails
        uploadedUrls.push(getDefaultImage(formData.category));
      }
    }

    return uploadedUrls;
  };

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
      // Validate form
      if (!formData.name.trim()) {
        toast.error('Please enter product name');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Please enter product description');
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      // Upload images
      const imageUrls = await uploadImagesToServer();
      const primaryImage = imageUrls[0] || getDefaultImage(formData.category);

      // ✅ REAL API CALL - REPLACE MOCK DATA
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        stock: parseInt(formData.stock),
        image: primaryImage,
        images: imageUrls,
        // Backend automatically adds: seller, sellerName, etc.
      };

      console.log('📦 Creating product:', productData);

      // ✅ REAL API CALL
      const response = await productService.createProduct(productData);
      
      if (response.success) {
        toast.success('🎉 Product listed successfully! It\'s now live on CampusMart.');
        navigate('/products');
      } else {
        throw new Error(response.message || 'Failed to create product');
      }

    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error.response?.data?.message || 'Failed to list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (category) => {
    const images = {
      textbook: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
      gadget: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=400&fit=crop',
      notes: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop'
    };
    return images[category] || images.textbook;
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : BookOpen;
  };

  const CategoryIcon = getCategoryIcon(formData.category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <CategoryIcon className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">List Item for Sale</h1>
        </div>
        <p className="text-gray-600">Sell your item to the campus community in minutes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
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
                  placeholder="e.g., Introduction to Algorithms Textbook"
                />
                <p className="text-xs text-gray-500 mt-1">Be specific and clear about what you're selling</p>
              </div>

              {/* ✅ IMAGE UPLOAD SECTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images *
                </label>
                
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {images.length === 0 ? (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Click to upload images</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Upload up to 5 images • Max 5MB each
                      </p>
                      <p className="text-blue-600 text-sm mt-2">
                        First image will be used as main display
                      </p>
                    </label>
                  ) : (
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <p className="text-gray-600 font-medium">
                        {imageUploading ? 'Uploading...' : 'Add more images'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {images.length}/5 images • Click to add more
                      </p>
                    </label>
                  )}
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {image.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  📸 Tip: Use clear, well-lit photos from different angles
                </p>
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
                  placeholder="Describe your item in detail... Include condition, edition, features, any damages, etc."
                />
                <p className="text-xs text-gray-500 mt-1">Honest descriptions help build trust with buyers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="1"
                    max="10"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || imageUploading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Listing Item...</span>
                  </>
                ) : (
                  <>
                    <span>💰</span>
                    <span>List Item for Sale</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Seller Information</h4>
            <div className="space-y-2">
              <p className="text-blue-700 text-sm">
                <strong>Name:</strong> {user?.name || 'Not provided'}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Email:</strong> {user?.email || 'Not provided'}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Status:</strong> <span className="text-green-600">Verified Student</span>
              </p>
            </div>
            <p className="text-blue-600 text-xs mt-3">
              This information will be visible to buyers for communication
            </p>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-3">💡 Selling Tips</h4>
            <ul className="text-yellow-700 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Provide clear, honest descriptions of your item's condition</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Set a fair price based on condition and market value</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Be responsive to buyer inquiries</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Meet in safe, public locations on campus</span>
              </li>
            </ul>
          </div>

          {/* Pricing Guide */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">💰 Pricing Guide</h4>
            <div className="text-green-700 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Like New:</span>
                <span>70-80% of original</span>
              </div>
              <div className="flex justify-between">
                <span>Excellent:</span>
                <span>60-70% of original</span>
              </div>
              <div className="flex justify-between">
                <span>Very Good:</span>
                <span>50-60% of original</span>
              </div>
              <div className="flex justify-between">
                <span>Good:</span>
                <span>40-50% of original</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProduct;