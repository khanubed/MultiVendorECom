import React from "react";
import { Plus } from "lucide-react";

// 1. Added onAddToCart to the destructured props parameters
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="premium-card p-6 bg-white border border-slate-200/60 rounded-[24px] flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.02]">
      {/* Structural Image Wrapper */}
      <div className="aspect-square w-full rounded-xl bg-slate-50 overflow-hidden mb-5 relative border border-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-slate-800 shadow-xs border border-slate-200/50">
            {product.badge}
          </span>
        )}
      </div>

      {/* Meta Specifications Description Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Commerce Functional Controls Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Deploy Value
            </span>
            <span className="font-extrabold text-slate-900 text-base">
              $
              {product.price
                ? product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : "0.00"}
            </span>
          </div>

          {/* 2. Added onClick trigger engine here */}
          <button
            onClick={onAddToCart}
            className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-sm active:scale-95 cursor-pointer group/btn"
          >
            <Plus className="w-4 h-4 transition-transform duration-200 group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
