# Multi-Vendor E-Commerce Platform

A complete full-stack multi-vendor e-commerce solution with real-time customer-vendor chat, product management, order tracking, and vendor analytics.

## 🚀 Features

### Customer Features
- 🛍️ Browse products from multiple vendors
- 🔍 Filter and search products
- 🛒 Shopping cart management
- 📦 Place orders from multiple vendors
- 📊 Track order status
- 💬 Real-time chat with vendors
- 🔔 Typing indicators and online status

### Vendor Features
- 📱 Product management (create, edit, delete)
- 📈 Dashboard with analytics and statistics
- 📋 View customer orders
- ✏️ Update order status
- 💬 Respond to customer inquiries in real-time
- 📊 Revenue tracking

### Admin Features (Framework ready)
- 👥 User management
- 🏢 Vendor verification
- 📊 Platform analytics

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Socket.io** - WebSocket communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## 📋 Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn
- Two browsers for testing (Customer + Vendor)

## 🚀 Quick Start

### 1. Clone and Install
```bash
# Server setup
cd Server
npm install

# Client setup
cd Client
npm install
```

### 2. Configure Environment
```bash
# Server
cp Server/.env.example Server/.env
# Update with your MongoDB URI and JWT secret

# Client
# .env already configured for localhost
```

### 3. Start Services
```bash
# Terminal 1: Start Server
cd Server
npm run dev

# Terminal 2: Start Client
cd Client
npm run dev
```

### 4. Access Application
- Client: http://localhost:5173
- Server API: http://localhost:5000/api/v1
- Health Check: http://localhost:5000/health

## 📚 Documentation

- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Step-by-step setup and testing
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Complete API documentation
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Architecture and design
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built

## 🔌 API Endpoints

| Category | Count | Examples |
|----------|-------|----------|
| Auth | 5 | POST /register, POST /login |
| Products | 7 | GET /products, POST /products (vendor) |
| Vendors | 5 | GET /vendors, GET /dashboard/stats |
| Cart | 4 | GET /cart, POST /cart/add |
| Orders | 6 | POST /orders, GET /orders/my-orders |
| Chat | 7 | POST /chat/create-or-get, POST /chat/:id/message |

**Total: 34 endpoints**

## 💬 Real-Time Chat

### How It Works
1. Customer places order with products from vendor
2. Customer clicks "Message Vendor" on order details
3. Unique chat room created (Customer + Vendor + Order)
4. WebSocket connection established via Socket.io
5. Messages sent in real-time and persisted to database
6. Both parties see typing indicators and online status

### Socket.io Events
- `join_chat_room` - Enter chat room
- `send_message` - Send message (real-time)
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `user_online` - User is online
- `receive_message` - Receive message
- `user_joined_chat` - User joined chat
- `user_left_chat` - User left chat

## 📁 Project Structure

```
MultiVendorEcommerce/
├── Server/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & validation
│   │   └── utils/           # Helper functions
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
│
├── Client/
│   ├── src/
│   │   ├── services/        # API & WebSocket client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Global state
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── layouts/         # Layout wrappers
│   ├── package.json
│   └── .env
│
├── Documentation/
│   ├── API_INTEGRATION_GUIDE.md
│   ├── PROJECT_DOCUMENTATION.md
│   ├── QUICK_START_GUIDE.md
│   └── IMPLEMENTATION_SUMMARY.md
```

## 🔐 Security Features

✅ Password hashing with bcryptjs  
✅ JWT authentication with expiration  
✅ Role-based access control  
✅ CORS protection  
✅ Input validation  
✅ WebSocket authentication  
✅ Protected API endpoints  
✅ Secure error responses  

## 🧪 Testing

### Test Customer Flow
1. Register as customer
2. Browse products from vendors
3. Add to cart
4. Create order
5. Message vendor
6. Send/receive messages

### Test Vendor Flow
1. Register as vendor
2. Create products
3. View customer orders
4. Update order status
5. Respond to messages
6. Check dashboard analytics

See [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) for detailed testing instructions.

## 📊 Database Models

### User (Customer)
- name, email, password (hashed)
- phone, address
- role: 'customer'
- cart: [Product IDs]
- wallet balance

### Vendor
- name, email, password (hashed)
- phone, address, city, state, zip, country
- role: 'vendor'
- verification status, active status

### Product
- name, price, description, image
- category, stock, badge
- vendor: Vendor ID (foreign key)
- featured flag

### Order
- user: User ID
- items: [{product, quantity, price}]
- shipping address
- payment info
- status: pending → processing → shipped → delivered
- totals: subtotal, tax, shipping, total

### ChatRoom
- customer: User ID
- vendor: Vendor ID
- order: Order ID
- messages: [{sender, content, timestamp}]
- last message & time

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables in platform
# Deploy Server folder
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Update VITE_API_URL to production server
npm run build
# Deploy build folder
```

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email & SMS notifications
- [ ] User reviews and ratings
- [ ] Advanced search with ML recommendations
- [ ] Video chat in customer-vendor communication
- [ ] Order return/refund system
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dispute resolution system

## 📞 Support

- Check [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) for troubleshooting
- Review [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for API details
- Check browser console for client-side errors
- Check server logs for backend errors

## 📄 License

ISC

## 👥 Contributors

Built for a multi-vendor e-commerce platform

---

**Get started now!** Follow the [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) to set up and test the application. 🚀
# MultiVendorECom
