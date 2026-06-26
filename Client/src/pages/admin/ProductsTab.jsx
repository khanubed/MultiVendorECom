import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Star, 
  Package, 
  Layers, 
  Store 
} from "lucide-react";

const ProductsTab = () => {
  // Assuming these utilities are exposed or configured within your administrative layout outlet context wrapper
  const { 
    products = [], 
    handleUpdateProductStatus, 
    handleToggleFeatured 
  } = useOutletContext();
  
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProducts = products.filter(
    (p) => statusFilter === "All" || p.approvalStatus?.toLowerCase() === statusFilter.toLowerCase()
  );

  const getStatusBadgeStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-6 animate-fade-in">
      
      {/* Table Control Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">System Inventory Audit</h3>
          <p className="text-xs text-slate-500">Review platform catalog entries, verify merchant specifications, and allocate featured promotional cards.</p>
        </div>
        
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold border border-slate-200 rounded-xl p-2 bg-white outline-none focus:border-slate-400 cursor-pointer transition-all flex-1 sm:flex-initial"
          >
            <option value="All">All Approvals</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Data Layout Matrix Engine */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4">Product Details</th>
              <th className="p-4">Merchant Origin</th>
              <th className="p-4">Financials & Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Bento Feature</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-400 font-medium">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  No system records match selected criteria parameters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                  
                  {/* Product Primary Data Identifiers */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-[180px]">
                        <div className="font-bold text-slate-900 truncate" title={product.name}>{product.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3" />
                          <span>{product.category}</span>
                          {product.badge && (
                            <span className="bg-slate-100 text-slate-600 px-1 rounded font-bold text-[9px] uppercase tracking-wide">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Merchant Affiliation Mapping Context */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>{product.vendor?.storeName || "Independent Supplier"}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{product.vendor?.email || "N/A"}</div>
                  </td>

                  {/* Metrics and Stock Allocation Columns */}
                  <td className="p-4">
                    <div className="font-bold text-slate-900">${product.price?.toFixed(2)}</div>
                    <div className={`text-[10px] mt-0.5 ${product.stock <= 5 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                      {product.stock} Units in Reserve
                    </div>
                  </td>

                  {/* Operational Status Representation Flags */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 border rounded-full text-[10px] font-bold inline-flex items-center gap-1 capitalize ${getStatusBadgeStyles(product.approvalStatus)}`}>
                      {product.approvalStatus === "approved" && <CheckCircle2 className="w-3 h-3" />}
                      {product.approvalStatus === "pending" && <AlertTriangle className="w-3 h-3 animate-pulse" />}
                      {product.approvalStatus === "rejected" && <XCircle className="w-3 h-3" />}
                      {product.approvalStatus || "Pending"}
                    </span>
                  </td>

                  {/* Feature Status Toggle Button */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured && handleToggleFeatured(product.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        product.isFeatured 
                          ? "bg-amber-50 text-amber-500 border-amber-200 shadow-2xs hover:bg-amber-100" 
                          : "bg-white text-slate-300 border-slate-200 hover:text-slate-500 hover:bg-slate-50"
                      }`}
                      title={product.isFeatured ? "Click to remove highlight flag allocation" : "Click to tag as high-exposure bento allocation"}
                    >
                      <Star className={`w-4 h-4 ${product.isFeatured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>

                  {/* Structural Action Control Triggers */}
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {product.approvalStatus !== "approved" && (
                        <button
                          onClick={() => handleUpdateProductStatus(product.id, "approved")}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition-all border border-emerald-200"
                        >
                          Approve
                        </button>
                      )}
                      {product.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => handleUpdateProductStatus(product.id, "rejected")}
                          className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-all border border-red-200"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTab;