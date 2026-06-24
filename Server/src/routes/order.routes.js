import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.schema.js";
import Product from "../models/product.schema.js";
import User from "../models/user.schema.js";
import {
  verifyToken,
  isCustomer,
  isVendor,
} from "../middleware/auth.middleware.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error(
    "❌ Razorpay Configuration Error: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env",
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ADMIN_COMMISSION_PERCENTAGE = 5;
const calculatePayouts = (totalPrice) => {
  const commission = Number(
    (totalPrice * (ADMIN_COMMISSION_PERCENTAGE / 100)).toFixed(2),
  );
  const payout = Number((totalPrice - commission).toFixed(2));
  return { commission, payout };
};

const verifyRazorpaySignature = (payload, secret, expectedSignature) => {
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return generatedSignature === expectedSignature;
};

/**
 * Reusable helper to process successful payments safely (Idempotent)
 */
const fulfillOrder = async (order, paymentId) => {
  if (order.paymentInfo.status === "paid") return order; // Already processed, skip

  // 1. Deduct Inventory Stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // 2. Clear customer's cart
  await User.findByIdAndUpdate(order.user, { cart: [] });

  // 3. Update Order Status
  order.paymentInfo.status = "paid";
  order.paymentInfo.transactionId = paymentId;
  order.paymentInfo.razorpayPaymentId = paymentId;
  order.paymentInfo.amountPaid = order.totalPrice;
  order.orderStatus = "processing";

  await order.save();
  return order;
};

// ==========================================
// ORDER ROUTES - CUSTOMER
// ==========================================

/**
 * POST: Create Razorpay order for checkout
 */
router.post("/checkout", verifyToken, isCustomer, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order items are required" });
    }

    if (!shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is required" });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      subtotal += product.price * item.quantity;
    }

    const shippingPrice = 50;
    const taxPrice = Number((subtotal * 0.1).toFixed(2));
    const totalPrice = Number((subtotal + shippingPrice + taxPrice).toFixed(2));
    const { commission, payout } = calculatePayouts(totalPrice);

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: "razorpay",
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
        amountPaid: 0,
      },
      platformCommission: commission,
      vendorPayout: payout,
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: "pending",
    });

    await order.save();
    await order.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Razorpay checkout created",
      order,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Verify Razorpay payment after checkout (Direct UI fallback)
 */
router.post("/razorpay/verify", verifyToken, isCustomer, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;

    // 🔍 DIAGNOSTIC LOG: This prints to your live server log streams
    console.log("📦 Incoming Verification Payload:", req.body);

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
        // 🛠️ THIS WILL SHOW YOU EXACTLY WHAT THE SERVER SAW IN YOUR CHROME DEVTOOLS
        debugReport: {
          hasOrderId: !!orderId,
          hasRazorpayOrderId: !!razorpayOrderId,
          hasRazorpayPaymentId: !!razorpayPaymentId,
          hasRazorpaySignature: !!razorpaySignature,
          receivedBody: req.body || "BODY_WAS_COMPLETELY_EMPTY",
        },
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Razorpay signature" });
    }

    const fulfilledOrder = await fulfillOrder(order, razorpayPaymentId);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: fulfilledOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Razorpay webhook receiver for async payment backend validation
 */
router.post("/webhook/razorpay", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Razorpay signature" });
    }

    if (!req.rawBody) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: rawBody missing",
      });
    }

    const isValid = verifyRazorpaySignature(
      req.rawBody.toString(),
      process.env.RAZORPAY_WEBHOOK_SECRET,
      signature,
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid webhook signature" });
    }

    const event = req.body;
    const paymentEntity = event.payload?.payment?.entity;
    const razorpayOrderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    // If it's a general webhook event not tied to a checkout flow, exit cleanly
    if (!razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message:
          "Webhook received but not tied to a structured transaction order",
      });
    }

    // Locate the target order via your nested schema path
    const order = await Order.findOne({
      "paymentInfo.razorpayOrderId": razorpayOrderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order reference matching Razorpay data not found",
      });
    }

    // 🛡️ Frontend Double-Check: If the frontend verification route already set
    // this order to "paid" or "processing", acknowledge and shut down cleanly with a 200.
    if (
      order.paymentInfo.status === "paid" ||
      order.orderStatus === "processing"
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Webhook received, but order was already fulfilled via frontend verification.",
      });
    }

    // 3. Handle specific lifecycle status payloads safely
    if (event.event === "payment.captured") {
      await fulfillOrder(order, paymentId);
    } else if (event.event === "payment.failed") {
      order.paymentInfo.status = "failed";
      order.orderStatus = "cancelled";
      await order.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook Controller Crash:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Request refund for an order
 */
router.post("/:id/refund", verifyToken, isCustomer, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (
      order.paymentInfo.status !== "paid" ||
      order.orderStatus === "cancelled"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Refund not allowed for this order" });
    }

    const refundAmount = Number((order.totalPrice * 0.95).toFixed(2));
    const retainedCommission = Number((order.totalPrice * 0.05).toFixed(2));

    order.refundInfo = {
      amount: refundAmount,
      reason: reason || "Customer requested refund",
      retainedCommission,
      refundedAt: new Date(),
      refundStatus: "processed",
    };
    order.orderStatus = "cancelled";
    order.paymentInfo.status = "refunded";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully. 5% admin commission retained.",
      refund: order.refundInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch all orders for logged-in customer
 */
router.get("/my-orders", verifyToken, isCustomer, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch single order details
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "vendor"
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ORDER ROUTES - VENDOR
// ==========================================

router.get("/vendor/orders", verifyToken, isVendor, async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendor: req.user.id }, "_id");
    const productIds = vendorProducts.map((p) => p._id);

    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id/status", verifyToken, isVendor, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
