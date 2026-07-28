import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('noc_admin_logged_in') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    return localStorage.getItem('noc_admin_username') || 'Admin';
  });

  const loginAdmin = (username, password) => {
    const validUser = 'Admin';
    const validPass = 'admin@123';

    if (username.trim() === validUser && password === validPass) {
      setIsAdmin(true);
      setAdminUser(validUser);
      localStorage.setItem('noc_admin_logged_in', 'true');
      localStorage.setItem('noc_admin_username', validUser);
      return { success: true };
    } else {
      return { 
        success: false, 
        message: 'Invalid Admin credentials. Correct Username: Admin, Password: admin@123' 
      };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('noc_admin_logged_in');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminUser, loginAdmin, logoutAdmin }}>
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
