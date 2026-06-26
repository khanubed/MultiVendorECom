import express from 'express';
import Product from '../models/product.schema.js';
import { verifyToken, isVendor, isCustomer } from '../middleware/auth.middleware.js';

const router = express.Router();

// ==========================================
// PRODUCT ROUTES - PUBLIC
// ==========================================

/**
 * GET: Fetch all products with filters
 * Query params: category, minPrice, maxPrice, vendor, search, page, limit
 */
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, vendor, search, page = 1, limit = 12 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('vendor', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({
      isFeatured: true,
      approvalStatus: "approved",
      stock: { $gt: 0 } 
    })
      .sort({ createdAt: -1 }) // Get newest first
      .limit(3); // We limit to 3 because your Bento grid handles exactly 3 items perfectly

    res.status(200).json({ success: true, products: featuredProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// PRODUCT ROUTES - VENDOR ONLY
// ==========================================

/**
 * POST: Create new product (Vendor only)
 */
router.post('/', verifyToken, isVendor, async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, stock, badge, isFeatured } = req.body;

    if (!name || !price || !description || !imageUrl || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      category,
      stock: stock || 0,
      badge,
      isFeatured: isFeatured || false,
      vendor: req.user.id
    });

    await product.save();
    await product.populate('vendor', 'name email');

    res.status(201).json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT: Update product (Vendor only - own products)
 */
router.put('/:id', verifyToken, isVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this product' });
    }

    const { name, price, description, imageUrl, category, stock, badge, isFeatured } = req.body;
    
    Object.assign(product, { name, price, description, imageUrl, category, stock, badge, isFeatured });
    await product.save();

    res.status(200).json({ 
      success: true, 
      message: 'Product updated successfully',
      product 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE: Delete product (Vendor only - own products)
 */
router.delete('/:id', verifyToken, isVendor, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch vendor's own products
 */
router.get('/vendor/my-products', verifyToken, isVendor, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id })
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
