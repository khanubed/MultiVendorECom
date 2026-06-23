import React, { useEffect, useState, useContext } from "react";
import { Search, LogOut, MessageSquare, ShoppingCart } from "lucide-react"; // Brought back MessageSquare and ShoppingCart
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 

const TopNavBar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavStyle = ({ isActive }) =>
    isActive
      ? "text-secondary font-bold border-b-2 border-secondary pb-1 text-label-md font-label-md"
      : "text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md border-b-2 border-transparent pb-1";

  return (
    <header
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-20 h-20 max-w-full mx-auto glass-header bg-surface/80 border-b border-outline-variant transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="flex items-center gap-7">
        <Link
          to="/"
          className="text-headline-md text-xl font-headline-md font-bold text-primary"
        >
          NexusMarket
        </Link>
        <nav className="hidden md:flex gap-7 items-center">
          <NavLink to="/shop" className={getNavStyle}>
            Marketplace
          </NavLink>
          <NavLink to="/categories" className={getNavStyle}>
            Categories
          </NavLink>
          
          {/* CONDITIONALLY RENDER TRACKING LINK */}
          {isAuthenticated && (
            <NavLink to="/orders" className={getNavStyle}>
              Tracking
            </NavLink>
          )}
        </nav>
      </div>

      <div className="flex-1 max-w-md mx-md hidden xl:block">
        <div className="relative w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-body-md font-body-md"
            placeholder="Search infrastructure, vendors, products..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        
        {/* CONDITIONALLY RENDER MESSAGING AND CART ICONS */}
        {isAuthenticated && (
          <>
            <Link to=  {'/vendor-chat'}className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all active:scale-95 flex items-center justify-center cursor-pointer">
              <MessageSquare className="w-6 h-6" />
            </Link>

            <Link to ={'/cart'} className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all active:scale-95 relative flex items-center justify-center cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </Link>
          </>
        )}

        {/* DYNAMIC AUTHENTICATION PROFILE / ACCOUNT CONTROLS */}
        {isAuthenticated ? (
          <div className="relative">
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant cursor-pointer transition-transform active:scale-95 focus:outline-none"
            >
              <img
                className="w-full h-full object-cover"
                src={user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                alt="User Profile"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200/80 rounded-[20px] shadow-xl shadow-slate-900/[0.04] p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Market Operator"}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "verified@nexus"}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect Account
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 pl-2">
            <Link
              to="/login"
              className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-semibold text-xs"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wide hover:bg-emerald-600 transition-all shadow-sm active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavBar;