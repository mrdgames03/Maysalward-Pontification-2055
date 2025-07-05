import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentLevel, getNextLevel, getProgressToNextLevel } from '../utils/progressionSystem';

const ProgressionProgress = ({ points, showDetails = true }) => {
  const currentLevel = getCurrentLevel(points);
  const nextLevel = getNextLevel(points);
  const progress = getProgressToNextLevel(points);

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLevel.emoji}</span>
            <span className="font-semibold" style={{ color: currentLevel.color }}>
              {currentLevel.name}
            </span>
          </div>
          {nextLevel && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Next: {nextLevel.emoji} {nextLevel.name}</span>
              <span className="font-medium">({progress.pointsToNext} pts needed)</span>
            </div>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full transition-all duration-500 ease-out"
            style={{ 
              backgroundColor: currentLevel.color,
              width: `${progress.progress}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {showDetails && (
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{currentLevel.minPoints} pts</span>
            <span className="font-medium">{points} pts ({progress.progress}%)</span>
            {nextLevel && <span>{nextLevel.minPoints} pts</span>}
          </div>
        )}
      </div>

      {!nextLevel && (
        <div className="text-center mt-2">
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full">
            <span className="text-lg">👑</span>
            <span className="text-sm font-semibold text-yellow-800">Maximum Level Achieved!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressionProgress;