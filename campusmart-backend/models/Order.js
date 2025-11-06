import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    name: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'card', 'cod'],
    default: 'cash_on_delivery'
  },
  orderNumber: {
    type: String,
    unique: true,
    required: false
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  }
}, { 
  timestamps: true 
});

// Auto-generate order number before save
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);