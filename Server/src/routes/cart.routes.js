import express from 'express';
import User from '../models/user.schema.js';
import Product from '../models/product.schema.js';
import { verifyToken, isCustomer } from '../middleware/auth.middleware.js';

const router = express.Router();

// ==========================================
// CART ROUTES
// ==========================================

/**
 * GET: Fetch user's cart
 */
router.get('/', verifyToken, isCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      cart: user.cart || [] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Add product to cart
 */
router.post('/add', verifyToken, isCustomer, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user.cart) user.cart = [];

    // Avoid duplicate items
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    await user.populate('cart');

    res.status(200).json({ 
      success: true, 
      message: 'Product added to cart',
      cart: user.cart 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE: Remove product from cart
 */
router.delete('/remove/:productId', verifyToken, isCustomer, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(id => id.toString() !== productId);
    await user.save();
    await user.populate('cart');

    res.status(200).json({ 
      success: true, 
      message: 'Product removed from cart',
      cart: user.cart 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE: Clear entire cart
 */
router.delete('/clear', verifyToken, isCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
