import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all products with filtering
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sortBy,
      page = 1,
      limit, // ✅ REMOVED DEFAULT LIMIT
      minPrice,
      maxPrice,
      condition
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Sort options
    const sortOptions = {
      'name': { name: 1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'rating': { rating: -1 },
      'newest': { createdAt: -1 }
    };

    const sort = sortOptions[sortBy] || { createdAt: -1 };

    // Pagination - only if limit is provided
    const skip = limit ? (page - 1) * Number(limit) : 0;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit ? Number(limit) : undefined) // ✅ NO LIMIT IF NOT PROVIDED
      .populate('seller', 'name avatar rating');

    const totalProducts = await Product.countDocuments(query);
    
    // Calculate total pages only if limit is provided
    const totalPages = limit ? Math.ceil(totalProducts / Number(limit)) : 1;

    res.json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name avatar rating totalSales campus')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Seller/Admin)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id,
      sellerName: req.user.name
    };

    const product = await Product.create(productData);

    // Update seller's listed products count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { listedProducts: 1 }
    });

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Update seller's listed products count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { listedProducts: -1 }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $text: { $search: q },
      isActive: true
    })
    .populate('seller', 'name avatar rating')
    .limit(20);

    res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 50 } = req.query; // ✅ INCREASED DEFAULT LIMIT

    const skip = (page - 1) * limit;

    const products = await Product.find({
      category,
      isActive: true
    })
    .populate('seller', 'name avatar rating')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

    const totalProducts = await Product.countDocuments({ category, isActive: true });
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: Number(page)
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category products'
    });
  }
};