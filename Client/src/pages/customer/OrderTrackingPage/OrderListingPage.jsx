import React, { useEffect, useState, useMemo } from "react";
import { Search, Package, Clock, CheckCircle2, XCircle, ArrowRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { orderAPI, chatAPI } from "../../../services/api";
import { toast } from "react-hot-toast";

const OrderListingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const statusCodeToLabel = (status) => {
    const lower = (status || "").toLowerCase();
    switch (lower) {
      case "pending":
        return "Pending";
      case "processing":
        return "In-Transit";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusLabel = statusCodeToLabel(order.orderStatus || order.status);
      const vendorName = order.items?.[0]?.product?.vendor?.name || order.vendor?.name || "";
      const searchTxt = searchQuery.toLowerCase();
      const matchesStatus = statusFilter === "All" || statusLabel === statusFilter;
      const matchesSearch =
        (order.id || "").toLowerCase().includes(searchTxt) ||
        order.items?.some((item) => (item.product?.name || item.name || "").toLowerCase().includes(searchTxt)) ||
        vendorName.toLowerCase().includes(searchTxt);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleTrackOrder = (orderId) => {
    navigate(`/tracking/${orderId}`);
  };

  const handleContactVendor = async (order) => {
    try {
      const { data } = await chatAPI.createOrGetChatRoom(order.id);
      const roomId = data.chatRoom?._id || data.chatRoom?.id;
      if (roomId) {
        navigate(`/vendor-chat/${roomId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to open chat with vendor.");
    }
  };

  const getStatusBadge = (status) => {
    const baseline = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ";
    const label = statusCodeToLabel(status);

    switch (label) {
      case "In-Transit":
        return (
          <span className={`${baseline} bg-blue-50 text-blue-600 border-blue-200/60`}>
            <Clock className="w-3 h-3" /> In-Transit
          </span>
        );
      case "Delivered":
        return (
          <span className={`${baseline} bg-emerald-50 text-emerald-600 border-emerald-200/60`}>
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className={`${baseline} bg-rose-50 text-rose-600 border-rose-200/60`}>
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className={`${baseline} bg-slate-100 text-slate-600 border-slate-200`}>
            {label}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-6 py-20 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          <span className="text-sm font-semibold text-slate-700">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-6 py-20 md:px-12 max-w-7xl mx-auto text-center">
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-rose-700 shadow-sm">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-8 mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Purchase Ledger</h1>
        <p className="text-slate-500 text-sm">Monitor status, inspect invoices, and open communication channels for your orders.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'In-Transit', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, product name, or vendor..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition-all focus:border-slate-400"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="mx-auto max-w-2xl border border-slate-200 rounded-[24px] bg-white py-24 px-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
            <Package className="h-5 w-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No transaction records matched</h3>
          <p className="mx-auto max-w-sm text-sm text-slate-500">
            We couldn't locate any orders matching the active query or status filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/[0.01]"
            >
              <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 text-xs font-medium text-slate-500">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Authorized Index</p>
                    <p className="font-mono font-bold text-slate-800">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Timestamp</p>
                    <p className="text-slate-700 font-bold">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">Total Allocation</p>
                    <p className="text-slate-900 font-extrabold">${order.totalPrice?.toFixed(2) ?? '0.00'}</p>
                  </div>
                </div>

                <div className="self-start sm:self-auto">{getStatusBadge(order.orderStatus || order.status)}</div>
              </div>

              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 flex flex-col gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="h-14 w-14 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.imageUrl || item.imageUrl || 'https://via.placeholder.com/120'}
                          alt={item.product?.name || item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product?.name || item.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Quantity: <span className="text-slate-600 font-semibold">{item.quantity || item.qty}</span> · Price: <span className="text-slate-600 font-semibold">${(item.priceAtPurchase || item.price)?.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center sm:justify-start lg:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-wrap">
                  <button
                    onClick={() => handleContactVendor(order)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    Contact Vendor
                  </button>

                  {(order.orderStatus || order.status) !== 'cancelled' && (
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer active:scale-98 group/btn"
                    >
                      Track Order
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderListingPage;
