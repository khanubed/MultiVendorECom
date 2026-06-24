import express from "express";
import User from "../models/user.schema.js";
import Product from "../models/product.schema.js";
import { verifyToken, isCustomer } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Helper function to flatten the populated cart structure
 * so it remains fully compatible with your frontend layout.
 */
const formatCartResponse = (cartArray) => {
  return cartArray
    .filter((item) => item.id) // Prevents crashes if a product was deleted from the database
    .map((item) => ({
      _id: item.id._id,
      id: item.id._id,
      name: item.id.name,
      price: item.id.price,
      imageUrl: item.id.imageUrl,
      vendor: item.id.vendor,
      category: item.id.category,
      quantity: item.quantity || 1,
    }));
};

// ==========================================
// CART ROUTES
// ==========================================

/**
 * GET: Fetch user's cart
 */
router.get("/", verifyToken, isCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.id");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: formatCartResponse(user.cart || []),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error("Error fetching cart:", error);
  }
});

/**
 * POST: Add product to cart (or increment quantity if it exists)
 */
router.post("/add", verifyToken, isCustomer, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;5

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user.cart) user.cart = [];

    // Check if product already exists in the object array layout
    const existingItem = user.cart.find(
      (item) => item.id?.toString() === productId,
    );

    if (existingItem) {
      // Increment quantity if item is already in cart
      existingItem.quantity += Number(quantity);
    } else {
      // Push new item object with keys 'id' and 'quantity'
      user.cart.push({ id: productId, quantity: Number(quantity) });
    }

    await user.save();
    // await user.populate("cart.item.id");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: formatCartResponse(user.cart),
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT: Update product quantity in cart explicitly
 */
router.put("/quantity", verifyToken, isCustomer, async (req, res) => {
  try {
      const { productId , quantity } = await req.body;

    console.log("Received request to update quantity:", { productId, quantity });

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product ID and quantity are required",
        });
    }

    if (quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity cannot be lower than 1" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Locate matching product inside the object sub-document array
    const item = user.cart.find((item) => item.id?.toString() === productId);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found within your cart" });
    }

    // Update quantity
    item.quantity = Number(quantity);

    await user.save();
    await user.populate("cart.id");

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cart: formatCartResponse(user.cart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE: Remove product from cart
 */
router.delete(
  "/remove/:productId",
  verifyToken,
  isCustomer,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Filter array comparing against the object 'id' key
      user.cart = user.cart.filter((item) => item.id?.toString() !== productId);

      await user.save();
      await user.populate("cart.id");

      res.status(200).json({
        success: true,
        message: "Product removed from cart",
        cart: formatCartResponse(user.cart),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

/**
 * DELETE: Clear entire cart
 */
router.delete("/clear", verifyToken, isCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
