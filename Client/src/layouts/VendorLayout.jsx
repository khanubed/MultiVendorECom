import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, MessageSquare } from "lucide-react";

const VendorLayout = () => {
  const navItems = [
    { to: "/vendor", label: "Analytics Console", icon: LayoutDashboard },
    { to: "/vendor/products", label: "Product Catalog", icon: Package },
    { to: "/vendor/orders", label: "Order Fulfillment", icon: ShoppingBag },
    { to: "/vendor/chat", label: "Live Support Hub", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      
      {/* PERSISTENT NAVIGATION SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950">M</div>
            <div>
              <h1 className="text-sm font-black tracking-tight">Merchant Central</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Vendor Control Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" /> {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center font-medium">
          Dashboard v4.0 &bull; Live Client Session
        </div>
      </aside>

      {/* DYNAMIC SUB-PAGE WORKSPACE VIEWPORT */}
      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-5">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Store Management Console</h2>
            <p className="text-xs text-slate-400 font-medium">Manage and audit your operational storefront assets seamlessly.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl">Socket Gateway: Active</span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* Target area where page sub-components are rendered */}
        </div>
      </main>
    </div>
  );
};

export default VendorLayout;