import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Customer Role Middleware
 * Ensures only customers can access this route
 */
export const isCustomer = (req, res, next) => {
  if (req.user?.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can access this resource' });
  }
  next();
};

/**
 * Vendor Role Middleware
 * Ensures only vendors can access this route
 */
export const isVendor = (req, res, next) => {
  if (req.user?.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can access this resource' });
  }
  next();
};

/**
 * Admin Role Middleware
 * Ensures only admins can access this route
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can access this resource' });
  }
  next();
};
