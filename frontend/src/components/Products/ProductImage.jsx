import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ProductImage = ({ src, alt, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (imageError || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <ImageOff className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ProductImage;