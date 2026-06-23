# Server API Integration Guide

## Overview
This guide explains how to integrate the client with the server API and WebSocket for real-time chat functionality.

## Environment Configuration

Create a `.env` file in the Client directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /auth/customer/register` - Customer registration
- `POST /auth/customer/login` - Customer login
- `POST /auth/vendor/register` - Vendor registration
- `POST /auth/vendor/login` - Vendor login
- `GET /auth/verify` - Verify authentication token

### Products
- `GET /products` - Get all products (with filters)
  - Query params: `category`, `minPrice`, `maxPrice`, `vendor`, `search`, `page`, `limit`
- `GET /products/:id` - Get single product
- `POST /products` - Create product (vendor only)
- `PUT /products/:id` - Update product (vendor only)
- `DELETE /products/:id` - Delete product (vendor only)

### Cart
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add product to cart
- `DELETE /cart/remove/:productId` - Remove product from cart
- `DELETE /cart/clear` - Clear entire cart

### Orders
- `POST /orders` - Create new order
- `GET /orders/my-orders` - Get user's orders
- `GET /orders/:id` - Get single order
- `GET /orders/vendor/orders` - Get vendor's orders
- `PUT /orders/:id/status` - Update order status

### Vendors
- `GET /vendors` - Get all vendors
- `GET /vendors/:id` - Get single vendor
- `GET /vendors/profile` - Get vendor profile
- `PUT /vendors/profile` - Update vendor profile
- `GET /vendors/dashboard/stats` - Get vendor dashboard stats

### Chat
- `POST /chat/create-or-get` - Create or get chat room
- `GET /chat/:chatRoomId` - Get chat room details
- `GET /chat/customer/all` - Get customer's chat rooms
- `GET /chat/vendor/all` - Get vendor's chat rooms
- `POST /chat/:chatRoomId/message` - Send message
- `PUT /chat/:chatRoomId/mark-read` - Mark messages as read

## Client Implementation

### 1. Setup API Service

Import the API service in your components:
```javascript
import { authAPI, productAPI, cartAPI, orderAPI, chatAPI, initializeSocket } from '@/services/api';
```

### 2. Authentication Flow

```javascript
// Login
const { data } = await authAPI.customerLogin({ email, password });
localStorage.setItem('authToken', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Initialize socket connection
initializeSocket(data.token);

// Verify token on app load
try {
  await authAPI.verifyToken();
  // User is authenticated
} catch {
  // User is not authenticated
}
```

### 3. Product Management

```javascript
// Get all products
const { data } = await productAPI.getAllProducts({
  category: 'Electronics',
  minPrice: 100,
  maxPrice: 1000,
  page: 1,
  limit: 12
});

// Get vendor's products
const { data } = await productAPI.getVendorProducts();
```

### 4. Cart Operations

```javascript
// Add to cart
await cartAPI.addToCart(productId);

// Get cart
const { data } = await cartAPI.getCart();

// Remove from cart
await cartAPI.removeFromCart(productId);
```

### 5. Order Management

```javascript
// Create order
const { data } = await orderAPI.createOrder({
  items: [
    { productId: '123', quantity: 2 }
  ],
  shippingAddress: {
    fullName: 'John Doe',
    addressLine1: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'USA'
  }
});

// Get user's orders
const { data } = await orderAPI.getMyOrders();
```

## Real-Time Chat Implementation

### 1. Initialize Socket Connection

After successful login:
```javascript
import { initializeSocket, chatSocketEvents } from '@/services/api';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('authToken');
initializeSocket(token);

// Notify server that user is online
chatSocketEvents.userOnline(user.id, user.role);
```

### 2. Join Chat Room

When customer clicks to message a vendor:
```javascript
import { chatAPI, chatSocketEvents } from '@/services/api';

// Create or get chat room for an order
const { data } = await chatAPI.createOrGetChatRoom(orderId);
const chatRoom = data.chatRoom;

// Join the chat room via socket
chatSocketEvents.joinChatRoom(chatRoom._id, user.id, user.role);
```

### 3. Send Message

```javascript
// Send via HTTP API (saves to database)
await chatAPI.sendMessage(chatRoomId, messageContent);

// Emit via Socket.io (real-time delivery)
chatSocketEvents.sendMessage(chatRoomId, user.id, user.role, messageContent);
```

### 4. Listen to Messages

```javascript
import { socket } from '@/services/api';

// Listen for incoming messages
socket.on('receive_message', (messageData) => {
  console.log('New message:', messageData);
  // Update component state
});

// Listen for user typing
socket.on('user_typing', (typingData) => {
  console.log('User is typing:', typingData);
});

// Listen for user stopped typing
socket.on('user_stopped_typing', (userData) => {
  console.log('User stopped typing:', userData);
});
```

### 5. Show Typing Indicator

```javascript
// Show typing indicator while user types
const handleMessageChange = (text) => {
  if (text.length > 0) {
    chatSocketEvents.userTyping(chatRoomId, user.id, user.role);
  } else {
    chatSocketEvents.stopTyping(chatRoomId, user.id);
  }
  setMessage(text);
};
```

## Chat Flow for Multi-Vendor Ecommerce

1. **Customer places order** → Creates order with items from one or more vendors
2. **Customer views order** → Sees option to message each vendor
3. **Customer clicks "Message Vendor"** → Chat room is created for that order
4. **Chat room creation** → Links customer + vendor + specific order
5. **Real-time messaging** → WebSocket enables instant communication
6. **Message persistence** → All messages saved to database
7. **Vendor responds** → Can update order status and communicate

## Error Handling

```javascript
import { apiClient } from '@/services/api';

try {
  const response = await productAPI.getProduct(id);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired, redirect to login
  } else if (error.response?.status === 403) {
    // Unauthorized access
  } else {
    // Other error
    console.error(error.message);
  }
}
```

## Socket.io Status Updates

Monitor user status across the application:

```javascript
import { socket } from '@/services/api';

socket.on('user_status_update', (statusData) => {
  // statusData = { userId, status: 'online' | 'offline', role }
  updateUserStatusInUI(statusData);
});

socket.on('user_joined_chat', (joinData) => {
  // User joined the chat room
  console.log(`${joinData.userId} joined chat`);
});

socket.on('user_left_chat', (leftData) => {
  // User left the chat room
  console.log(`${leftData.userId} left chat`);
});
```

## Testing

### Test Customer Flow
1. Register/login as customer
2. Browse products
3. Add products to cart
4. Create order
5. Start chat with vendor
6. Send/receive messages

### Test Vendor Flow
1. Register/login as vendor
2. View dashboard statistics
3. View customer orders
4. Update order status
5. Respond to customer messages

## Notes
- All timestamps are in UTC
- Passwords are hashed with bcryptjs (never exposed)
- JWT tokens expire in 30 days
- WebSocket connections require valid token
- Chat messages are persisted in MongoDB
