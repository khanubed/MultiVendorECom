import React from "react";
import { SlidersHorizontal, Grid } from "lucide-react";

const FilterBar = ({ 
  categories, 
  currentCategory, 
  setCategory, 
  sortBy, 
  setSortBy, 
  itemCount 
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-10">
      
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              currentCategory === cat
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Meta Analytics & Dropdown Selector */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-xs font-medium text-slate-400 hidden lg:flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5" /> Matched {itemCount} premium parameters
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="featured">System Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Chronological Index</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;