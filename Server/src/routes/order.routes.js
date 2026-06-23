import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/order.schema.js';
import Product from '../models/product.schema.js';
import User from '../models/user.schema.js';
import { verifyToken, isCustomer, isVendor } from '../middleware/auth.middleware.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Razorpay Configuration Error: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const ADMIN_COMMISSION_PERCENTAGE = 5;
const calculatePayouts = (totalPrice) => {
  const commission = Number((totalPrice * (ADMIN_COMMISSION_PERCENTAGE / 100)).toFixed(2));
  const payout = Number((totalPrice - commission).toFixed(2));
  return { commission, payout };
};

const verifyRazorpaySignature = (payload, secret, expectedSignature) => {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return generatedSignature === expectedSignature;
};

// ==========================================
// ORDER ROUTES - CUSTOMER
// ==========================================

/**
 * POST: Create Razorpay order for checkout
 */
router.post('/checkout', verifyToken, isCustomer, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });

      subtotal += product.price * item.quantity;
    }

    const shippingPrice = 50;
    const taxPrice = Number((subtotal * 0.1).toFixed(2));
    const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));
    const { commission, payout } = calculatePayouts(totalPrice);

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1
    });

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: 'razorpay',
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
        amountPaid: 0
      },
      platformCommission: commission,
      vendorPayout: payout,
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: 'pending'
    });

    await order.save();
    await order.populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Razorpay checkout created',
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt
      },
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Verify Razorpay payment after checkout
 */
router.post('/razorpay/verify', verifyToken, isCustomer, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay payment details' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
    }

    order.paymentInfo.status = 'paid';
    order.paymentInfo.transactionId = razorpayPaymentId;
    order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
    order.paymentInfo.amountPaid = order.totalPrice;
    order.orderStatus = 'processing';
    await order.save();

    res.status(200).json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Request refund for an order
 */
router.post('/:id/refund', verifyToken, isCustomer, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (order.paymentInfo.status !== 'paid' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Refund not allowed for this order' });
    }

    const refundAmount = Number((order.totalPrice * 0.95).toFixed(2));
    const retainedCommission = Number((order.totalPrice * 0.05).toFixed(2));

    order.refundInfo = {
      amount: refundAmount,
      reason: reason || 'Customer requested refund',
      retainedCommission,
      refundedAt: new Date(),
      refundStatus: 'processed'
    };
    order.orderStatus = 'cancelled';
    order.paymentInfo.status = 'refunded';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully. 5% admin commission retained.',
      refund: order.refundInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Razorpay webhook receiver for payment events
 */
router.post('/webhook/razorpay', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay signature' });
    }

    const isValid = verifyRazorpaySignature(req.rawBody.toString(), process.env.RAZORPAY_WEBHOOK_SECRET, signature);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body;
    const razorpayOrderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    const paymentStatus = event.payload?.payment?.entity?.status;

    if (!razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Missing order ID in webhook payload' });
    }

    const order = await Order.findOne({ 'paymentInfo.razorpayOrderId': razorpayOrderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (paymentStatus === 'captured') {
      order.paymentInfo.status = 'paid';
      order.paymentInfo.razorpayPaymentId = paymentId;
      order.paymentInfo.transactionId = paymentId;
      order.orderStatus = 'processing';
      await order.save();
    } else if (paymentStatus === 'failed') {
      order.paymentInfo.status = 'failed';
      await order.save();
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Create new order
 */
router.post('/', verifyToken, isCustomer, async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });

      subtotal += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingPrice = 50; // Fixed shipping cost
    const taxPrice = subtotal * 0.1; // 10% tax
    const totalPrice = subtotal + shippingPrice + taxPrice;

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: paymentInfo || { method: 'pending', status: 'pending' },
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: 'pending'
    });

    await order.save();
    await order.populate('items.product');

    // Clear user's cart
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch all orders for logged-in customer
 */
router.get('/my-orders', verifyToken, isCustomer, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch single order details
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify user owns this order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'vendor') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ 
      success: true, 
      order 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ORDER ROUTES - VENDOR
// ==========================================

/**
 * GET: Fetch vendor's orders (orders containing vendor's products)
 */
router.get('/vendor/orders', verifyToken, isVendor, async (req, res) => {
  try {
    // Get all products of this vendor
    const vendorProducts = await Product.find({ vendor: req.user.id }, '_id');
    const productIds = vendorProducts.map(p => p._id);

    // Find orders containing these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
      .populate('user')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT: Update order status (Vendor)
 */
router.put('/:id/status', verifyToken, isVendor, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: 'Order status updated',
      order 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
