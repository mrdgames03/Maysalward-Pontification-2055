import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiTrash, FiAlertTriangle, FiLock, FiEye, FiEyeOff, FiUsers } = FiIcons;

const BulkDeleteModal = ({ isOpen, onClose, selectedTrainees, onConfirmBulkDelete }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // The admin password (same as login)
  const ADMIN_PASSWORD = '1234';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError('Incorrect admin password');
      setPassword('');
      return;
    }

    setIsDeleting(true);
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfirmBulkDelete(selectedTrainees.map(t => t.id));
      handleClose();
    } catch (error) {
      setError('Failed to delete trainees');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsDeleting(false);
    setShowPassword(false);
    onClose();
  };

  if (!isOpen || !selectedTrainees?.length) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiAlertTriangle} className="text-red-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Delete Trainees</h2>
              <p className="text-red-600 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Selected Trainees Count */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">
                {selectedTrainees.length} Trainee{selectedTrainees.length > 1 ? 's' : ''} Selected
              </h3>
              <p className="text-red-700 text-sm">
                You are about to delete {selectedTrainees.length} trainee record{selectedTrainees.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Trainees List */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
          <h4 className="font-medium text-gray-900 mb-3">Selected Trainees:</h4>
          <div className="space-y-2">
            {selectedTrainees.map(trainee => (
              <div key={trainee.id} className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={FiUsers} className="text-gray-400 text-xs" />
                <span className="font-medium text-gray-900">{trainee.name}</span>
                <span className="text-gray-600">({trainee.serialNumber})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiAlertTriangle} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Warning: This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>All selected trainee profiles and personal information</li>
                <li>All check-in records and activity history</li>
                <li>All course enrollments and training sessions</li>
                <li>All points and achievement data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Password Confirmation */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter admin password to confirm bulk deletion"
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
                className="mt-2 text-sm text-red-600 flex items-center space-x-1"
              >
                <SafeIcon icon={FiAlertTriangle} className="text-xs" />
                <span>{error}</span>
              </motion.p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <motion.button
              type="submit"
              disabled={isDeleting || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <SafeIcon icon={FiTrash} />
                  <span>Delete {selectedTrainees.length} Trainee{selectedTrainees.length > 1 ? 's' : ''}</span>
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleClose}
              disabled={isDeleting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiLock} className="text-gray-600 text-sm mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Admin password required for bulk deletion operations. This ensures only authorized 
                personnel can delete multiple trainee records at once.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkDeleteModal;