import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const { FiHome, FiUserPlus, FiCamera, FiUsers, FiMenu, FiX, FiLogOut, FiBook, FiUser, FiSettings, FiShield } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { logout, getCurrentPassword } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/register', label: 'Register', icon: FiUserPlus },
    { path: '/scanner', label: 'Scanner', icon: FiCamera },
    { path: '/trainees', label: 'Trainees', icon: FiUsers },
    { path: '/training-courses', label: 'Courses', icon: FiBook },
    { path: '/instructors', label: 'Instructors', icon: FiUser }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <img
                  src="/logo.png"
                  alt="Maysalward Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">Maysalward</span>
                <span className="text-sm text-gray-600 -mt-1">Training Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="flex space-x-1">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className="relative">
                    <motion.div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SafeIcon icon={item.icon} className="text-lg" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        layoutId="activeTab"
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* User Menu */}
              <div className="relative ml-4">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                  title="Admin Menu"
                >
                  <SafeIcon icon={FiShield} className="text-lg" />
                  <span className="text-sm font-medium">Admin</span>
                </motion.button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {/* Password Status */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiShield} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Admin Account</p>
                          <p className="text-xs text-gray-600">
                            Password: {getCurrentPassword()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setShowPasswordModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiSettings} className="text-gray-400" />
                      <span className="text-sm">Change Password</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <SafeIcon icon={FiLogOut} className="text-red-400" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Change Password"
              >
                <SafeIcon icon={FiSettings} className="text-lg" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <SafeIcon icon={FiLogOut} className="text-lg" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <SafeIcon icon={isMobileMenuOpen ? FiX : FiMenu} className="text-xl text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 mb-1 transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Mobile Admin Section */}
              <div className="mx-2 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                  <SafeIcon icon={FiShield} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Admin Account</p>
                    <p className="text-xs">Password: {getCurrentPassword()}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mx-0 mb-1 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiSettings} className="text-lg" />
                  <span className="font-medium">Change Password</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Click outside to close user menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </nav>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default Navigation;