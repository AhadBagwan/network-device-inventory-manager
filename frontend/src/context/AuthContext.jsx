import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://netpulse-noc-api.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('netpulse_jwt_token') || null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('netpulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('netpulse_jwt_token', token);
    } else {
      localStorage.removeItem('netpulse_jwt_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('netpulse_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('netpulse_user');
    }
  }, [user]);

  const loginUser = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (fullName, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        full_name: fullName,
        email,
        password
      });
      
      const { access_token, user: userData, message } = response.data;
      if (access_token && userData) {
        setToken(access_token);
        setUser(userData);
      }
      return { success: true, message: message || 'Account created successfully.' };
    } catch (err) {
      if (err.response?.data?.errors) {
        return { success: false, errors: err.response.data.errors };
      }
      const message = err.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('netpulse_jwt_token');
    localStorage.removeItem('netpulse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
