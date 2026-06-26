import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  Ban,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Store,
  User,
} from "lucide-react";
import { vendorAPI } from "../../services/api";

const VendorsTab = () => {
  const [vendors,setVendors] = useState([])
  // Use fallback array default to prevent layout breaks prior to full context resolution
  const {  handleToggleVendorStatus } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const { data } = await vendorAPI.getAllVendors();
        setVendors(data.vendors);
      } catch (error) {
        console.error("Failed syncing cloud database assets:", error);
      }
    };
    fetchVendor();
  }, []);

  // Filter against schema properties safely using optional chaining
  const filteredVendors = vendors.filter(
    (v) =>
      v.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 shadow-2xs space-y-5 anonymity-engine animate-fade-in">
      {/* Search Filter Header Action Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Merchant Directory
          </h3>
          <p className="text-xs text-slate-500">
            Monitor system suppliers, confirm physical regional locales, and
            adjust global account suspension configurations.
          </p>
        </div>

        {/* Dynamic Search Input Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search store, merchant or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Structured Core Data Grid Panel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4">Store & Owner</th>
              <th className="p-4">Communication Links</th>
              <th className="p-4">Geographic Footprint</th>
              <th className="p-4 text-center">Compliance</th>
              <th className="p-4 text-center">Account Status</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredVendors.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-12 text-center text-slate-400 font-medium"
                >
                  <Store className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  No validated merchant registries found matching your query
                  filters.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  {/* Store Profile Identity Indicators */}
                  <td className="p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-slate-100 rounded-xl text-slate-700 mt-0.5 flex-shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {vendor.storeName || "Unnamed Store"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{vendor.name}</span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-400 font-bold uppercase tracking-wide">
                            {vendor.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Operational Digital Contacts Metadata */}
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="hover:underline"
                      >
                        {vendor.email}
                      </a>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Geographical Full Physical Boundaries */}
                  <td className="p-4 max-w-[220px]">
                    <div className="flex items-start gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div
                          className="truncate font-semibold text-slate-800"
                          title={vendor.address}
                        >
                          {vendor.address}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {vendor.city}, {vendor.state} —{" "}
                          {vendor.pincode || vendor.zip}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {vendor.country}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* KYC Compliance Verification Validation System */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-full text-[10px] font-bold ${
                        vendor.isVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {vendor.isVerified ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified KYC</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-slate-400" />
                          <span>Unverified</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Core Switch Flag System Live Status States */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                        vendor.status === "active" &&
                        vendor.isActive &&
                        !vendor.isDeleted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {vendor.isDeleted
                        ? "Deleted"
                        : vendor.isActive
                          ? "Active"
                          : "Suspended"}
                    </span>
                  </td>

                  {/* Document Creation Calendar Pipeline */}
                  <td className="p-4 whitespace-nowrap text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {vendor.createdAt
                          ? new Date(vendor.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Global Matrix Interruption Execution Engine Trigger */}
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleToggleVendorStatus &&
                        handleToggleVendorStatus(vendor._id)
                      }
                      disabled={vendor.isDeleted}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[11px] font-bold transition-all shadow-2xs ${
                        vendor.isDeleted
                          ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                          : vendor.isActive
                            ? "bg-white text-rose-600 border-rose-200 hover:bg-rose-50/50 hover:text-rose-700 cursor-pointer"
                            : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 cursor-pointer"
                      }`}
                    >
                      <Ban className="w-3 h-3" />
                      <span>
                        {vendor.isActive ? "Suspend Access" : "Restore Access"}
                      </span>
                    </button>
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

export default VendorsTab;
