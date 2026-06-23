import React, { useState } from 'react';
import { orderAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { RefreshCw, AlertCircle } from 'lucide-react';

const RefundRequest = ({ orderId, totalPrice, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefundRequest = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error('Please provide a refund reason');
      return;
    }

    setLoading(true);
    try {
      const { data } = await orderAPI.refundOrder(orderId, reason);
      toast.success(data.message);
      onSuccess(data.refund);
      setShowForm(false);
      setReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-rose-900 mb-1">Refund Available</h3>
          <p className="text-xs text-rose-700 mb-3">
            Request a refund for this order. You will receive 95% of the amount. 5% admin fee is non-refundable.
          </p>
          <p className="text-xs font-semibold text-rose-800 mb-4">
            Refund Amount: <span className="text-base text-rose-900">${(totalPrice * 0.95).toFixed(2)}</span>
          </p>
        </div>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Request Refund
        </button>
      ) : (
        <form onSubmit={handleRefundRequest} className="space-y-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please tell us why you want to refund this order..."
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-rose-200 rounded-xl text-xs font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:bg-white resize-none"
            disabled={loading}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Processing...' : 'Confirm Refund'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setReason('');
              }}
              disabled={loading}
              className="flex-1 py-2 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RefundRequest;
