import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/signup', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
