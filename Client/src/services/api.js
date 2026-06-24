import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL 
const WS_URL = import.meta.env.VITE_WS_URL 

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.io instance for real-time chat
export let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) return socket;
  
  socket = io(WS_URL, {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ WebSocket connection error:', error);
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ==========================================
// AUTH APIs
// ==========================================
export const authAPI = {
  // Customer Registration
  customerRegister: (data) => apiClient.post('/auth/customer/register', data),

  // Customer Login
  customerLogin: (data) => apiClient.post('/auth/customer/login', data),

  // Vendor Registration
  vendorRegister: (data) => apiClient.post('/auth/vendor/register', data),

  // Vendor Login
  vendorLogin: (data) => apiClient.post('/auth/vendor/login', data),

  // Admin Registration
  adminRegister: (data) => apiClient.post('/auth/admin/register', data),

  // Admin Login
  adminLogin: (data) => apiClient.post('/auth/admin/login', data),

  // Verify Token
  verifyToken: () => apiClient.get('/auth/verify'),

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    disconnectSocket();
  }
};

// ==========================================
// PRODUCT APIs
// ==========================================
export const productAPI = {
  // Get all products with filters
  getAllProducts: (params) => apiClient.get('/products', { params }),

  // Get single product
  getProduct: (id) => apiClient.get(`/products/${id}`),

  // Create product (vendor only)
  createProduct: (data) => apiClient.post('/products', data),

  // Update product (vendor only)
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),

  // Delete product (vendor only)
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),

  // Get vendor's products
  getVendorProducts: () => apiClient.get('/products/vendor/my-products')
};

// ==========================================
// VENDOR APIs
// ==========================================
export const vendorAPI = {
  // Get vendor profile
  getProfile: () => apiClient.get('/vendors/profile'),

  // Update vendor profile
  updateProfile: (data) => apiClient.put('/vendors/profile', data),

  // Get dashboard stats
  getDashboardStats: () => apiClient.get('/vendors/dashboard/stats'),

  // Get all vendors
  getAllVendors: () => apiClient.get('/vendors'),

  // Get single vendor
  getVendor: (id) => apiClient.get(`/vendors/${id}`)
};

// ==========================================
// CART APIs
// ==========================================
export const cartAPI = {
  // Get cart
  getCart: () => apiClient.get('/cart'),

  // Add to cart
  addToCart: (productId) => apiClient.post('/cart/add', { productId }),

  // Remove from cart
  removeFromCart: (productId) => apiClient.delete(`/cart/remove/${productId}`),

  // Clear cart
  clearCart: () => apiClient.delete('/cart/clear'),

  //Quantity update 
  updateQuantity: (productId, quantity) => apiClient.put('/cart/quantity', { productId : productId , quantity : quantity })
};

// ==========================================
// ORDER APIs
// ==========================================
export const orderAPI = {
  // Create order without payment capture
  createOrder: (data) => apiClient.post('/orders', data),

  // Create a Razorpay checkout order and save the pending order record
  createRazorpayCheckout: (data) => apiClient.post('/orders/checkout', data),

  // Verify Razorpay payment signature after client-side success
  verifyRazorpayPayment: (data) => apiClient.post('/orders/razorpay/verify', data),

  // Request a refund for an order (95% return, 5% admin retains commission)
  refundOrder: (orderId, reason) => apiClient.post(`/orders/${orderId}/refund`, { reason }),

  // Get user's orders
  getMyOrders: () => apiClient.get('/orders/my-orders'),

  // Get single order
  getOrder: (id) => apiClient.get(`/orders/${id}`),

  // Get vendor's orders
  getVendorOrders: () => apiClient.get('/orders/vendor/orders'),

  // Update order status
  updateOrderStatus: (id, orderStatus) => 
    apiClient.put(`/orders/${id}/status`, { orderStatus })
};

// ==========================================
// CHAT APIs
// ==========================================
export const chatAPI = {
  // Create or get chat room
  createOrGetChatRoom: (orderId) => 
    apiClient.post('/chat/create-or-get', { orderId }),

  // Get chat room details
  getChatRoom: (chatRoomId) => apiClient.get(`/chat/${chatRoomId}`),

  // Get customer's chat rooms
  getCustomerChats: () => apiClient.get('/chat/customer/all'),

  // Get vendor's chat rooms
  getVendorChats: () => apiClient.get('/chat/vendor/all'),

  // Send message
  sendMessage: (chatRoomId, content) => 
    apiClient.post(`/chat/${chatRoomId}/message`, { content }),

  // Mark as read
  markAsRead: (chatRoomId) => 
    apiClient.put(`/chat/${chatRoomId}/mark-read`),

  // Get unread count
  getUnreadCount: () => apiClient.get('/chat/unread/count')
};

// ==========================================
// Socket.io Chat Events (emit to server)
// ==========================================
export const chatSocketEvents = {
  joinChatRoom: (chatRoomId, userId, role) => {
    if (socket) {
      socket.emit('join_chat_room', { chatRoomId, userId, role });
    }
  },

  sendMessage: (chatRoomId, senderId, senderType, content) => {
    if (socket) {
      socket.emit('send_message', {
        chatRoomId,
        senderId,
        senderType,
        content,
        timestamp: new Date()
      });
    }
  },

  userTyping: (chatRoomId, userId, role) => {
    if (socket) {
      socket.emit('typing', { chatRoomId, userId, role });
    }
  },

  stopTyping: (chatRoomId, userId) => {
    if (socket) {
      socket.emit('stop_typing', { chatRoomId, userId });
    }
  },

  leaveChatRoom: (chatRoomId, userId) => {
    if (socket) {
      socket.emit('leave_chat_room', { chatRoomId, userId });
    }
  },

  userOnline: (userId, role) => {
    if (socket) {
      socket.emit('user_online', { userId, role });
    }
  }
};

export default {
  apiClient,
  authAPI,
  productAPI,
  vendorAPI,
  cartAPI,
  orderAPI,
  chatAPI,
  chatSocketEvents,
  initializeSocket,
  disconnectSocket
};
