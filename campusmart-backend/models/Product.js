import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['textbook', 'gadget', 'notes', 'other'],
    index: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    type: String
  }],
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Digital'], // ✅ FIXED - 'New' add kiya
    default: 'Good' // ✅ Default change kiya
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 1
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Seller information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sellerName: {
    type: String,
    required: true
  },
  
  // Additional fields
  campus: {
    type: String,
    default: 'University Campus'
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text',
  tags: 'text'
});

// Index for filtering
productSchema.index({ category: 1, price: 1, rating: -1 });

export default mongoose.model('Product', productSchema);