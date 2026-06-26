import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.schema.js';
import Vendor from '../models/vendor.schema.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ==========================================
// CUSTOMER AUTHENTICATION ROUTES
// ==========================================

/**
 * POST: Customer Registration
 */
router.post('/customer/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address: {},
            cart: []
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'customer' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 'customer'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST: Customer Login
 */
router.post('/customer/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'customer' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: 'customer'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// VENDOR AUTHENTICATION ROUTES
// ===  =======================================

/**
 * POST: Vendor Registration
 */
router.post('/vendor/register', async (req, res) => {
    try {
        const { name, storeName, email, password, phone, address, city, state, zip, country, pincode } = req.body;

        const requiredFields = ['name', 'storeName', 'email', 'password', 'phone', 'address', 'city', 'state', 'zip', 'country', 'pincode'];
        if (requiredFields.some(field => !req.body[field])) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const vendor = new Vendor({
            name,
            storeName,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            state,
            zip,
            country,
            pincode,
            role: 'vendor',
            isActive: true,
            isVerified: false
        });

        await vendor.save();

        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            token,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: 'vendor'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * POST: Vendor Login
 */
router.post('/vendor/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!vendor.isActive) {
            return res.status(403).json({ success: false, message: 'Vendor account is inactive' });
        }

        const isPasswordValid = await bcryptjs.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: vendor._id, email: vendor.email, role: 'vendor' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                storeName: vendor.storeName,
                email: vendor.email,
                role: 'vendor',
                isVerified: vendor.isVerified
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/admin/register', async (req, res) => {
    try {
        const { name, email, password, adminCode } = req.body;

        if (!name || !email || !password || !adminCode) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return res.status(403).json({ success: false, message: 'Invalid admin registration code' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const admin = new User({
            name,
            email,
            password: hashedPassword,
            phone: '',
            role: 'admin',
            isActive: true
        });

        await admin.save();

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin'
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// COMMON ROUTES
// ==========================================

/**
 * GET: Verify token
 */
router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;