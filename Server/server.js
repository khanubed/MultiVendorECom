import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import vendorRoutes from './src/routes/vendor.routes.js';
import cartRoutes from './src/routes/cart.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import chatRoutes from './src/routes/chat.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ==========================================
// 1. MIDDLEWARES & CORS CONFIGURATION
// ==========================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl && req.originalUrl.includes('/api/v1/orders/webhook/razorpay')) {
            req.rawBody = buf;
        }
    }
}));
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. DATABASE CONNECTION
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexusmarket';
mongoose.connect(MONGO_URI)
    .then(() => console.log('🚀 MongoDB connected successfully.'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==========================================
// 3. REAL-TIME COMMUNICATION (SOCKET.IO)
// ==========================================
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Store active connections
const activeUsers = new Map(); // { userId: socketId }
const chatSessions = new Map(); // { chatRoomId: [userIds] }

// Real-time Chat Architecture for Customer-Vendor support
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // User registers themselves after login
    socket.on('user_online', (userData) => {
        activeUsers.set(userData.userId, socket.id);
        console.log(`✅ User ${userData.userId} (${userData.role}) is online`);
        io.emit('user_status_update', {
            userId: userData.userId,
            status: 'online',
            role: userData.role
        });
    });

    // Join a specific chat room for an order
    socket.on('join_chat_room', ({ chatRoomId, userId, role }) => {
        socket.join(chatRoomId);
        if (!chatSessions.has(chatRoomId)) {
            chatSessions.set(chatRoomId, []);
        }
        const users = chatSessions.get(chatRoomId);
        if (!users.includes(userId)) {
            users.push(userId);
        }
        console.log(`👤 User [${userId}] joined chat room: ${chatRoomId}`);
        
        io.to(chatRoomId).emit('user_joined_chat', {
            userId,
            role,
            chatRoomId,
            timestamp: new Date()
        });
    });

    // Handle instant messaging between vendor and customer
    socket.on('send_message', (messageData) => {
        const { chatRoomId, senderId, senderType, content, timestamp } = messageData;
        
        // Broadcast message to all users in the chat room
        io.to(chatRoomId).emit('receive_message', {
            chatRoomId,
            senderId,
            senderType,
            content,
            timestamp,
            socketId: socket.id
        });

        console.log(`💬 Message sent in chat ${chatRoomId} by ${senderId}`);
    });

    // Handle typing indicator
    socket.on('typing', ({ chatRoomId, userId, role }) => {
        socket.to(chatRoomId).emit('user_typing', {
            userId,
            role,
            chatRoomId
        });
    });

    // Handle stop typing
    socket.on('stop_typing', ({ chatRoomId, userId }) => {
        socket.to(chatRoomId).emit('user_stopped_typing', {
            userId,
            chatRoomId
        });
    });

    // Leave chat room
    socket.on('leave_chat_room', ({ chatRoomId, userId }) => {
        socket.leave(chatRoomId);
        if (chatSessions.has(chatRoomId)) {
            const users = chatSessions.get(chatRoomId);
            const index = users.indexOf(userId);
            if (index > -1) {
                users.splice(index, 1);
            }
        }
        
        io.to(chatRoomId).emit('user_left_chat', {
            userId,
            chatRoomId,
            timestamp: new Date()
        });

        console.log(`👤 User [${userId}] left chat room: ${chatRoomId}`);
    });

    socket.on('disconnect', () => {
        // Find and remove user
        for (const [userId, socketId] of activeUsers.entries()) {
            if (socketId === socket.id) {
                activeUsers.delete(userId);
                io.emit('user_status_update', {
                    userId,
                    status: 'offline'
                });
                console.log(`🔌 User ${userId} disconnected`);
                break;
            }
        }

        // Remove from chat sessions
        for (const [chatRoomId, users] of chatSessions.entries()) {
            const filteredUsers = users.filter(id => activeUsers.has(id));
            if (filteredUsers.length > 0) {
                chatSessions.set(chatRoomId, filteredUsers);
            } else {
                chatSessions.delete(chatRoomId);
            }
        }
    });
});

// Pass the 'io' instance to req object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ==========================================
// 4. API ROUTES MAPPING
// ==========================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date(),
        message: 'Multi-Vendor E-commerce API is running' 
    });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/chat', chatRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err })
    });
});

// ==========================================
// 5. START SERVER
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    console.log(`⚡ Server running on port ${PORT}`);
    console.log(`💬 WebSocket server layer attached and listening.`);
    console.log(
      `🌐 CORS enabled for: ${
        process.env.CLIENT_URL || "http://localhost:3000"
      }`
    );
  });
}

export default server;