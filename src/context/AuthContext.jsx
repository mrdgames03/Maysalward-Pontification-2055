import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔑 LOGIN PASSWORD CONFIGURATION
  const CORRECT_PASSWORD = '1234'; // ✅ Password is set to "1234"
  const AUTH_KEY = 'maysalward_auth';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem(AUTH_KEY);
      
      if (authData) {
        try {
          const { timestamp, authenticated } = JSON.parse(authData);
          const now = new Date().getTime();
          
          // Check if session is still valid (24 hours)
          if (authenticated && (now - timestamp) < SESSION_DURATION) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear storage
            localStorage.removeItem(AUTH_KEY);
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Invalid auth data, clear it
          localStorage.removeItem(AUTH_KEY);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (password) => {
    // 🔐 PASSWORD VALIDATION - Checks against "1234"
    if (password === CORRECT_PASSWORD) {
      const authData = {
        authenticated: true,
        timestamp: new Date().getTime()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Incorrect password. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};