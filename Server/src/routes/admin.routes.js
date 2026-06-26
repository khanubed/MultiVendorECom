import express from 'express';
const router = express.Router();
import Product from '../models/product.schema.js';
import { isAdmin, verifyToken } from '../middleware/auth.middleware.js';
import Vendor from '../models/vendor.schema.js';
import Order from '../models/order.schema.js';
import User from '../models/user.schema.js';

/**
 * @route   GET /api/admin/products
 * @desc    Get all products with full system & vendor metadata
 * @access  Admin / Super Admin
 */
router.get("/products", verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name email storeName status") // Merges full vendor profiles
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/admin/products/:id/approval
 * @desc    Approve or Reject a product's listing status
 * @access  Admin / Super Admin
 */
router.patch("/products/:id/approval", verifyToken, isAdmin, async (req, res) => {
  const { approvalStatus } = req.body; // Expects 'approved' or 'rejected'
  console.log(approvalStatus)

  if (!["approved", "rejected"].includes(approvalStatus)) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    ).populate("vendor", "storeName email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: `Product successfully ${approvalStatus}`, 
      product 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/admin/products/:id/featured
 * @desc    Toggle product featured allocation status for bento layouts
 * @access  Super Admin Only
 */
router.patch("/products/:id/featured", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Toggle boolean status
    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({ 
      success: true, 
      message: `Product featured status set to ${product.isFeatured}`, 
      product 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/dashboard", verifyToken, isAdmin,async (req, res) => {
  try {
    // Execute parallel data gathering across distinct collection indexes
    const [orderMetrics, productStats, customerCount, vendorStats] = await Promise.all([
      // 1. Core financial aggregations over the order ledger matrix
      Order.aggregate([
        {
          $group: {
            _id: null,
            grossSales: { $sum: "$totalPrice" },
            collectedCommission: { $sum: "$platformCommission" },
            allocatedPayouts: { $sum: "$vendorPayout" },
            totalSubtotal: { $sum: "$subtotal" },
            processedRefunds: {
              $sum: {
                $cond: [{ $eq: ["$refundInfo.refundStatus", "processed"] }, "$refundInfo.amount", 0]
              }
            },
            pendingRefundRequests: {
              $sum: {
                $cond: [{ $eq: ["$refundInfo.refundStatus", "requested"] }, 1, 0]
              }
            },
            completedOrdersCount: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] }
            }
          }
        }
      ]),

      // 2. Catalog approval state summary mapping
      Product.aggregate([
        {
          $group: {
            _id: "$approvalStatus",
            count: { $sum: 1 },
            totalStockValue: { $sum: "$stock" }
          }
        }
      ]),

      // 3. User base counting filters
      User.countDocuments({ role: "customer", isActive: true }),

      // 4. Vendor onboarding pipeline validation states
      Vendor.aggregate([
        {
          $group: {
            _id: null,
            totalVendors: { $sum: 1 },
            verifiedVendors: { $sum: { $cond: ["$isVerified", 1, 0] } },
            activeVendors: { $sum: { $cond: ["$isActive", 1, 0] } }
          }
        }
      ])
    ]);

    // Format financial payload baselines safely in case of empty collections
    const financials = orderMetrics[0] || {
      grossSales: 0,
      collectedCommission: 0,
      allocatedPayouts: 0,
      processedRefunds: 0,
      pendingRefundRequests: 0,
      completedOrdersCount: 0
    };

    // Transform product aggregation array layout into a flat key-value dictionary
    const catalog = { pending: 0, approved: 0, rejected: 0, globalStockVolume: 0 };
    productStats.forEach(bucket => {
      if (bucket._id) {
        catalog[bucket._id] = bucket.count;
      }
      catalog.globalStockVolume += bucket.totalStockValue || 0;
    });

    const merchants = vendorStats[0] || { totalVendors: 0, verifiedVendors: 0, activeVendors: 0 };

    return res.status(200).json({
      success: true,
      metrics: {
        financials,
        catalog,
        merchants,
        counts: {
          activeCustomers: customerCount
        }
      }
    });
  } catch (error) {
    console.error("Super Admin Analytics aggregation failure:", error);
    return res.status(500).json({ success: false, message: "Internal Server Analytics Error" });
  }
})

export default router