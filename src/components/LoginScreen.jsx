import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';

const { FiLock, FiEye, FiEyeOff, FiLogIn, FiShield, FiRefreshCw } = FiIcons;

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { login, resetPassword, getCurrentPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // 🔐 LOGIN ATTEMPT
    const result = login(password);
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

  const handleResetPassword = () => {
    const result = resetPassword();
    if (result.success) {
      setError('');
      setShowResetConfirm(false);
      setPassword('');
      // Show success message briefly
      setError('Password reset to default (1234). Please log in.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const passwordType = getCurrentPassword();

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
            <p className="text-gray-600">Secure Access Required</p>
            
            {/* Password Status Indicator */}
            <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
              <SafeIcon icon={FiShield} className="text-blue-600 text-sm" />
              <span className="text-blue-800 text-sm font-medium">
                {passwordType} Password
              </span>
            </div>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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
                placeholder="Enter system password"
                required
                autoFocus
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
            disabled={isLoading || !password}
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
              <div className="text-center">
                <p className="text-sm text-yellow-800 mb-3">
                  This will reset the password to default (1234). Are you sure?
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetPassword}
                    className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
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
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiShield} className="text-blue-600 text-sm mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Secure Access</p>
              <p className="text-blue-700">
                This system is protected to ensure trainee data security and privacy.
                You can change your password after logging in.
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
          <p>© 2024 Maysalward Training Hub</p>
          <p>Authorized Access Only</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;