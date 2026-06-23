import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productAPI.getAllProducts(filters);
      setProducts(data.products || []);
      setPagination(data.pagination || {});
      return { success: true, products: data.products };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch products';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const { data } = await productAPI.getProduct(productId);
      return { success: true, product: data.product };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch product';
      return { success: false, error: errorMsg };
    }
  };

  const createProduct = async (productData) => {
    try {
      const { data } = await productAPI.createProduct(productData);
      setProducts([data.product, ...products]);
      return { success: true, product: data.product };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create product';
      return { success: false, error: errorMsg };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const { data } = await productAPI.updateProduct(productId, productData);
      setProducts(products.map(p => p._id === productId ? data.product : p));
      return { success: true, product: data.product };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update product';
      return { success: false, error: errorMsg };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product';
      return { success: false, error: errorMsg };
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
