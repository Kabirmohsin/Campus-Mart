import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { mockProducts } from '../data/mockData';
import ProductGrid from '../components/Products/ProductGrid';
import ProductFilters from '../components/Products/ProductFilters';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

// ✅ SAFE PRODUCT COMPONENT
const SafeProductGrid = ({ products, loading }) => {
  try {
    // ✅ VALIDATE PRODUCTS DATA BEFORE RENDERING
    const safeProducts = Array.isArray(products) ? products.map(product => ({
      _id: product._id || Math.random().toString(),
      name: product.name || 'Unnamed Product',
      description: product.description || 'No description available',
      price: typeof product.price === 'number' ? product.price : 0,
      category: product.category || 'other',
      image: product.image || 'https://via.placeholder.com/300',
      condition: product.condition || 'Good',
      seller: typeof product.seller === 'object' ? product.seller.name : product.seller,
      sellerName: product.sellerName || 'Student Seller',
      rating: typeof product.rating === 'number' ? product.rating : 4.0,
      stock: typeof product.stock === 'number' ? product.stock : 1,
      views: product.views || 0,
      createdAt: product.createdAt || new Date().toISOString()
    })) : [];

    return <ProductGrid products={safeProducts} loading={loading} />;
  } catch (error) {
    console.error('❌ Error in ProductGrid:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error displaying products</h3>
        <p className="text-gray-500">Please try refreshing the page</p>
      </div>
    );
  }
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);

  // ✅ HYBRID APPROACH WITH ERROR HANDLING
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching products from API...');
        const response = await productService.getAllProducts();
        let realProducts = response.products || [];
        
        console.log('📦 Raw API response:', response);
        console.log('📊 Products from API:', realProducts);

        // ✅ VALIDATE PRODUCTS DATA
        if (realProducts.length === 0) {
          console.log('📦 Using mock products (no real products found)');
          realProducts = mockProducts;
        } else {
          // ✅ CLEAN AND VALIDATE PRODUCT DATA
          realProducts = realProducts.map(product => ({
            _id: product._id?.toString() || Math.random().toString(),
            name: product.name || 'Unnamed Product',
            description: product.description || 'No description available',
            price: typeof product.price === 'number' ? product.price : 0,
            category: product.category || 'other',
            image: product.image || 'https://via.placeholder.com/300',
            condition: product.condition || 'Good',
            seller: product.seller, // Keep original for debugging
            sellerName: product.sellerName || 'Student Seller',
            rating: typeof product.rating === 'number' ? product.rating : 4.0,
            stock: typeof product.stock === 'number' ? product.stock : 1,
            views: product.views || 0,
            createdAt: product.createdAt || new Date().toISOString()
          }));
          
          console.log(`✅ Loaded ${realProducts.length} validated products from database`);
        }
        
        setProducts(realProducts);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        setError(error.message);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // ✅ SAFE SEARCH FUNCTION
  const searchProducts = async (query) => {
    if (!query.trim()) return products;
    
    try {
      const response = await productService.searchProducts(query);
      return response.products || [];
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to client-side search
      return products.filter(product => 
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
  };

  // ✅ SAFE FILTER AND SORT
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let filtered = products;

        // Search filter
        if (searchTerm) {
          filtered = await searchProducts(searchTerm);
        }

        // Category filter
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Safe sort products
        filtered = [...filtered].sort((a, b) => {
          const aPrice = typeof a.price === 'number' ? a.price : 0;
          const bPrice = typeof b.price === 'number' ? b.price : 0;
          const aRating = typeof a.rating === 'number' ? a.rating : 0;
          const bRating = typeof b.rating === 'number' ? b.rating : 0;
          const aName = a.name || '';
          const bName = b.name || '';

          switch (sortBy) {
            case 'price-low':
              return aPrice - bPrice;
            case 'price-high':
              return bPrice - aPrice;
            case 'rating':
              return bRating - aRating;
            case 'name':
            default:
              return aName.localeCompare(bName);
          }
        });

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Filter error:', error);
        setFilteredProducts(products);
      }
    };

    applyFilters();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setSearchParams({});
  };

  // ✅ SHOW LOADING SPINNER
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  // ✅ SHOW ERROR STATE
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Products</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          All Products {filteredProducts.length > 0 && `(${filteredProducts.length})`}
        </h1>
        <p className="text-gray-600">
          Discover textbooks, gadgets, and notes from your campus community
        </p>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        productCount={filteredProducts.length}
      />

      {/* ✅ USE SAFE PRODUCT GRID */}
      <SafeProductGrid products={filteredProducts} loading={loading} />

      {/* ✅ EMPTY STATE */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search filters' 
              : 'No products available yet. Be the first to list an item!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;