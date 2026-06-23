import { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI, initializeSocket, disconnectSocket } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      if (role === 'vendor') endpoint = authAPI.vendorLogin;
      else if (role === 'admin') endpoint = authAPI.adminLogin;
      else endpoint = authAPI.customerLogin;

      const { data } = await endpoint({ email, password });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data.vendor));

      setUser(data.user || data.vendor);
      setIsAuthenticated(true);

      // Initialize WebSocket connection
      initializeSocket(data.token);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      if (role === 'vendor') endpoint = authAPI.vendorRegister;
      else if (role === 'admin') endpoint = authAPI.adminRegister;
      else endpoint = authAPI.customerRegister;

      const { data } = await endpoint(formData);

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data.vendor));

      setUser(data.user || data.vendor);
      setIsAuthenticated(true);

      // Initialize WebSocket connection
      initializeSocket(data.token);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    disconnectSocket();
  }, []);

  const verify = useCallback(async () => {
    try {
      const { data } = await authAPI.verifyToken();
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      initializeSocket(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      verify
    }}>
      {children}
    </AuthContext.Provider>
  );
};
