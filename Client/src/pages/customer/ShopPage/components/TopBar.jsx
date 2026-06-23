import React from "react";
import { Search, ShoppingBag, Terminal } from "lucide-react";

const TopBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        
        {/* Platform Identity */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="text-sm font-black uppercase tracking-wider text-slate-900">
            Nexus.Engine
          </span>
        </div>

        {/* Dynamic Search Box Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query infrastructure modules..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
        </div>

        {/* Global Identity & Cart Anchor */}
        <div className="flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;