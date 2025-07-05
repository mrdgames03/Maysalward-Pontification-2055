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
  const [currentUser, setCurrentUser] = useState(null);

  // 🔑 USER ROLES AND DEFAULT CREDENTIALS
  const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    TRAINEE: 'trainee'
  };

  const DEFAULT_USERS = [
    {
      username: 'sadmin',
      password: '12345',
      role: USER_ROLES.SUPER_ADMIN,
      name: 'Super Administrator',
      permissions: [
        'view_all', 'add_trainees', 'edit_trainees', 'delete_trainees', 'bulk_delete',
        'upgrade_levels', 'add_courses', 'edit_courses', 'delete_courses',
        'add_instructors', 'edit_instructors', 'delete_instructors',
        'add_gifts', 'edit_gifts', 'delete_gifts', 'view_analytics',
        'manage_categories', 'manage_locations', 'flag_trainees',
        'change_password', 'system_settings'
      ]
    },
    {
      username: 'admin',
      password: '12345',
      role: USER_ROLES.ADMIN,
      name: 'Administrator',
      permissions: [
        'view_trainees', 'add_trainees', 'edit_trainees', 'flag_trainees',
        'add_courses', 'edit_courses', 'add_instructors', 'edit_instructors',
        'view_analytics', 'manage_categories', 'manage_locations', 'change_password'
      ]
    },
    {
      username: 'trainee',
      password: '12345',
      role: USER_ROLES.TRAINEE,
      name: 'Trainee User',
      permissions: [
        'view_own_profile', 'view_own_progress', 'view_available_courses',
        'view_available_gifts', 'redeem_gifts', 'change_password'
      ]
    }
  ];

  const AUTH_KEY = 'maysalward_auth';
  const USERS_KEY = 'maysalward_users';
  const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

  // Initialize users in localStorage if not exists
  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (!savedUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  // Get all users from localStorage
  const getUsers = () => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    return savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;
  };

  // Update users in localStorage
  const updateUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  // Get user by username
  const getUserByUsername = (username) => {
    const users = getUsers();
    return users.find(user => user.username === username);
  };

  // Create trainee user account automatically
  const createTraineeUser = (traineeData) => {
    const users = getUsers();
    const username = traineeData.email;
    
    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return existingUser; // User already exists
    }

    // Create new trainee user
    const newUser = {
      username: username,
      password: '12345',
      role: USER_ROLES.TRAINEE,
      name: traineeData.name,
      traineeId: traineeData.id,
      permissions: [
        'view_own_profile', 'view_own_progress', 'view_available_courses',
        'view_available_gifts', 'redeem_gifts', 'change_password'
      ]
    };

    users.push(newUser);
    updateUsers(users);
    return newUser;
  };

  // Update trainee user when trainee data changes
  const updateTraineeUser = (traineeData) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.traineeId === traineeData.id);
    
    if (userIndex !== -1) {
      // Update existing user
      users[userIndex] = {
        ...users[userIndex],
        name: traineeData.name,
        username: traineeData.email // Update username if email changed
      };
      updateUsers(users);
      return users[userIndex];
    }
    
    return null;
  };

  // Delete trainee user when trainee is deleted
  const deleteTraineeUser = (traineeId) => {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.traineeId !== traineeId);
    updateUsers(filteredUsers);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem(AUTH_KEY);
      if (authData) {
        try {
          const { timestamp, authenticated, user } = JSON.parse(authData);
          const now = new Date().getTime();

          // Check if session is still valid
          if (authenticated && (now - timestamp) < SESSION_DURATION) {
            setIsAuthenticated(true);
            setCurrentUser(user);
          } else {
            // Session expired, clear storage
            localStorage.removeItem(AUTH_KEY);
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } catch (error) {
          // Invalid auth data, clear it
          localStorage.removeItem(AUTH_KEY);
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (username, password) => {
    const user = getUserByUsername(username);
    if (user && user.password === password) {
      const authData = {
        authenticated: true,
        timestamp: new Date().getTime(),
        user: {
          username: user.username,
          role: user.role,
          name: user.name,
          permissions: user.permissions,
          traineeId: user.traineeId || null
        }
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      setCurrentUser(authData.user);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long' };
    }

    if (currentPassword === newPassword) {
      return { success: false, error: 'New password must be different from current password' };
    }

    try {
      // Update password
      users[userIndex].password = newPassword;
      updateUsers(users);

      // Force logout to require login with new password
      logout();
      return { success: true, message: 'Password changed successfully. Please log in with your new password.' };
    } catch (error) {
      return { success: false, error: 'Failed to change password. Please try again.' };
    }
  };

  const resetPassword = (username) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Reset to default password
    users[userIndex].password = '12345';
    updateUsers(users);

    return { success: true, message: 'Password reset to default (12345). Please log in again.' };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const isSuperAdmin = () => hasRole(USER_ROLES.SUPER_ADMIN);
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);
  const isTrainee = () => hasRole(USER_ROLES.TRAINEE);

  const getCurrentPassword = () => {
    if (!currentUser) return 'Default';
    const user = getUserByUsername(currentUser.username);
    return user?.password === '12345' ? 'Default' : 'Custom';
  };

  const value = {
    // Auth state
    isAuthenticated,
    isLoading,
    currentUser,

    // Auth methods
    login,
    logout,
    changePassword,
    resetPassword,
    getCurrentPassword,

    // Trainee user management
    createTraineeUser,
    updateTraineeUser,
    deleteTraineeUser,

    // Permission methods
    hasPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isTrainee,

    // User roles
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};