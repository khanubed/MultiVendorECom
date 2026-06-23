nexus-market/
├── frontend/                     # Frontend Application
│   ├── public/                   # Static assets (images, icons)
│   └── src/
│       ├── assets/               # Global styles, fonts
│       ├── components/           # Reusable UI components
│       │   ├── common/           # Buttons, Inputs, Modals, Loaders
│       │   ├── customer/         # ChatWidget, ProductCard, OrderTracker
│       │   ├── vendor/           # RefundRow, CommissionLedger
│       │   └── admin/            # WebhookLogTable, CommissionConfig
│       ├── layouts/              # Wrapper Layouts
│       │   ├── CustomerLayout.jsx
│       │   ├── VendorDashboardLayout.jsx
│       │   └── AdminConsoleLayout.jsx
│       ├── context/              # Global State Management
│       │   ├── AuthContext.jsx   # Role-based JWT storage
│       │   └── SocketContext.jsx # Global WebSocket instance
│       ├── hooks/                # Custom React Hooks
│       │   ├── useAuth.js
│       │   └── useSocket.js
│       ├── pages/ / app/         # Routing pages
│       ├── services/             # API Interceptors (Axios instances)
│       │   ├── api.js            # Base Axios config
│       │   └── webhooks.js       # Admin webhook testers
│       └── utils/                # Formatters (currency, dates)
│
└── backend/                      # Backend Application
    ├── config/                   # Configuration files (db.js, passport.js)
    ├── src/
    │   ├── controllers/          # Business logic handlers
    │   │   ├── auth.controller.js
    │   │   ├── order.controller.js
    │   │   ├── refund.controller.js
    │   │   └── webhook.controller.js # Critical: Stripe/PayPal webhook raw handlers
    │   ├── middlewares/          # Route guards
    │   │   ├── auth.middleware.js    # Verifies JWT
    │   │   └── role.middleware.js    # Restricts to Admin or Vendor
    │   ├── models/               # Database Schemas (Mongoose/Sequelize)
    │   │   ├── User.js           # Roles: 'customer', 'vendor', 'admin'
    │   │   ├── Product.js
    │   │   ├── Order.js          # Tracks payouts & adminCommission charged
    │   │   ├── Refund.js         # Tracks status: 'pending', 'approved'
    │   │   └── WebhookLog.js     # Stores gateway incoming payload logs
    │   ├── routes/               # Express endpoints API mapping
    │   ├── services/             # Third-party integrations
    │   │   ├── stripe.service.js
    │   │   └── socket.service.js # Handles WebSocket message broadcasting
    │   └── utils/                # Helper functions
    ├── .env                      # Environment variables
    └── server.js                 # App Entry Point (Spawns HTTP & WebSockets)