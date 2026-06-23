import React, { useState } from "react";
import { Outlet ,NavLink } from "react-router-dom";
import SuperAdminLayout from "../../layouts/SuperAdminLayout";

const INITIAL_VENDORS = [
  { id: "v1", name: "Alex Mercer", storeName: "Apex Tech Labs", email: "alex@apexlabs.io", totalSales: 14820.50, status: "Active", productCount: 42, registeredAt: "2026-01-15" },
  { id: "v2", name: "Sarah Chen", storeName: "Ember & Clay Artisans", email: "chen.s@emberclay.com", totalSales: 8940.00, status: "Active", productCount: 19, registeredAt: "2026-02-03" },
  { id: "v3", name: "Marcus Brody", storeName: "Velocity Leather Co.", email: "marcus@velocity.net", totalSales: 0.00, status: "Pending Review", productCount: 3, registeredAt: "2026-06-20" },
  { id: "v4", name: "David Vance", storeName: "Vance Cryptic Keys", email: "vance@cryptickeys.org", totalSales: 3150.25, status: "Suspended", productCount: 12, registeredAt: "2025-11-12" },
];

const INITIAL_PRODUCTS = [
  { id: "p1", name: "Premium Artisan Stoneware Plate", vendorName: "Ember & Clay Artisans", price: 34.99, category: "Home & Living", stock: 142, status: "Approved", imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861ecfa?q=80&w=200" },
  { id: "p2", name: "Ergonomic Mechanical Keyboard", vendorName: "Apex Tech Labs", price: 189.99, category: "Electronics", stock: 28, status: "Pending Review", imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=200" },
  { id: "p3", name: "Minimalist Full-Grain Passport Wallet", vendorName: "Velocity Leather Co.", price: 75.00, category: "Accessories", stock: 0, status: "Approved", imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=200" },
  { id: "p4", name: "Anodized Keycap Artisan Esc Set", vendorName: "Vance Cryptic Keys", price: 45.00, category: "Electronics", stock: 5, status: "Suspended", imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200" },
];

const SuperAdminHub = () => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // METRIC RUNTIME COMPUTATIONS
  const globalGrossSales = vendors.reduce((acc, curr) => acc + curr.totalSales, 0);
  const pendingProductsList = products.filter((p) => p.status === "Pending Review");

  // TRANSACTION MUTATORS
  const handleToggleVendorStatus = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: v.status === "Active" ? "Suspended" : "Active" } : v))
    );
  };

  const handleUpdateProductStatus = (productId, newStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">SA</div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-1.5">
                Root System Controller <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">Tier-1</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Global Network Node Management Interface</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
            <NavLink to="/admin/overview" className={({ isActive }) => `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}>Overview</NavLink>
            <NavLink to="/admin/vendors" className={({ isActive }) => `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}>Vendors</NavLink>
            <NavLink to="/admin/products" className={({ isActive }) => `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isActive ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"}`}>Products</NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{
          vendors,
          products,
          globalGrossSales,
          pendingProductsList,
          handleToggleVendorStatus,
          handleUpdateProductStatus
        }} />
      </main>
    </div>
  );
};

export default SuperAdminHub;