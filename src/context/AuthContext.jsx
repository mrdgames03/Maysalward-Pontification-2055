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

  // 🔑 DEFAULT PASSWORD CONFIGURATION
  const DEFAULT_PASSWORD = '1234';
  const AUTH_KEY = 'maysalward_auth';
  const PASSWORD_KEY = 'maysalward_admin_password';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Get current admin password (default or custom)
  const getCurrentPassword = () => {
    const customPassword = localStorage.getItem(PASSWORD_KEY);
    return customPassword || DEFAULT_PASSWORD;
  };

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
    const currentPassword = getCurrentPassword();
    
    // 🔐 PASSWORD VALIDATION - Checks against current password
    if (password === currentPassword) {
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

  const changePassword = (currentPassword, newPassword) => {
    const storedPassword = getCurrentPassword();
    
    // Verify current password
    if (currentPassword !== storedPassword) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Validate new password
    if (!newPassword || newPassword.trim().length < 4) {
      return {
        success: false,
        error: 'New password must be at least 4 characters long'
      };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        error: 'New password must be different from current password'
      };
    }

    try {
      // Store new password
      localStorage.setItem(PASSWORD_KEY, newPassword);
      
      // Force logout to require login with new password
      logout();
      
      return { 
        success: true,
        message: 'Password changed successfully. Please log in with your new password.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to change password. Please try again.'
      };
    }
  };

  const resetPassword = () => {
    // Reset to default password (for emergency recovery)
    localStorage.removeItem(PASSWORD_KEY);
    logout();
    return {
      success: true,
      message: 'Password reset to default (1234). Please log in again.'
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    changePassword,
    resetPassword,
    getCurrentPassword: () => getCurrentPassword() === DEFAULT_PASSWORD ? 'Default' : 'Custom'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};