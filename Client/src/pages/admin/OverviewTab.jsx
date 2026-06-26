import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  ShieldAlert, 
  Eye, 
  Percent, 
  TrendingUp, 
  RefreshCw, 
  Package 
} from "lucide-react";

const OverviewTab = () => {
  // Pull parameters derived from state synchronization networks
  const { 
    globalGrossSales = 0, 
    products = [], 
    pendingProductsList = [],
    // Safely capture the extended metrics payload passed via Outlet context provider
    dashboardLiveMetrics 
  } = useOutletContext();
  
  const navigate = useNavigate();

  // Handle fallback states natively if your context API sync cycle is loading
  const financials = dashboardLiveMetrics?.financials || {
    collectedCommission: 0,
    allocatedPayouts: 0,
    pendingRefundRequests: 0
  };
  
  const catalog = dashboardLiveMetrics?.catalog || { globalStockVolume: 0, approved: 0 };
  const merchants = dashboardLiveMetrics?.merchants || { totalVendors: 0, verifiedVendors: 0 };
  const counts = dashboardLiveMetrics?.counts || { activeCustomers: 0 };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* SECTION 1: GLOBAL PLATFORM FINANCIAL LEDGER */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Financial Ecosystem Ledger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Total Gross Volume */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross GMV Traded</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ${globalGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign className="w-5 h-5" /></div>
          </div>

          {/* Card: Collected Commissions */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Commissions</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ${financials.collectedCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Percent className="w-5 h-5" /></div>
          </div>

          {/* Card: Disbursed Vendor Splits */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant Net Payouts</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ${financials.allocatedPayouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><TrendingUp className="w-5 h-5" /></div>
          </div>

          {/* Card: Active Unresolved Disputes */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Refund Claims</p>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                {financials.pendingRefundRequests} <span className="text-[10px] font-bold text-slate-400">Open Logs</span>
              </h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600"><RefreshCw className="w-5 h-5" /></div>
          </div>

        </div>
      </div>

      {/* SECTION 2: OPERATIONAL ECOSYSTEM FOOTPRINT */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Marketplace Asset Demographics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Consumer Base Profiles */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 flex-shrink-0"><Users className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onboarded Platform Buyers</p>
              <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">{counts.activeCustomers.toLocaleString()} Active</h4>
            </div>
          </div>

          {/* Onboarded Merchant Validation Ratios */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 flex-shrink-0"><ShoppingBag className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Shop Accounts</p>
              <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {merchants.totalVendors} Stores <span className="text-xs font-medium text-emerald-600">({merchants.verifiedVendors} KYC Verified)</span>
              </h4>
            </div>
          </div>

          {/* Global Inventory Item Trackers */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 flex-shrink-0"><Package className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Physical Stock Tracking</p>
              <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {catalog.globalStockVolume.toLocaleString()} Units <span className="text-xs font-medium text-slate-500">({catalog.approved} Active SKUs)</span>
              </h4>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: SYSTEM PRIORITIES INCIDENT COMPLIANCE QUEUE */}
      <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Products Awaiting Security Sign-Off</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">These catalog submissions require administrative verification reviews before listing visibility.</p>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> {pendingProductsList.length} Interceptions Actionable
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto pr-1">
          {pendingProductsList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">
              All listed merchant items are compliant. No pending sign-offs found.
            </div>
          ) : (
            pendingProductsList.map((p) => (
              <div key={p._id || p.id} className="py-3.5 flex items-center justify-between group hover:bg-slate-50/40 px-2 rounded-xl transition-colors -mx-2">
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} className="w-9 h-9 rounded-xl object-cover border border-slate-200/60 shadow-3xs" alt="" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.name || "Missing Name Identifier"}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Price: <span className="text-slate-600 font-extrabold">${p.price}</span> &bull; Stock: <span className="text-slate-600 font-extrabold">{p.stock}</span>
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate("/admin/products")} 
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 transition-all"
                >
                  <Eye className="w-3 h-3" /> Audit Asset
                </button>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default OverviewTab;