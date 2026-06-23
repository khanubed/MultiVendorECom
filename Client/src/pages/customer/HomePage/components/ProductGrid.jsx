import React from "react";
import { ArrowRight, Plus } from "lucide-react";

const ProductGrid = () => {
  return (
    <section className="mb-xl">
      <div className="flex justify-between items-end mb-md">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary">Personalized For You</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Based on your recent architectural interests.</p>
        </div>
        <button className="text-secondary font-bold flex items-center gap-xs hover:gap-sm transition-all text-label-md font-label-md">
          View All Products <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bento-grid">
        {/* Large Feature Card */}
        <div className="col-span-12 lg:col-span-6 premium-card p-0 flex flex-col group overflow-hidden">
          <div className="h-80 relative overflow-hidden">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5fmBtc4HTcHJQr7NY8kYBBtq65j5dCSbyiOBPTVA9veC7ZT8o30VEEYeGGitEUNQMNREj6AZNIrYf3aRr7Sw1WNeYkcSaM4s04gYnp4_2WYOwiim6b0rtzQ_YG7ne2Ce1fSVPi73PIlV2B1ttoI_h_P-A9ZVMKpiEMIATqkS01uc1zf3QtouP10ZDATAbMRPItr5SJFcNgGH4GTgI1v5ExoA_aMV6Mbb44UL2UB4fnJI7BeTlItCBKSHygTGDgGjcEjksxXp-GsU" 
              alt="Titan Controller" 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-md font-label-md font-bold">New Arrival</div>
          </div>
          <div className="p-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-headline-md font-headline-md">Titan Series V2 Controller</h3>
              <span className="text-headline-md font-headline-md text-secondary">$1,299</span>
            </div>
            <p className="text-body-md text-on-surface-variant mb-lg">Precision-engineered hardware for high-demand vendor environments. Aluminum chassis with titanium alloy heat sinks.</p>
            <button className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all">Add to Infrastructure</button>
          </div>
        </div>

        {/* Medium Feature Card 1 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 premium-card p-6 flex flex-col group">
          <div className="aspect-square rounded-xl overflow-hidden mb-md">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9J5owoGfnGb8c_SnUQSuiu7FveQZvZ4G9czL6pWm-iEKVj9IQMx1ZGFS7eb-EpSWUASLrUOO-U5h9nAoqNH9qEUWt_9utOR2A2k2wvudqn81pqOksuxOsvMzBUVFnwa-mAbr0aIcvD99si8kXykNeSd4iCJWKGWbYpRVGjrvxqqwLetOorZ7bx8Wquev2NVNdj_M8tKMkA_isWQxH5csB2lnOz6LoKlOkchQaSSwdjejEMfE4_m00ZOvBHhT1lGlAEg71BNT8QGQ" 
              alt="Nexus Core Cables" 
            />
          </div>
          <h4 className="font-bold text-lg mb-1">Nexus Core Cables</h4>
          <p className="text-on-surface-variant text-sm mb-4">Zero-latency interconnects for server-grade clusters.</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="font-bold text-secondary">$249.00</span>
            <button className="p-2 border border-outline-variant rounded-full hover:bg-secondary hover:text-white transition-all flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Medium Feature Card 2 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 premium-card p-6 flex flex-col group">
          <div className="aspect-square rounded-xl overflow-hidden mb-md">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt7xC8M5ICvpZwkYnhtUJFg_hJHCN10HiOS3adc5HFVWyjfOWWCVd0pqdTsH6bdsca_hv0prehCD_AvjHgor-L242pzcbQ1A94WSppHi53XsH73vvaT0eFtFpygQBSxjOppB50kjwUq8LMRXr9E19lkktYExKD9ZTnqsikHLxW9EgWBtGGUJwYKE2N4juZ0FLKuJdjijb0CPoQeqkIXReVTex4BTTF6H4zQgddT0L3hKMmuyzP714gcSDHsJX_SgJjAKvckDCnu1k" 
              alt="CryoFlow Unit" 
            />
          </div>
          <h4 className="font-bold text-lg mb-1">CryoFlow Unit</h4>
          <p className="text-on-surface-variant text-sm mb-4">Intelligent thermal management for persistent workloads.</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="font-bold text-secondary">$875.00</span>
            <button className="p-2 border border-outline-variant rounded-full hover:bg-secondary hover:text-white transition-all flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;