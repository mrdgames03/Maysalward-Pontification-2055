import React from 'react';
import { motion } from 'framer-motion';
import { getCurrentLevel } from '../utils/progressionSystem';

const ProgressionBadge = ({ points, size = 'md', showLabel = true, animate = true }) => {
  const level = getCurrentLevel(points);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const BadgeContent = () => (
    <div className="flex items-center space-x-2">
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold shadow-lg border-2`}
        style={{
          backgroundColor: level.bgColor,
          borderColor: level.borderColor,
          color: level.textColor
        }}
        title={`${level.name} - ${points} points`}
      >
        <span className="text-lg">{level.emoji}</span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-semibold ${textSizes[size]}`} style={{ color: level.color }}>
            {level.name}
          </span>
          <span className="text-xs text-gray-600">{points} pts</span>
        </div>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <BadgeContent />
      </motion.div>
    );
  }

  return <BadgeContent />;
};

export default ProgressionBadge;