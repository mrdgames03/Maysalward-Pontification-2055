import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';

const { FiLock, FiEye, FiEyeOff, FiLogIn, FiShield, FiRefreshCw, FiUser } = FiIcons;

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(username, password);
    if (!result.success) {
      setError(result.error);
      setPassword(''); // Clear password field on error
    }

    setIsLoading(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  const handleResetPassword = () => {
    if (!resetUsername.trim()) {
      setError('Please enter a username to reset');
      return;
    }

    const result = resetPassword(resetUsername);
    if (result.success) {
      setError('');
      setShowResetConfirm(false);
      setResetUsername('');
      setUsername('');
      setPassword('');
      // Show success message briefly
      setError('Password reset to default (12345). Please log in.');
      setTimeout(() => setError(''), 3000);
    } else {
      setError(result.error);
    }
  };

  const userRoles = [
    { username: 'sadmin', role: 'Super Admin', description: 'Full system access', color: 'bg-red-100 text-red-800' },
    { username: 'admin', role: 'Admin', description: 'Manage courses & trainees', color: 'bg-blue-100 text-blue-800' },
    { username: 'trainee', role: 'Trainee', description: 'View progress & courses', color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <img 
              src="/logo.png" 
              alt="Maysalward Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <SafeIcon icon={FiShield} className="text-white text-2xl hidden" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Maysalward Training Hub
            </h1>
            <p className="text-gray-600">Multi-Level Access System</p>
          </motion.div>
        </div>

        {/* User Roles Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiUser} className="text-gray-500" />
            <span>Available Access Levels</span>
          </h3>
          <div className="space-y-2">
            {userRoles.map((role) => (
              <div key={role.username} className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm text-gray-900">{role.username}</span>
                  <span className="text-gray-500 text-xs ml-2">{role.description}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                  {role.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiUser} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 text-sm flex items-center space-x-1 ${
                  error.includes('reset') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <SafeIcon icon={FiLock} className="text-xs" />
                <span>{error}</span>
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || !username || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <SafeIcon icon={FiLogIn} />
                <span>Access System</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Password Reset Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full text-center text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiRefreshCw} className="text-xs" />
              <span>Forgot password? Reset to default</span>
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="space-y-3">
                <input
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter username to reset"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetPassword}
                    className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      setShowResetConfirm(false);
                      setResetUsername('');
                      setError('');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiShield} className="text-blue-600 text-sm mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Multi-Level Access</p>
              <p className="text-blue-700">
                Different access levels provide appropriate permissions for each user type. 
                Default password: 12345 (changeable after login)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>© 2025 Maysalward Training Hub</p>
          <p>Role-Based Access Control System</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;