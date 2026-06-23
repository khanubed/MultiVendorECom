import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Ban } from "lucide-react";

const VendorsTab = () => {
  const { vendors, handleToggleVendorStatus } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter(
    (v) =>
      v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-4 animate-fade-in">
      {/* ... Insert Search Bar Panel markup matching prior blueprint ... */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* RENDER SYSTEM RECORDS GRID CHANNELS */}
      {filteredVendors.map((vendor) => (
        <tr key={vendor.id}>
          {/* ... Table Cell Markups ... */}
          <td>
            <button onClick={() => handleToggleVendorStatus(vendor.id)}>
              <Ban className="w-3 h-3" /> State Mutation
            </button>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default VendorsTab;
