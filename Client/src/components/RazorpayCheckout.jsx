import React, { useState } from 'react';
import { orderAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader, ShieldCheck, RefreshCw } from 'lucide-react';

const RazorpayCheckout = ({ cartItems, totals, shippingAddress, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!shippingAddress) {
      toast.error('Shipping address is required');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create Razorpay order from backend
      const { data } = await orderAPI.createRazorpayCheckout({
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity
        })),
        shippingAddress
      });

      if (!data.order || !data.razorpayOrder) {
        throw new Error('Failed to create checkout order');
      }

      setOrderId(data.order._id);

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'MultiVendor Store',
        description: `Order for ${cartItems.length} item(s)`,
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment signature on backend
            const verifyResponse = await orderAPI.verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: data.order._id
            });

            toast.success('Payment successful! Order placed.');
            onSuccess(verifyResponse.data.order);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0f172a'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpayWindow = window.Razorpay || null;
      if (!razorpayWindow) {
        throw new Error('Razorpay SDK not loaded');
      }

      const rzp = new razorpayWindow(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-800 shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer group"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Pay with Razorpay
          </>
        )}
      </button>

      {orderId && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
          <p className="font-semibold mb-1">Order Created</p>
          <p className="text-emerald-600 font-mono text-[10px] break-all">{orderId}</p>
        </div>
      )}

      <button
        onClick={onCancel}
        disabled={loading}
        className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
};

export default RazorpayCheckout;
