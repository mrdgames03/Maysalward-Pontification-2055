import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import { PROGRESSION_LEVELS, getCurrentLevel } from '../utils/progressionSystem';

const { FiX, FiTrendingUp, FiStar, FiLock, FiEye, FiEyeOff, FiShield, FiAlertTriangle, FiCheckCircle } = FiIcons;

const LevelUpgradeModal = ({ isOpen, onClose, trainee, onUpgrade }) => {
  const { hasPermission, currentUser } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Admin password (same as login)
  const ADMIN_PASSWORD = '12345';

  // Check if user has upgrade_levels permission (Super Admin only)
  const canUpgradeLevels = hasPermission('upgrade_levels');

  React.useEffect(() => {
    if (isOpen && trainee) {
      const currentLevel = getCurrentLevel(trainee.points);
      setSelectedLevel(currentLevel);
      setPassword('');
      setError('');
      setReason('');
      setShowPassword(false);
    }
  }, [isOpen, trainee]);

  if (!isOpen || !trainee) return null;

  // If user doesn't have permission to upgrade levels
  if (!canUpgradeLevels) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl p-6 w-full max-w-md"
        >
          {/* Access Denied Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiLock} className="text-red-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
                <p className="text-red-600 text-sm">Insufficient Permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiX} className="text-xl text-gray-600" />
            </button>
          </div>

          {/* Permission Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="text-red-600" />
              <div>
                <p className="font-medium text-red-900">Level Upgrade Restricted</p>
                <p className="text-red-700 text-sm">
                  Only Super Administrators can upgrade trainee levels.
                </p>
              </div>
            </div>
          </div>

          {/* Current User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiShield} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Your Access Level</span>
            </div>
            <p className="text-sm text-gray-600">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">@{currentUser?.username} - {currentUser?.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>

          {/* Required Permission Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Required Permission:</h4>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiTrendingUp} className="text-blue-600" />
              <span className="text-blue-800 font-mono text-sm">upgrade_levels</span>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              This permission is only available to Super Administrators for security reasons.
            </p>
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentLevel = getCurrentLevel(trainee.points);
  const currentLevelIndex = PROGRESSION_LEVELS.findIndex(level => level.id === currentLevel.id);

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setError('');
  };

  const handleUpgrade = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (!password.trim()) {
      setError('Admin password is required');
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError('Incorrect admin password');
      setPassword('');
      return;
    }

    // Validate level selection
    if (!selectedLevel || selectedLevel.id === currentLevel.id) {
      setError('Please select a different level');
      return;
    }

    // Validate reason for upgrade
    if (!reason.trim()) {
      setError('Please provide a reason for the level upgrade');
      return;
    }

    setIsUpgrading(true);

    try {
      // Simulate delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate new points (set to minimum of selected level)
      const newPoints = selectedLevel.minPoints;

      onUpgrade(trainee.id, {
        points: newPoints,
        levelUpgrade: {
          oldLevel: currentLevel,
          newLevel: selectedLevel,
          upgradeReason: reason,
          upgradedBy: 'Admin',
          upgradeDate: new Date().toISOString()
        }
      });

      handleClose();
    } catch (error) {
      setError('Failed to upgrade level');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleClose = () => {
    setSelectedLevel(null);
    setPassword('');
    setError('');
    setReason('');
    setShowPassword(false);
    setIsUpgrading(false);
    onClose();
  };

  const isUpgrade = selectedLevel && PROGRESSION_LEVELS.findIndex(l => l.id === selectedLevel.id) > currentLevelIndex;
  const isDowngrade = selectedLevel && PROGRESSION_LEVELS.findIndex(l => l.id === selectedLevel.id) < currentLevelIndex;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upgrade Trainee Level</h2>
              <p className="text-gray-600 text-sm">Manually adjust {trainee.name}'s progression level</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Super Admin Only Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiShield} className="text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Super Admin Function</p>
              <p className="text-purple-700 text-sm">
                Level upgrades require Super Administrator privileges for security.
              </p>
            </div>
          </div>
        </div>

        {/* Current Level Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center border-2"
              style={{
                backgroundColor: currentLevel.bgColor,
                borderColor: currentLevel.borderColor,
                color: currentLevel.textColor
              }}
            >
              <span className="text-lg">{currentLevel.emoji}</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Current Level</h3>
              <p className="text-blue-700">{currentLevel.name} - {trainee.points} points</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpgrade} className="space-y-6">
          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROGRESSION_LEVELS.map((level, index) => {
                const isCurrentLevel = level.id === currentLevel.id;
                const isSelected = selectedLevel?.id === level.id;

                return (
                  <motion.div
                    key={level.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelChange(level)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : isCurrentLevel
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                        style={{
                          backgroundColor: level.bgColor,
                          borderColor: level.borderColor,
                          color: level.textColor
                        }}
                      >
                        <span className="text-sm">{level.emoji}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{level.name}</p>
                          {isCurrentLevel && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{level.minPoints}+ points</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Upgrade/Downgrade Warning */}
          {selectedLevel && selectedLevel.id !== currentLevel.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                isUpgrade
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon 
                  icon={isUpgrade ? FiCheckCircle : FiAlertTriangle} 
                  className={isUpgrade ? 'text-green-600' : 'text-red-600'} 
                />
                <div>
                  <p className={`font-medium ${isUpgrade ? 'text-green-800' : 'text-red-800'}`}>
                    {isUpgrade ? 'Level Upgrade' : 'Level Downgrade'}
                  </p>
                  <p className={`text-sm ${isUpgrade ? 'text-green-700' : 'text-red-700'}`}>
                    Points will be {isUpgrade ? 'increased' : 'decreased'} to {selectedLevel.minPoints} 
                    ({isUpgrade ? '+' : ''}{selectedLevel.minPoints - trainee.points} points)
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Level Change *
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="3"
              placeholder="Explain why this level change is being made..."
              required
            />
          </div>

          {/* Admin Password */}
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
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter admin password to confirm level change"
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
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <SafeIcon icon={FiAlertTriangle} className="text-red-600" />
              <span className="text-red-800">{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <motion.button
              type="submit"
              disabled={isUpgrading || !selectedLevel || selectedLevel.id === currentLevel.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isUpgrading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <SafeIcon icon={FiTrendingUp} />
                  <span>
                    {selectedLevel && selectedLevel.id !== currentLevel.id
                      ? isUpgrade
                        ? 'Upgrade Level'
                        : 'Downgrade Level'
                      : 'Select Level'}
                  </span>
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleClose}
              disabled={isUpgrading}
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
            <SafeIcon icon={FiShield} className="text-gray-600 text-sm mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Admin password required for manual level changes. This action will be logged 
                and the trainee's points will be adjusted accordingly.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelUpgradeModal;