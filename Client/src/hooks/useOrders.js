import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (isVendor = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = isVendor 
        ? await orderAPI.getVendorOrders()
        : await orderAPI.getMyOrders();
      
      setOrders(data.orders || []);
      return { success: true, orders: data.orders };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch orders';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async (orderId) => {
    try {
      const { data } = await orderAPI.getOrder(orderId);
      return { success: true, order: data.order };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch order';
      return { success: false, error: errorMsg };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await orderAPI.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o._id === orderId ? data.order : o));
      return { success: true, order: data.order };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update order';
      return { success: false, error: errorMsg };
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    updateOrderStatus
  };
};
