import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

const INITIAL_ORDERS = [
  { id: "ORD-9921", customer: "Sarah Jenkins", items: "1x Premium Artisan Stoneware Plate", total: 34.99, status: "Delivered" },
  { id: "ORD-9922", customer: "Michael Chen", items: "1x Ergonomic Mechanical Keyboard", total: 189.99, status: "Processing" },
  { id: "ORD-9923", customer: "Emma Watson", items: "2x Minimalist Leather Cardholder", total: 90.00, status: "Pending" },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Update Workflow State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{o.id}</td>
                <td className="p-4 font-semibold text-slate-800">{o.customer}</td>
                <td className="p-4 text-slate-500 max-w-xs truncate">{o.items}</td>
                <td className="p-4 font-bold text-slate-900">${o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                    o.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                    o.status === "Processing" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {o.status === "Delivered" && <CheckCircle className="w-3 h-3"/>}
                    {o.status === "Processing" && <Clock className="w-3 h-3 animate-pulse"/>}
                    {o.status === "Pending" && <Clock className="w-3 h-3"/>}
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <select 
                    value={o.status}
                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    className="text-[11px] font-bold border border-slate-200 rounded-lg p-1.5 bg-slate-50 outline-none focus:border-slate-400 cursor-pointer transition-all"
                  >
                    <option value="Pending">Set to Pending</option>
                    <option value="Processing">Set to Processing</option>
                    <option value="Delivered">Set to Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;