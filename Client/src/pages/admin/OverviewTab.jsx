import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { DollarSign, Users, ShoppingBag, ShieldAlert, Eye } from "lucide-react";

const OverviewTab = () => {
  const { globalGrossSales, vendors, products, pendingProductsList } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIS LAYER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-[20px] p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Ledger</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">${globalGrossSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><DollarSign className="w-5 h-5" /></div>
        </div>
        {/* Render rest of the KPI blocks using vendors.length and products.length here */}
      </div>

      {/* PRIORITIES INCIDENT MODULE */}
      <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Priority Incidents</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {pendingProductsList.map((p) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={p.imageUrl} className="w-8 h-8 rounded-lg object-cover" alt="" />
                <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
              </div>
              <button 
                onClick={() => navigate("/admin/products")} 
                className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" /> Audit Payload
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;