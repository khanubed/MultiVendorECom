import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { orderAPI } from "../../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getVendorOrders();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o)),
    );
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading orders...</div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
              <th className="p-4 w-10"></th>
              <th className="p-4">Order ID & Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Payout</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <React.Fragment key={o.id}>
                  {/* --- MAIN ROW --- */}
                  <tr
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      expandedOrderId === o.id ? "bg-slate-50/50" : ""
                    }`}
                    onClick={() => toggleExpand(o.id)}
                  >
                    <td className="p-4 text-slate-400">
                      {expandedOrderId === o.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900" title={o.id}>
                        #{o.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {formatDate(o.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">
                        {o.shippingAddress?.fullName || o.user?.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {o.user?.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        ${o.vendorPayout?.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Total: ${o.totalPrice?.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit capitalize ${getStatusStyles(
                          o.orderStatus,
                        )}`}
                      >
                        {o.orderStatus === "delivered" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {o.orderStatus === "processing" && (
                          <Clock className="w-3 h-3 animate-pulse" />
                        )}
                        {o.orderStatus === "pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {o.orderStatus === "cancelled" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {o.orderStatus}
                      </span>
                    </td>
                    <td
                      className="p-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={o.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(o.id, e.target.value)
                        }
                        className="text-[11px] font-bold border border-slate-200 rounded-lg p-1.5 bg-white outline-none focus:border-slate-400 cursor-pointer transition-all capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* --- EXPANDED DETAILS ROW --- */}
                  {expandedOrderId === o.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan="6" className="p-0">
                        <div className="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* 1. Items List */}
                          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4 border-b pb-2">
                              <Package className="w-4 h-4 text-blue-500" />{" "}
                              Purchased Items
                            </h4>
                            <div className="flex flex-col gap-3">
                              {o.items?.map((item) => (
                                <div
                                  key={item._id}
                                  className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-lg"
                                >
                                  <img
                                    src={item.product?.imageUrl}
                                    alt={item.product?.name}
                                    className="w-12 h-12 object-cover rounded-md border border-slate-200"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-800">
                                      {item.product?.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex gap-2">
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                                        {item.product?.category}
                                      </span>
                                      {item.product?.badge && (
                                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                          {item.product?.badge}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-slate-900">
                                      ${item.priceAtPurchase?.toFixed(2)}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      Qty: {item.quantity}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Customer & Shipping Info */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                              <MapPin className="w-4 h-4 text-emerald-500" />{" "}
                              Shipping Details
                            </h4>
                            <div className="text-sm space-y-1 text-slate-600">
                              <p className="font-semibold text-slate-800">
                                {o.shippingAddress?.fullName}
                              </p>
                              <p>{o.shippingAddress?.addressLine1}</p>
                              {o.shippingAddress?.addressLine2 && (
                                <p>{o.shippingAddress?.addressLine2}</p>
                              )}
                              <p>
                                {o.shippingAddress?.city},{" "}
                                {o.shippingAddress?.postalCode}
                              </p>
                              <p>{o.shippingAddress?.country}</p>
                              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px]">
                                <p>
                                  Email:{" "}
                                  <span className="font-medium text-slate-800">
                                    {o.user?.email}
                                  </span>
                                </p>
                                <p>
                                  Phone:{" "}
                                  <span className="font-medium text-slate-800">
                                    {o.user?.phone}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 3. Payment & Refund Info */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                              <CreditCard className="w-4 h-4 text-purple-500" />{" "}
                              Payment Info
                            </h4>
                            <div className="text-sm space-y-2 text-slate-600">
                              <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="font-medium capitalize text-slate-800">
                                  {o.paymentInfo?.method}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span
                                  className={`font-medium capitalize ${o.paymentInfo?.status === "refunded" ? "text-red-600" : "text-emerald-600"}`}
                                >
                                  {o.paymentInfo?.status}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Gateway ID:</span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  {o.paymentInfo?.razorpayPaymentId}
                                </span>
                              </div>

                              {o.refundInfo && (
                                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] bg-red-50/50 p-2 rounded-md">
                                  <p className="font-bold text-red-700 mb-1">
                                    Refund Details
                                  </p>
                                  <p>
                                    Status:{" "}
                                    <span className="font-medium capitalize">
                                      {o.refundInfo.refundStatus}
                                    </span>
                                  </p>
                                  <p>
                                    Amount:{" "}
                                    <span className="font-medium">
                                      ${o.refundInfo.amount}
                                    </span>
                                  </p>
                                  <p
                                    className="truncate"
                                    title={o.refundInfo.reason}
                                  >
                                    Reason: {o.refundInfo.reason}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. Financial Breakdown */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                              <DollarSign className="w-4 h-4 text-amber-500" />{" "}
                              Financial Summary
                            </h4>
                            <div className="text-sm space-y-2 text-slate-600">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span className="font-medium text-slate-800">
                                  ${o.subtotal?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span className="font-medium text-slate-800">
                                  ${o.shippingPrice?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax:</span>
                                <span className="font-medium text-slate-800">
                                  ${o.taxPrice?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
                                <span>Total Customer Paid:</span>
                                <span>${o.totalPrice?.toFixed(2)}</span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-100">
                                <div className="flex justify-between text-red-500">
                                  <span>Platform Fee:</span>
                                  <span>
                                    -${o.platformCommission?.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between font-bold text-emerald-600 text-base mt-1">
                                  <span>Your Payout:</span>
                                  <span>${o.vendorPayout?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
