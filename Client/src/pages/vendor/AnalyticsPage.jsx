import React from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Gross Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900">$14,892.40</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              +12.4% MoM
            </span>
          </div>
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Sales Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900">184 Orders</h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              2 items pending
            </span>
          </div>
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Store Traffic
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              4,821 Visitors
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
              2.4% Conv. Rate
            </span>
          </div>
          <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Storefront Sales Performance
            </h4>
            <p className="text-xs text-slate-400">
              Real-time tracking of historical merchant transactions.
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">
          [Sales Chart Visualization Engine Rendering Output]
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
