import express from 'express';
import ChatRoom from '../models/chat.schema.js';
import Order from '../models/order.schema.js';
import Product from '../models/product.schema.js';
import User from '../models/user.schema.js';
import Vendor from '../models/vendor.schema.js';
import { verifyToken, isCustomer, isVendor } from '../middleware/auth.middleware.js';

const router = express.Router();

// ==========================================
// CHAT ROUTES
// ==========================================

/**
 * POST: Get or create chat room for order
 * Customer can only chat after they have ordered from a vendor
 */
router.post('/create-or-get', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify user is either customer or vendor in this order
    if (req.user.role === 'customer') {
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    } else if (req.user.role === 'vendor') {
      // Verify vendor sells products in this order
      const vendorProducts = await Product.find({ vendor: req.user.id }, '_id');
      const hasVendorProduct = order.items.some(item =>
        vendorProducts.some(p => p._id.equals(item.product))
      );

      if (!hasVendorProduct) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
    }

    // Find vendor who sold the first item
    const firstProduct = await Product.findById(order.items[0].product);
    const vendor = firstProduct.vendor;

    let chatRoom = await ChatRoom.findOne({
      customer: order.user,
      vendor: vendor,
      order: orderId
    }).populate('messages');

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        customer: order.user,
        vendor: vendor,
        order: orderId,
        messages: []
      });
      await chatRoom.save();
    }

    res.status(200).json({ 
      success: true, 
      chatRoom 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch all chat rooms for customer
 * IMPORTANT: Static routes must be registered BEFORE parameterized /:chatRoomId
 */
router.get('/customer/all', verifyToken, isCustomer, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({ customer: req.user.id })
      .populate('vendor', 'name email')
      .populate('order')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({ 
      success: true, 
      chatRooms 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch all chat rooms for vendor
 */
router.get('/vendor/all', verifyToken, isVendor, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({ vendor: req.user.id })
      .populate('customer', 'name email phone')
      .populate('order')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({ 
      success: true, 
      chatRooms 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Count unread messages for user
 */
router.get('/unread/count', verifyToken, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'customer') {
      query = { customer: req.user.id };
    } else if (req.user.role === 'vendor') {
      query = { vendor: req.user.id };
    }

    const chatRooms = await ChatRoom.find(query);
    let unreadCount = 0;

    chatRooms.forEach(room => {
      room.messages.forEach(msg => {
        if (!msg.readAt && msg.sender.toString() !== req.user.id) {
          unreadCount++;
        }
      });
    });

    res.status(200).json({ 
      success: true, 
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET: Fetch chat room details
 * NOTE: This parameterized route MUST come after all static /chat/* routes
 */
router.get('/:chatRoomId', verifyToken, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId)
      .populate('customer', 'name email phone')
      .populate('vendor', 'name email phone')
      .populate('order');

    if (!chatRoom) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    res.status(200).json({ 
      success: true, 
      chatRoom 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST: Send message to chat room
 * Socket.io will handle real-time delivery
 */
router.post('/:chatRoomId/message', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const chatRoom = await ChatRoom.findById(req.params.chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    const senderType = req.user.role;
    const message = {
      sender: req.user.id,
      senderType,
      content: content.trim(),
      readAt: null
    };

    chatRoom.messages.push(message);
    chatRoom.lastMessage = content.trim();
    chatRoom.lastMessageTime = new Date();
    await chatRoom.save();

    // Emit real-time message via Socket.io to the chat room
    if (req.io) {
      req.io.to(req.params.chatRoomId).emit('receive_message', {
        chatRoomId: req.params.chatRoomId,
        message: {
          sender: req.user.id,
          senderType,
          content: content.trim(),
          createdAt: new Date()
        }
      });
    }

    const populatedChatRoom = await ChatRoom.findById(req.params.chatRoomId)
      .populate('customer', 'name email phone')
      .populate('vendor', 'name email phone');

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully',
      chatRoom: populatedChatRoom 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT: Mark messages as read
 */
router.put('/:chatRoomId/mark-read', verifyToken, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }

    // Mark all unread messages as read
    chatRoom.messages.forEach(msg => {
      if (!msg.readAt) {
        msg.readAt = new Date();
      }
    });

    await chatRoom.save();

    res.status(200).json({ 
      success: true, 
      message: 'Messages marked as read' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
