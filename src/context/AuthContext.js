'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await axios.get('/api/auth/user', { 
        withCredentials: true 
      });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      toast.success('Login successful!');
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      await axios.post('/api/auth/logout', {}, { 
        withCredentials: true 
      });
      
      // Clear user state
      setUser(null);
      
      // Clear any stored data
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      toast.success('Logged out successfully');
      
      // Redirect to home page
      router.push('/');
      router.refresh(); // Force a refresh to clear any cached data
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local state
      setUser(null);
      localStorage.removeItem('user');
      
      toast.error('Logout completed with some issues');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};