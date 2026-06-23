import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1']
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assumes a User model exists for authentication
      required: true,
      index: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentInfo: {
      method: { 
        type: String, 
        required: true, 
        enum: ['pending','stripe', 'paypal', 'wire_transfer', 'razorpay'] 
      },
      status: { 
        type: String, 
        required: true, 
        enum: ['pending', 'paid', 'failed', 'refunded'], 
        default: 'pending' 
      },
      transactionId: { type: String },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      amountPaid: { type: Number, default: 0 }
    },
    platformCommission: {
      type: Number,
      default: 0
    },
    vendorPayout: {
      type: Number,
      default: 0
    },
    refundInfo: {
      amount: { type: Number, default: 0 },
      reason: { type: String, default: '' },
      retainedCommission: { type: Number, default: 0 },
      refundedAt: { type: Date },
      refundStatus: { type: String, default: 'none', enum: ['none', 'requested', 'processed', 'rejected'] }
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true // Highly optimized for tracking/dashboard lookups
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true // Generates createdAt (order date) and updatedAt
  }
);

// Standard normalization layer for the frontend API responses
orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;