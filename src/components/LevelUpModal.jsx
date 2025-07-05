import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiStar, FiAward, FiGift } = FiIcons;

const LevelUpModal = ({ isOpen, onClose, levelUpData }) => {
  if (!isOpen || !levelUpData) return null;

  const { newLevel, oldLevel, pointsGained } = levelUpData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl"
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">{newLevel.emoji}</span>
          </div>
        </motion.div>

        {/* Level Up Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Level Up!</h2>
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-lg">{oldLevel.emoji}</span>
              <span className="font-semibold" style={{ color: oldLevel.color }}>
                {oldLevel.name}
              </span>
              <SafeIcon icon={FiStar} className="text-yellow-500 mx-2" />
              <span className="text-lg">{newLevel.emoji}</span>
              <span className="font-semibold" style={{ color: newLevel.color }}>
                {newLevel.name}
              </span>
            </div>
            <p className="text-lg text-gray-600 mb-4">{newLevel.description}</p>
          </div>
        </motion.div>

        {/* Points Gained */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <SafeIcon icon={FiStar} className="text-green-600" />
            <span className="text-green-800 font-medium">
              +{pointsGained} points earned!
            </span>
          </div>
        </motion.div>

        {/* New Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center space-x-2">
            <SafeIcon icon={FiGift} className="text-purple-600" />
            <span>New Perks Unlocked!</span>
          </h3>
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {newLevel.perks.slice(0, 4).map((perk, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <SafeIcon icon={FiAward} className="text-blue-600 text-sm mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{perk}</span>
                </motion.li>
              ))}
            </ul>
            {newLevel.perks.length > 4 && (
              <p className="text-xs text-gray-500 mt-2">
                +{newLevel.perks.length - 4} more perks available
              </p>
            )}
          </div>
        </motion.div>

        {/* Close Button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Continue Learning!
        </motion.button>

        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <SafeIcon icon={FiX} className="text-lg" />
        </button>
      </motion.div>
    </div>
  );
};

export default LevelUpModal;