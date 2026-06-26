import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { vendorAPI } from "../../services/api"; // Adjust import to your API service

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    revenue: 0,
    orders: 0,
    pending: 0,
    chartData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Replace with your actual API call method
        const { data } = await vendorAPI.getAnalytics();
        console.log(data)
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading analytics...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- Top Metrics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Payout Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              ${analytics.revenue.toFixed(2)}
            </h3>
          </div>
          <div className="h-12 w-12 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Sales Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              {analytics.orders} Orders
            </h3>
            {analytics.pending > 0 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                {analytics.pending} requires action
              </span>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Store Traffic Card (Placeholder as Traffic isn't in DB yet) */}
        <div className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Store Profile Views
            </p>
            <h3 className="text-2xl font-black text-slate-900">-- Visitors</h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
              Tracking coming soon
            </span>
          </div>
          <div className="h-12 w-12 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* --- Revenue Chart --- */}
      <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Storefront Sales Performance (30 Days)
            </h4>
            <p className="text-xs text-slate-400">
              Real-time tracking of historical merchant transactions.
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="h-72 w-full mt-4">
          {analytics.chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
              Not enough data to generate chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
