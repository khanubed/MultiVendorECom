import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/customer/HomePage/HomePage";
import CustomerLayout from "./layouts/CustomerLayout";
import ShopPage from "./pages/customer/ShopPage/ShopPage";
import CartPage from "./pages/customer/CartPage/CartPage";
import VendorMessagingHub from "./pages/customer/VendorChat/VendorMessagingHub";
import OrderTrackingPage from "./pages/customer/OrderTrackingPage/OrderTrackingPage";
import OrderListingPage from "./pages/customer/OrderTrackingPage/OrderListingPage";
import LoginPage from "./pages/customer/Auth/LoginPage";
import RegistrationPage from "./pages/customer/Auth/RegistrationPage";
import VendorLayout from "./layouts/VendorLayout";
import AnalyticsPage from "./pages/vendor/AnalyticsPage";
import ProductsPage from "./pages/vendor/ProductsPage";
import OrdersPage from "./pages/vendor/OrdersPage";
import SupportChatPage from "./pages/vendor/SupportChatPage";
import CreateProductPage from "./pages/vendor/CreateProductPage";
import EditProductPage from "./pages/vendor/EditProductPage";
import AuthPage from "./pages/vendor/AuthPage";
import SuperAdminHub from "./pages/admin/SuperAdminHub";
import OverviewTab from "./pages/admin/OverviewTab";
import VendorsTab from "./pages/admin/VendorsTab";
import ProductsTab from "./pages/admin/ProductsTab";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />, // Persistent wrapper shell
    children: [
      {
        index: true, // Loads at exact "/" path
        element: <HomePage />,
      },
      {
        path: "orders",
        element: <ProtectedRoute element={<OrderListingPage />} requiredRoles={['customer']} />,
      },
      {
        path: "shop",
        element: <ProtectedRoute element={<ShopPage />} requiredRoles={['customer', 'vendor']} />,
      },
      {
        path: "cart",
        element: <ProtectedRoute element={<CartPage />} requiredRoles={['customer']} />,
      },
      {
        path: "vendor-chat/:id",
        element: <ProtectedRoute element={<VendorMessagingHub />} requiredRoles={['customer']} />,
      },
      {
        path: "tracking/:id",
        element: <ProtectedRoute element={<OrderTrackingPage />} requiredRoles={['customer']} />,
      },
      {
        path: "vendor-chat",
        element: <ProtectedRoute element={<VendorMessagingHub />} requiredRoles={['customer']} />,
      },
    ],
  },
  {
    path: "login",
    element: <PublicRoute element={<LoginPage />} />,
  },
  {
    path: "register",
    element: <PublicRoute element={<RegistrationPage />} />,
  },
  {
    path: "vendor",
    element: <ProtectedRoute element={<VendorLayout />} requiredRoles={['vendor']} />,
    children: [
      {
        index: true,
        element: <AnalyticsPage />,
      },

      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: "add",
            element: <CreateProductPage />,
          },
          {
            path: "edit/:id",
            element: <EditProductPage />,
          },
        ],
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "chat",
        element: <SupportChatPage />,
      },
    ],
  },
  {
    path: "vendor/auth",
    element: <PublicRoute element={<AuthPage />} />,
  },
  {
    path: "/admin",
    element : <ProtectedRoute element={<SuperAdminHub/>} requiredRoles={['admin']} />,
    children: [
      {
        index : true ,
        element: <Navigate to="/admin/overview" replace />,
      },
      {
        path : 'overview',
        element : <OverviewTab />
      },
      {
        path : 'vendors' ,
        element: <VendorsTab />
      },
      {
        path : 'products',
        element : <ProductsTab />
      }
    ],
  },
  {
    path: "/admin/login",
    element: <PublicRoute element={<AdminLoginPage />} />,
  },
  {
    path: "*", // Fallback wildcard route for 404s
    element: <Navigate to="/" replace />, 
  },
]);
