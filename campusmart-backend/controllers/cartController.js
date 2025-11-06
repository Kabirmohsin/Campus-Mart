import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image stock sellerName condition category');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    console.log('🛒 Add to cart - Product ID:', productId);

    // ✅ USE REAL DATABASE - NO MOCK DATA
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ 
        user: req.user._id, 
        items: [{
          product: productId,
          quantity,
          price: product.price
        }]
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} items available in stock`
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId,
          quantity,
          price: product.price
        });
      }

      await cart.save();
    }

    await cart.populate('items.product', 'name price image stock sellerName condition category');

    res.json({
      success: true,
      cart,
      message: `${product.name} added to cart successfully`
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart: ' + error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // ✅ USE REAL PRODUCT DATA
    const product = await Product.findById(cartItem.product);
    if (product && quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    cartItem.quantity = quantity;
    await cart.save();

    await cart.populate('items.product', 'name price image stock sellerName condition category');

    res.json({
      success: true,
      cart,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart item'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    await cart.populate('items.product', 'name price image stock sellerName condition category');

    res.json({
      success: true,
      cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};