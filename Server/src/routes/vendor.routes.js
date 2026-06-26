import express from "express";
import Vendor from "../models/vendor.schema.js";
import Product from "../models/product.schema.js";
import Order from "../models/order.schema.js";
import { verifyToken, isVendor } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==========================================
// VENDOR PROFILE ROUTES
// ==========================================

router.get("/analytics", verifyToken, isVendor, async (req, res) => {
  try {
    // 1. Get all product IDs owned by this vendor
    const vendorProducts = await Product.find({ vendor: req.user.id }, "_id");
    const productIds = vendorProducts.map((p) => p._id);

    // 2. Calculate Top-Level Metrics (Revenue, Total Orders, Pending Orders)
    const metricsData = await Order.aggregate([
      { $match: { "items.product": { $in: productIds } } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              // Only sum vendorPayout if the order wasn't cancelled
              $cond: [
                { $ne: ["$orderStatus", "cancelled"] },
                "$vendorPayout",
                0,
              ],
            },
          },
          totalOrders: { $sum: 1 },
          pendingCount: {
            $sum: {
              // Count orders that are still pending or processing
              $cond: [
                { $in: ["$orderStatus", ["pending", "processing"]] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // 3. Calculate Time-Series Data for the Chart (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const chartData = await Order.aggregate([
      {
        $match: {
          "items.product": { $in: productIds },
          orderStatus: { $ne: "cancelled" },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          // Group by Month-Day (e.g., "06-24")
          _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$vendorPayout" },
          sales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort chronologically
    ]);

    // Format metrics fallback if no orders exist yet
    const stats = metricsData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      pendingCount: 0,
    };

    res.status(200).json({
      success: true,
      analytics: {
        revenue: stats.totalRevenue,
        orders: stats.totalOrders,
        pending: stats.pendingCount,
        chartData: chartData.map((item) => ({
          date: item._id,
          revenue: item.revenue,
          sales: item.sales,
        })),
      },
    });
  } catch (error) {
    console.error("Error in vendor analytics:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch vendor profile
 */
router.get("/profile", verifyToken, isVendor, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT: Update vendor profile
 */
router.put("/profile", verifyToken, isVendor, async (req, res) => {
  try {
    const { name, phone, address, city, state, zip, country, pincode } =
      req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city, state, zip, country, pincode },
      { new: true, runValidators: true },
    );

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// VENDOR ANALYTICS & DASHBOARD ROUTES
// ==========================================

/**
 * GET: Vendor Dashboard Statistics
 */
router.get("/dashboard/stats", verifyToken, isVendor, async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendor: req.user.id });
    const productIds = vendorProducts.map((p) => p._id);

    const totalOrders = await Order.countDocuments({
      "items.product": { $in: productIds },
    });

    const orders = await Order.find({
      "items.product": { $in: productIds },
    }).populate("items.product");

    let totalRevenue = 0;
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productIds.includes(item.product._id)) {
          totalRevenue += item.priceAtPurchase * item.quantity;
        }
      });
    });

    const totalProducts = vendorProducts.length;
    const totalStock = vendorProducts.reduce((sum, p) => sum + p.stock, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalStock,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: All vendors (public)
 */
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find({
      isActive: true,
      isDeleted: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Single vendor by ID (public)
 */
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select("-password");

    if (!vendor || !vendor.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Get vendor's products
    const products = await Product.find({ vendor: vendor._id });

    res.status(200).json({
      success: true,
      vendor,
      products,
      productCount: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
