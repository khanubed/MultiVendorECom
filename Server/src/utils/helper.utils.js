/**
 * Format response for consistency
 */
export const formatResponse = (success, message, data = null, statusCode = 200) => {
  return {
    statusCode,
    success,
    message,
    ...(data && { data })
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,}$/;
  return phoneRegex.test(phone.toString());
};

/**
 * Calculate cart total
 */
export const calculateCartTotal = (items) => {
  let total = 0;
  items.forEach(item => {
    if (item.price && item.quantity) {
      total += item.price * item.quantity;
    }
  });
  return total;
};

/**
 * Generate invoice number
 */
export const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `INV-${timestamp}-${random}`;
};
