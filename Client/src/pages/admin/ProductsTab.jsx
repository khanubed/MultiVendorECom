import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Filter, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const ProductsTab = () => {
  const { products, handleUpdateProductStatus } = useOutletContext();
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredProducts = products.filter(
    (p) => statusFilter === "All" || p.status === statusFilter,
  );

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-4 animate-fade-in">
      {/* ... Insert Selection Filtering Dropdown Drop markup matching structural specs ... */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        ...
      </select>

      {/* DATA MAP ROW MUTATORS EXECUTION */}
      {filteredProducts.map((product) => (
        <tr key={product.id}>
          {/* ... Product Table Meta Specifications ... */}
          <td>
            <button
              onClick={() => handleUpdateProductStatus(product.id, "Approved")}
            >
              Approve
            </button>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default ProductsTab;
