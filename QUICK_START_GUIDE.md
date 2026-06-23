# Quick Start Guide

## 📋 Prerequisites
- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas connection string
- Two browser windows for testing (Customer + Vendor)

## 🚀 Server Setup

### 1. Install Dependencies
```bash
cd Server
npm install
```

### 2. Configure Environment
Copy the example env file and update it:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nexusmarket
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Start the Server
```bash
npm run dev
```

Expected output:
```
⚡ Server running on port 5000
💬 WebSocket server layer attached and listening.
🌐 CORS enabled for: http://localhost:5173
🚀 MongoDB connected successfully.
```

## 🎨 Client Setup

### 1. Install Dependencies
```bash
cd Client
npm install
```

### 2. Configure Environment
The `.env` file is already set up:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=http://localhost:5000
```

### 3. Start the Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v8.0.12  dev server running at:
  ➜  Local:   http://localhost:5173/
```

## 🧪 Testing the System

### Part 1: Customer Registration & Login

**In Browser 1 (Customer):**

1. Navigate to `http://localhost:5173`
2. Click on "Login" or "Register"
3. Select "Customer" option
4. Register with:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: 1234567890

5. After registration, you'll be logged in as a customer

### Part 2: Vendor Registration

**In Browser 2 (New Tab - Vendor):**

1. Navigate to `http://localhost:5173`
2. Click on "Login" or "Register"
3. Select "Vendor" option
4. Register with:
   - Name: Tech Store
   - Email: vendor@example.com
   - Password: password123
   - Phone: 9876543210
   - Address: 123 Tech Street
   - City: New York
   - State: NY
   - Zip: 10001
   - Country: USA
   - Pincode: 10001

### Part 3: Vendor Creates Products

**In Browser 2 (Vendor Dashboard):**

1. Go to "Create Product" or "Products" section
2. Create a sample product:
   - Name: Wireless Headphones
   - Price: 99.99
   - Description: High-quality wireless headphones
   - Category: Electronics
   - Stock: 50
   - Image URL: (any valid image URL)

3. Click "Create Product"
4. Create 2-3 more products for testing

### Part 4: Customer Browses & Shops

**In Browser 1 (Customer):**

1. Go to "Shop" page
2. Browse the products created by the vendor
3. Add 2-3 products to cart
4. View cart and verify items
5. Proceed to checkout

### Part 5: Customer Creates Order

**In Browser 1 (Customer):**

1. In checkout, enter shipping address:
   - Full Name: John Doe
   - Address Line 1: 456 Main Street
   - City: Los Angeles
   - Postal Code: 90001
   - Country: USA

2. Click "Place Order"
3. You'll see the order confirmation

### Part 6: Open Chat Room

**In Browser 1 (Customer):**

1. Go to "My Orders" or "Order History"
2. Find the order you just created
3. Click "Message Vendor" button
4. A chat room will open

**In Browser 2 (Vendor):**

1. Go to "Messages" or "Support Chat"
2. You should see a new chat from the customer
3. Click on it to open the chat

### Part 7: Test Real-Time Chat

**In Browser 1 (Customer):**
1. Type: "Hi, when will my order ship?"
2. Click Send

**In Browser 2 (Vendor):**
1. You should see the message appear in real-time
2. Type: "Hi! We'll ship within 24 hours"
3. Click Send

**Back in Browser 1 (Customer):**
1. You should see the vendor's reply in real-time

## 🔍 Verifying Features

### ✅ Authentication
- [ ] Customer registration successful
- [ ] Vendor registration successful
- [ ] Login with credentials works
- [ ] Token stored in localStorage
- [ ] Can verify token at `/auth/verify`

### ✅ Products
- [ ] Vendor can create products
- [ ] Customer can view products
- [ ] Products show vendor info
- [ ] Can filter by category/price
- [ ] Vendor can edit/delete own products

### ✅ Cart
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Cart persists across pages
- [ ] Cart clears after order

### ✅ Orders
- [ ] Order creation calculates totals correctly
- [ ] Shipping ($50) and tax (10%) applied
- [ ] Vendor sees customer orders
- [ ] Order status can be updated
- [ ] Customer sees order history

### ✅ Real-Time Chat
- [ ] Chat room created on first message attempt
- [ ] Messages appear instantly (WebSocket)
- [ ] Messages saved to database
- [ ] Typing indicators show
- [ ] Can send multiple messages
- [ ] Chat history persists
- [ ] Works for multiple orders

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
# If yes, change PORT in .env or kill the process

# Verify MongoDB connection
# Test with: mongosh mongodb://localhost:27017/nexusmarket
```

### Client Shows CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Check `CLIENT_URL` in server `.env`
- Ensure it matches your client URL (http://localhost:5173)
- Restart server after changing

### Chat Not Working
- Verify WebSocket URL in `.env`: `VITE_WS_URL=http://localhost:5000`
- Check browser console for connection errors
- Verify both windows are logged in

### Messages Not Sending
- Check browser console for errors
- Verify chatRoomId is being passed correctly
- Ensure order exists in database

### Products Not Showing
- Verify vendor is logged in before creating products
- Check MongoDB has products collection
- Verify vendor ID is set correctly

## 📊 API Testing with Curl

### Register Customer
```bash
curl -X POST http://localhost:5000/api/v1/auth/customer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "description": "A test product",
    "imageUrl": "https://via.placeholder.com/300",
    "category": "Electronics",
    "stock": 50
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/v1/products?category=Electronics&limit=10
```

## 📱 Mobile Testing

The app is responsive and works on mobile. To test:

1. **Using DevTools:**
   - Press F12 in browser
   - Click device toolbar icon
   - Select iPhone or Android device

2. **Using Tunnel (if behind NAT):**
   - Use ngrok: `ngrok http 5000`
   - Use tunnel URL in client `.env`

## 🎓 Learning Resources

### Understanding the Chat Feature
1. Read [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
2. Check [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
3. Study the flow in "Chat Flow" section

### Debugging Tips
```javascript
// In browser console:
// Check stored token
console.log(localStorage.getItem('authToken'));

// Check user data
console.log(localStorage.getItem('user'));

// Monitor API calls
// Open Network tab in DevTools

// Monitor WebSocket
// Open Network → WS tab in DevTools
```

## 🚀 Next Steps

After verifying everything works:

1. **Enhance UI/UX**
   - Add better styling
   - Implement real product images
   - Add pagination

2. **Add Features**
   - Payment gateway integration
   - Email notifications
   - User ratings and reviews
   - Order tracking map

3. **Production Deployment**
   - Set up production MongoDB
   - Update environment variables
   - Deploy to hosting (Vercel, Heroku, AWS, etc.)

## 📞 Support

For issues or questions:
1. Check the error message carefully
2. Review the troubleshooting section
3. Check browser console for errors
4. Check server logs for backend errors
5. Verify all connections (MongoDB, WebSocket)

## ✨ Completed Features

✅ Multi-vendor product management  
✅ Customer shopping cart  
✅ Order creation and tracking  
✅ Real-time customer-vendor chat  
✅ JWT authentication  
✅ Role-based access control  
✅ Product filtering and search  
✅ Vendor analytics dashboard  
✅ WebSocket real-time communication  
✅ Database persistence  

Enjoy your multi-vendor e-commerce platform! 🎉
