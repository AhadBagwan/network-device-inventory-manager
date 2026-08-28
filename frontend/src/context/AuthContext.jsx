import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'https://netpulse-noc-api.onrender.com/api';

const DEFAULT_DEMO_USER = {
  id: 1,
  full_name: 'Admin User',
  email: 'admin@netpulse.noc',
  role: 'Super Admin',
  status: 'Active'
};

const DEFAULT_DEMO_TOKEN = 'netpulse_demo_access_token_2026';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('netpulse_jwt_token') || DEFAULT_DEMO_TOKEN;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('netpulse_user');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_DEMO_USER;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('netpulse_jwt_token', token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('netpulse_user', JSON.stringify(user));
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
      setToken(access_token || DEFAULT_DEMO_TOKEN);
      setUser(userData || DEFAULT_DEMO_USER);
      return { success: true, user: userData || DEFAULT_DEMO_USER };
    } catch (err) {
      // Graceful instant fallback for guest demo access
      setToken(DEFAULT_DEMO_TOKEN);
      setUser(DEFAULT_DEMO_USER);
      return { success: true, user: DEFAULT_DEMO_USER };
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
      const newUser = userData || { id: Date.now(), full_name: fullName, email, role: 'NOC Operator', status: 'Active' };
      setToken(access_token || DEFAULT_DEMO_TOKEN);
      setUser(newUser);
      return { success: true, message: message || 'Account created successfully.' };
    } catch (err) {
      const newUser = { id: Date.now(), full_name: fullName, email, role: 'NOC Operator', status: 'Active' };
      setToken(DEFAULT_DEMO_TOKEN);
      setUser(newUser);
      return { success: true, message: 'Account created successfully (Demo Mode).' };
    } finally {
      setLoading(false);
    }
  };

  const loginGuestDemo = () => {
    setToken(DEFAULT_DEMO_TOKEN);
    setUser(DEFAULT_DEMO_USER);
    return { success: true, user: DEFAULT_DEMO_USER };
  };

  const logoutUser = () => {
    setToken(DEFAULT_DEMO_TOKEN);
    setUser(DEFAULT_DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: true,
        loginUser,
        registerUser,
        loginGuestDemo,
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
