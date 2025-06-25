import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const StatCard = ({ title, value, icon, color, trend }) => {
  const isPositiveTrend = trend && trend.startsWith('+');
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 border-blue-500',
    green: 'bg-green-100 text-green-600 border-green-500',
    purple: 'bg-purple-100 text-purple-600 border-purple-500',
    red: 'bg-red-100 text-red-600 border-red-500',
    yellow: 'bg-yellow-100 text-yellow-600 border-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 ${
              isPositiveTrend ? 'text-green-600' : 'text-red-600'
            }`}>
              <SafeIcon 
                icon={isPositiveTrend ? FiTrendingUp : FiTrendingDown} 
                className="text-sm" 
              />
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <SafeIcon icon={icon} className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;