import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts } from '../data/mockData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
    setCategories(uniqueCategories);
  }, [products]);

  const getProductById = (id) => {
    return products.find(product => product._id === id);
  };

  const getProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  const searchProducts = (query) => {
    if (!query) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const addProduct = (productData) => {
    const newProduct = {
      _id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, productData) => {
    setProducts(prev =>
      prev.map(product =>
        product._id === id ? { ...product, ...productData } : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product._id !== id));
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      getProductById,
      getProductsByCategory,
      searchProducts,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};