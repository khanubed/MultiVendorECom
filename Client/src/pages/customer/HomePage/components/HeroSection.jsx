import React from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative mb-20 mx-auto max-w-7xl rounded-[32px] overflow-hidden border border-slate-200/60 bg-white shadow-sm min-h-[600px] flex items-center transition-all duration-300">
      {/* 1. Enhanced Background Layer with Contrast Protection */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-102"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfdavPksepwfX8acSluOwPDAS2KiamMVTMSItR57Ni-3WktVRK_N5yqnx_D2s_FjOaVlym11NiOisZCrj4WksCcbGcpjDHA-UPuyp1_2WKgaqDI1DIyzlBiPbDVkOM-PuFKvkbkmeIHqWH3CKgazLBD6bqqQdkeVOByQyAU5yXCDfq2__pG9i9WPjQ8B0l_rEw5WVQd6kyUmdvI303qaWGTfRuLZBSXndf-pbfJs_WNte7qnFkM_6ijCqdxEgYi3iug7RV4RK1_io')`,
          }}
        />
        {/* Dual-layer gradient: Ensures deep text readability on mobile (stacked) and desktop (side-aligned) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 lg:bg-gradient-to-r lg:from-white lg:via-white/90 lg:to-transparent"></div>

        {/* Ambient subtle grid mesh for a premium technical look */}
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* 2. Responsive Content Layout Wrapper */}
      <div className="relative z-10 w-full max-w-3xl px-6 py-16 md:px-12 lg:py-20 lg:pl-20 text-center lg:text-left flex flex-col items-center lg:items-start">
        {/* Dynamic Micro-Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white mb-6 shadow-sm hover:bg-slate-800 transition-colors cursor-pointer group">
          <span className="pulse-indicator !mr-0"></span>
          <span className="text-xs font-semibold tracking-wide uppercase">
            Live Marketplace Updates
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        {/* Hero Typography with Responsive Sizing */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.1]">
          The Modern Standard for{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
            Premium Commerce
          </span>
          .
        </h1>

        {/* Subtext Body Content */}
        <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-[330px] leading-relaxed">
          Access a curated ecosystem of verified vendors and high-performance
          infrastructure solutions designed for the next generation of digital
          retail.
        </p>

        {/* 3. Adaptive Interactive Button Layout */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            Browse Marketplace
          </button>

          <button className="inline-flex items-center justify-center bg-white border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-98 cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
