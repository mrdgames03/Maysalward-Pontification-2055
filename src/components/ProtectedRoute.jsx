import React from 'react';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLock, FiShield } = FiIcons;

const ProtectedRoute = ({ children, permission, fallback }) => {
  const { hasPermission, hasAnyPermission, currentUser } = useAuth();

  // Check if user has required permission(s)
  const hasAccess = Array.isArray(permission) 
    ? hasAnyPermission(permission)
    : hasPermission(permission);

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiLock} className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SafeIcon icon={FiShield} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Current Access Level</span>
            </div>
            <p className="text-sm text-gray-600">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">@{currentUser?.username}</p>
          </div>
          <p className="text-sm text-gray-500">
            Contact your administrator if you need access to this feature.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;