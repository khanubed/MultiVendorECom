import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderAPI, chatAPI } from "../../../services/api";
import { Package, Truck, MapPin, Clock, MessageSquare, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await orderAPI.getOrder(id);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStartChat = async () => {
    if (!order) return;
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

  const steps = [
    { label: "Order Placed", desc: "Order has been created and is pending fulfillment." },
    { label: "Processing", desc: "Vendor is preparing your items for shipment." },
    { label: "Shipped", desc: "Order has left the warehouse and is in transit." },
    { label: "Out for Delivery", desc: "Carrier is delivering your order." },
    { label: "Delivered", desc: "Order has been delivered to your shipping address." }
  ];

  const statusToStepIndex = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 4;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-6 py-20 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
          <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          <span className="text-sm font-semibold text-slate-700">Loading shipment data...</span>
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

  if (!order) {
    return null;
  }

  const currentStep = statusToStepIndex(order.orderStatus || order.status);
  const vendorName = order.items?.[0]?.product?.vendor?.name || "Vendor";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-8 mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Track Shipment</h1>
        <p className="text-slate-500 text-sm">
          Monitoring payload progress for Order ID: <span className="font-semibold text-slate-700">{order.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-400" /> Progression Vector
          </h2>

          <div className="relative flex flex-col gap-8 pl-6">
            <div className="absolute top-2 left-7.75 bottom-2 w-0.5 bg-slate-100" />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.label} className="relative flex gap-6 items-start group">
                  <div className="absolute -left-px z-10">
                    {isCompleted ? (
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center border-4 border-white shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center border-4 ${isCurrent ? 'bg-white text-emerald-500 border-emerald-500 shadow-md animate-pulse' : 'bg-white text-slate-300 border-slate-200'}`} />
                    )}
                  </div>

                  <div className="pl-6">
                    <h3 className={`text-sm font-bold tracking-tight ${isCurrent ? 'text-emerald-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[2rem_2rem]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Socket Channel Active
              </span>

              <h3 className="text-lg font-bold tracking-tight mb-1">Need verification?</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Open direct communication with {vendorName} for delivery updates, order clarifications, or shipment hold requests.
              </p>

              <button
                onClick={handleStartChat}
                className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-50 active:scale-98 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-slate-600" />
                Open Vendor Chat
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-60" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs text-sm">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" /> Order Summary
            </h3>

            <div className="flex flex-col gap-3.5 pb-4 border-b border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Order Status</span>
                <span className="font-bold text-slate-700 capitalize">{order.orderStatus || order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Shipping Address</span>
                <span className="font-bold text-slate-700 text-right max-w-42.5">
                  {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tracking Reference</span>
                <span className="font-mono font-bold text-slate-800">{order.paymentInfo?.razorpayOrderId || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Total Paid</span>
                <span className="font-bold text-slate-900">${order.totalPrice?.toFixed(2) ?? '0.00'}</span>
              </div>
            </div>

            <div className="pt-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">Items in this order</span>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-700 truncate">{item.product?.name || item.name} ×{item.quantity || item.qty}</span>
                    <span className="font-bold text-slate-900">${((item.priceAtPurchase || item.price) * (item.quantity || item.qty)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
