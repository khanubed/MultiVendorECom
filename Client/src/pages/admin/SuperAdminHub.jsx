import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { adminApi } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const SuperAdminHub = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [dashboardLiveMetrics , setDashboardLiveMetrics] = useState({
    totalRevenue: 0,
    activeVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data } = await adminApi.getAllProducts();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    const getDashboardStats = async () => {
      try {
        const { data } = await adminApi.getDashboardStats();
        if (data.success) {
          console.log(data.metrics)
          setDashboardLiveMetrics(data.metrics)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchAllProducts();
    getDashboardStats();
  }, []);

  // METRIC RUNTIME COMPUTATIONS
  const globalGrossSales = vendors.reduce(
    (acc, curr) => acc + (curr.totalSales || 0),
    0,
  );
  const pendingProductsList = products.filter(
    (p) => p.status === "Pending Review",
  );

  // ADMINISTRATIVE LOGOUT FLOW
  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } catch (error) {
      console.error("Authentication provider logout interruption:", error);
    } finally {
      // Complete safety net reset to wipe any state leftovers
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.clear();
      
      // Redirect out to target gateway
      navigate("/admin/login", { replace: true });
    }
  };

  // TRANSACTION MUTATORS
  const handleToggleVendorStatus = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, status: v.status === "Active" ? "Suspended" : "Active" }
          : v,
      ),
    );
  };

  const handleUpdateProductStatus = async (productId, newStatus) => {
    try {
      const { data } = await adminApi.updateProductStatus(productId, newStatus);
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, approvalStatus: data.product.approvalStatus }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const { data } = await adminApi.updateProductFeatured(productId);
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, isFeatured: data.product.isFeatured }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand/Identity Flag */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
              SA
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-1.5">
                Root System Controller{" "}
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                  Tier-1
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Global Network Node Management Interface
              </p>
            </div>
          </div>

          {/* Navigation and System Termination Toolbar */}
          <div className="flex items-center gap-4">
            <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
              <NavLink
                to="/admin/overview"
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                Overview
              </NavLink>
              <NavLink
                to="/admin/vendors"
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                Vendors
              </NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                Products
              </NavLink>
            </nav>

            <div className="h-6 w-px bg-slate-800" /> {/* Divider Element */}

            {/* LIVE ACTION SYSTEM LOGOUT TRIGGER */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl border border-slate-800/80 hover:border-rose-500/20 transition-all cursor-pointer group active:scale-95"
              title="Terminate Admin Session"
            >
              <LogOut className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet
          context={{
            vendors,
            products,
            globalGrossSales,
            pendingProductsList,
            handleToggleVendorStatus,
            handleUpdateProductStatus,
            handleToggleFeatured,
            dashboardLiveMetrics,
          }}
        />
      </main>
    </div>
  );
};

export default SuperAdminHub;