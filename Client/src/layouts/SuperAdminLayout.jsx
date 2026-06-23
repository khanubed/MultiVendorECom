import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* SYSTEM CONTROLLER TOP NAVIGATION BAR */}
      <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
              SA
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-1.5">
                Root System Controller <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">Tier-1</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Global Network Node Management Interface</p>
            </div>
          </div>

          {/* DECLARATIVE URL LINK SWITCH PANEL */}
          <nav className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
            {[
              { path: "/admin/overview", label: "Overview" },
              { path: "/admin/vendors", label: "Vendors" },
              { path: "/admin/products", label: "Products" }
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isActive 
                      ? "bg-slate-800 text-white shadow-xs" 
                      : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* ROUTER CONTENT TARGET FRAME */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;