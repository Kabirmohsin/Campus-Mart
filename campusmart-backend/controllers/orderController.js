import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    console.log('🛒 Order creation started...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { shippingInfo, paymentMethod, items, totalAmount } = req.body;

    // ✅ FIX: Convert shippingInfo to shippingAddress format
    let shippingAddress = null;
    if (shippingInfo) {
      shippingAddress = {
        fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.zipCode,
        country: shippingInfo.state || 'India'
      };
    }

    console.log('Converted Shipping Address:', shippingAddress);

    // Validate shipping address
    if (!shippingAddress || 
        !shippingAddress.fullName || 
        !shippingAddress.address || 
        !shippingAddress.city || 
        !shippingAddress.postalCode || 
        !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    // Fix payment method value
    let correctedPaymentMethod = paymentMethod;
    if (paymentMethod === 'cod') {
      correctedPaymentMethod = 'cash_on_delivery';
    }

    console.log('Payment Method:', correctedPaymentMethod);

    // ✅ FIX: Use items from request body instead of cart (since frontend is sending complete product data)
    const orderItems = [];
    let calculatedTotalAmount = 0;
    let sellers = new Set(); // ✅ Track all sellers in this order

    console.log('Processing items from request:', items);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const product = item.product;
      
      console.log(`🔄 Processing item ${i + 1}:`, {
        productId: product?._id,
        productName: product?.name,
        productPrice: product?.price
      });

      if (!product) {
        console.log('❌ Product not found in item');
        return res.status(400).json({
          success: false,
          message: 'Some products in your order are no longer available'
        });
      }

      console.log(`✅ Product data: ${product.name}, Price: ${product.price}`);

      // Ensure price and quantity are valid numbers
      let itemPrice = Number(product.price);
      const itemQuantity = Number(item.quantity) || 1;

      // If price is invalid, use a default price
      if (isNaN(itemPrice) || itemPrice <= 0) {
        console.log(`⚠️ Invalid price for ${product.name}, using default price 100`);
        itemPrice = 100;
      }

      // ✅ FIX: Find product in database to check stock and get proper ObjectId
      let dbProduct;
      try {
        // Try to find product by _id if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(product._id)) {
          dbProduct = await Product.findById(product._id).populate('seller');
        } else {
          // If _id is not ObjectId, try to find by name or other identifier
          dbProduct = await Product.findOne({ name: product.name }).populate('seller');
        }
      } catch (error) {
        console.log('⚠️ Error finding product in DB:', error.message);
      }

      if (dbProduct) {
        console.log(`📊 Product found in DB: ${dbProduct.name}, Stock: ${dbProduct.stock}`);
        console.log(`👤 Product seller: ${dbProduct.seller?._id} - ${dbProduct.seller?.name}`);
        
        // ✅ ADD SELLER TO TRACKING
        if (dbProduct.seller) {
          sellers.add(dbProduct.seller._id.toString());
        }
        
        if (dbProduct.stock < itemQuantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${dbProduct.name}. Only ${dbProduct.stock} available.`
          });
        }
      } else {
        console.log('⚠️ Product not found in database, but continuing with order...');
      }

      // ✅ FIX: Use proper ObjectId or create a new one if needed
      let productId;
      if (mongoose.Types.ObjectId.isValid(product._id)) {
        productId = product._id;
      } else {
        // If _id is not valid ObjectId, create a new one or use product name as reference
        productId = new mongoose.Types.ObjectId();
        console.log(`🆕 Created new ObjectId for product: ${productId}`);
      }

      orderItems.push({
        product: productId,
        quantity: itemQuantity,
        price: itemPrice,
        name: product.name,
        image: product.image
      });

      calculatedTotalAmount += itemPrice * itemQuantity;
      console.log(`✅ Item ${i + 1} processed successfully`);
    }

    // Use frontend totalAmount or calculated amount
    const finalTotalAmount = totalAmount || calculatedTotalAmount;
    console.log('💰 Final Total Amount:', finalTotalAmount);

    if (isNaN(finalTotalAmount) || finalTotalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total amount'
      });
    }

    // ✅ FIX: Use first seller as main seller, or current user if no sellers found
    const sellerArray = Array.from(sellers);
    const mainSeller = sellerArray.length > 0 ? sellerArray[0] : req.user._id;

    console.log('👤 Sellers in order:', sellerArray);
    console.log('👤 Main seller assigned:', mainSeller);

    // Create order with corrected data
    const orderData = {
      user: req.user._id,
      items: orderItems,
      totalAmount: finalTotalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: correctedPaymentMethod,
      seller: mainSeller, // ✅ ACTUAL SELLER ASSIGNED
      status: 'pending'
    };

    console.log('📦 Creating order with data:', orderData);

    const order = await Order.create(orderData);
    console.log('✅ Order created successfully:', order._id);

    // ✅ FIX: Update product stock for items that exist in database
    for (const item of items) {
      const product = item.product;
      if (product && mongoose.Types.ObjectId.isValid(product._id)) {
        try {
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -item.quantity }
          });
          console.log(`📊 Stock updated for product: ${product.name}`);
        } catch (error) {
          console.log(`⚠️ Could not update stock for product: ${product.name}`, error.message);
        }
      }
    }

    // ✅ FIX: Clear user's cart after successful order
    try {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [] }
      );
      console.log('🛒 Cart cleared');
    } catch (error) {
      console.log('⚠️ Could not clear cart:', error.message);
    }

    // Update user's order count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalOrders: 1 }
    });
    console.log('👤 User order count updated');

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name image')
      .populate('user', 'name email')
      .populate('seller', 'name email');

    console.log('🎉 Order creation completed successfully!');

    res.status(201).json({
      success: true,
      order: populatedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('❌ Create order error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/user/my-orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image category condition')
      .populate('seller', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin/seller
    if (order.user._id.toString() !== req.user._id.toString() && 
        order.seller?._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin/Seller
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization check
    if (req.user.role !== 'admin' && order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation for pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already being processed'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
};

// @desc    Get seller's orders
// @route   GET /api/orders/seller/my-orders
// @access  Private/Seller
export const getSellerOrders = async (req, res) => {
  try {
    console.log('🛒 Fetching seller orders for:', req.user._id);
    
    // Find all products that belong to this seller
    const sellerProducts = await Product.find({ 
      seller: req.user._id 
    }).select('_id');
    
    const productIds = sellerProducts.map(product => product._id);
    console.log('📦 Seller product IDs:', productIds);

    // Find orders that contain seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate('user', 'name email phone')
    .populate('items.product', 'name image price category')
    .populate('seller', 'name email')
    .sort({ createdAt: -1 });

    console.log(`✅ Found ${orders.length} orders for seller`);

    // Enhance orders with seller-specific information
    const enhancedOrders = orders.map(order => {
      // Filter items that belong to this seller
      const sellerItems = order.items.filter(item => 
        productIds.includes(item.product._id)
      );
      
      // Calculate seller's total from their items only
      const sellerTotal = sellerItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );

      return {
        ...order.toObject(),
        sellerItems,
        sellerTotal,
        itemCount: sellerItems.length
      };
    });

    res.json({
      success: true,
      orders: enhancedOrders,
      total: enhancedOrders.length
    });
  } catch (error) {
    console.error('❌ Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller orders'
    });
  }
};