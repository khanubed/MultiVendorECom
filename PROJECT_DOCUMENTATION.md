# Multi-Vendor E-Commerce Platform

## Architecture Overview

This is a full-stack multi-vendor e-commerce platform with real-time customer-vendor communication.

### Tech Stack

**Frontend (Client):**
- React 19 with Vite
- React Router DOM for navigation
- Axios for API requests
- Socket.io-client for real-time chat
- Lucide React for icons
- React Hot Toast for notifications

**Backend (Server):**
- Node.js with Express
- MongoDB for database
- Socket.io for WebSocket communication
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
MultiVendorEcommerce/
├── Client/                          # React Frontend
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js              # Centralized API & Socket.io client
│   │   ├── pages/
│   │   │   ├── customer/           # Customer pages
│   │   │   │   ├── Auth/
│   │   │   │   ├── HomePage/
│   │   │   │   ├── ShopPage/
│   │   │   │   ├── CartPage/
│   │   │   │   ├── OrderTrackingPage/
│   │   │   │   └── VendorChat/
│   │   │   └── vendor/             # Vendor pages
│   │   │       ├── ProductsPage/
│   │   │       ├── CreateProductPage/
│   │   │       ├── OrdersPage/
│   │   │       ├── AnalyticsPage/
│   │   │       └── SupportChatPage/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── routes.jsx
│   └── .env
│
├── Server/                          # Node.js Backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── user.schema.js      # Customer model with role
│   │   │   ├── vendor.schema.js    # Vendor model
│   │   │   ├── product.schema.js   # Product model with vendor ref
│   │   │   ├── order.schema.js     # Order model
│   │   │   └── chat.schema.js      # Chat rooms & messages
│   │   ├── routes/
│   │   │   ├── auth.routes.js      # Authentication endpoints
│   │   │   ├── product.routes.js   # Product CRUD + filtering
│   │   │   ├── vendor.routes.js    # Vendor profile & analytics
│   │   │   ├── cart.routes.js      # Shopping cart operations
│   │   │   ├── order.routes.js     # Order management
│   │   │   └── chat.routes.js      # Chat room operations
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # JWT verification & role checks
│   │   └── utils/
│   │       ├── user.utils.js
│   │       └── helper.utils.js
│   ├── server.js                   # Main server file with Socket.io
│   ├── package.json
│   └── .env
│
└── API_INTEGRATION_GUIDE.md         # Complete API documentation
```

## Key Features

### 1. Multi-Vendor Support
- Multiple vendors can list products
- Each vendor manages their own products
- Customers can buy from multiple vendors in one order
- Each vendor has a unique dashboard

### 2. Real-Time Customer-Vendor Chat
- Chat initiated after order is placed
- One chat room per customer-vendor-order combination
- Real-time messaging via WebSocket
- Message persistence in database
- Typing indicators
- Message read status
- Unread message count

### 3. Authentication & Authorization
- Separate registration/login for customers and vendors
- JWT-based authentication
- Role-based access control (Customer, Vendor, Admin)
- Token expires in 30 days

### 4. Shopping Features
- Product browsing with filters (category, price range, search)
- Shopping cart management
- Order creation with multiple items
- Automatic stock management
- Shipping and tax calculations

### 5. Vendor Features
- Product CRUD operations
- Dashboard with statistics:
  - Total orders
  - Total revenue
  - Total products
  - Total stock
  - Average order value
- Order tracking with status updates

### 6. Order Management
- Order creation with item details
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Automatic cart clearing after order
- Payment information storage

## API Endpoints Summary

### Authentication
- `POST /auth/customer/register`
- `POST /auth/customer/login`
- `POST /auth/vendor/register`
- `POST /auth/vendor/login`
- `GET /auth/verify`

### Products
- `GET /products` (with filters and pagination)
- `GET /products/:id`
- `POST /products` (vendor only)
- `PUT /products/:id` (vendor only)
- `DELETE /products/:id` (vendor only)

### Cart
- `GET /cart`
- `POST /cart/add`
- `DELETE /cart/remove/:productId`
- `DELETE /cart/clear`

### Orders
- `POST /orders`
- `GET /orders/my-orders`
- `GET /orders/:id`
- `GET /orders/vendor/orders` (vendor only)
- `PUT /orders/:id/status` (vendor only)

### Vendors
- `GET /vendors`
- `GET /vendors/:id`
- `GET /vendors/profile` (vendor only)
- `PUT /vendors/profile` (vendor only)
- `GET /vendors/dashboard/stats` (vendor only)

### Chat
- `POST /chat/create-or-get`
- `GET /chat/:chatRoomId`
- `GET /chat/customer/all` (customer only)
- `GET /chat/vendor/all` (vendor only)
- `POST /chat/:chatRoomId/message`
- `PUT /chat/:chatRoomId/mark-read`

## WebSocket Events

### Emitted Events (from client)
- `user_online` - Notify server user is online
- `join_chat_room` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `leave_chat_room` - Leave a chat room

### Listened Events (from server)
- `user_status_update` - User online/offline status
- `receive_message` - New message received
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing
- `user_joined_chat` - User joined chat room
- `user_left_chat` - User left chat room

## Data Models

### User (Customer)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: Object,
  role: 'customer',
  walletBalance: Number,
  cart: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Vendor
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  pincode: String,
  role: 'vendor',
  status: 'active' | 'inactive',
  isActive: Boolean,
  isVerified: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  badge: String,
  isFeatured: Boolean,
  category: String,
  stock: Number,
  vendor: ObjectId (ref: Vendor),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId,
      quantity: Number,
      priceAtPurchase: Number
    }
  ],
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentInfo: {
    method: String,
    status: String,
    transactionId: String
  },
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  subtotal: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### ChatRoom
```javascript
{
  customer: ObjectId (ref: User),
  vendor: ObjectId (ref: Vendor),
  order: ObjectId (ref: Order),
  messages: [
    {
      sender: ObjectId,
      senderType: 'customer' | 'vendor',
      content: String,
      readAt: Date,
      createdAt: Date
    }
  ],
  isActive: Boolean,
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Chat Flow for Multi-Vendor Ecommerce

1. **Customer Places Order**
   - Selects products from various vendors
   - Creates single order
   - Items associated with respective vendors

2. **Order Confirmation**
   - Customer receives order confirmation
   - Sees list of vendors

3. **Contact Vendor**
   - Customer clicks "Message Vendor" button
   - System creates chat room for customer + vendor + order
   - Chat room initialized with empty messages array

4. **Real-Time Chat**
   - Both parties connected via WebSocket
   - Messages sent via Socket.io for real-time delivery
   - Messages persisted to database via REST API
   - Typing indicators shown
   - Message read status tracked

5. **Vendor Order Management**
   - Vendor sees incoming messages
   - Can update order status
   - Customer notified of status changes

6. **Chat Persistence**
   - All messages stored in MongoDB
   - Chat history available when reopening chat
   - Unread message count maintained

## Security Features

✅ Password hashing with bcryptjs  
✅ JWT authentication with expiration  
✅ Role-based access control  
✅ CORS enabled for specific origins  
✅ Input validation on all endpoints  
✅ Error handling with proper status codes  
✅ Protected routes requiring authentication  
✅ WebSocket authentication via token  

## Setup Instructions

### Server Setup
```bash
cd Server
npm install
# Update .env with your configuration
npm run dev
```

### Client Setup
```bash
cd Client
npm install
# Update .env with API URLs
npm run dev
```

## Testing the Chat Feature

1. **Open two browser windows:**
   - Window 1: Customer account
   - Window 2: Vendor account (different login)

2. **As customer:**
   - Register/login as customer
   - Browse and add products from vendor
   - Create order
   - Go to Orders page
   - Click "Message Vendor" button

3. **Chat Room Created:**
   - One unique chat per customer-vendor-order combo
   - Can have multiple chat rooms for same vendor if multiple orders

4. **Real-time Messaging:**
   - Type message as customer
   - Vendor receives instantly via WebSocket
   - Vendor can reply
   - Customer receives reply instantly
   - Both see typing indicators

5. **Order Updates:**
   - Vendor can update order status
   - Customer sees status changes
   - Chat remains active throughout order lifecycle

## Next Steps / Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] File upload for product images
- [ ] User reviews and ratings
- [ ] Order return/refund system
- [ ] Admin dashboard and analytics
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Advanced search and recommendations
- [ ] Vendor verification system
- [ ] Dispute resolution system
- [ ] Multi-language support

## Troubleshooting

### Chat not connecting
- Verify WebSocket URL in client .env
- Check MongoDB connection
- Ensure token is valid

### Messages not persisting
- Check MongoDB connection
- Verify order exists
- Check chatroom is created properly

### CORS errors
- Update CLIENT_URL in server .env
- Restart server after changing .env

### Authentication failing
- Ensure JWT_SECRET is same in .env
- Check token expiration
- Verify user exists in database

## License
ISC
