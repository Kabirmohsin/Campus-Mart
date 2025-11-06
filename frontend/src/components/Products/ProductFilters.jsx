import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  productCount
}) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'textbook', label: 'Textbooks' },
    { value: 'gadget', label: 'Gadgets' },
    { value: 'notes', label: 'Notes' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'name';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>{productCount} products found</span>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Category: {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;