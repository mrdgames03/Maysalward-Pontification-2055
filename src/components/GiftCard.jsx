import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGift, FiStar, FiUsers, FiCalendar, FiEdit, FiTrash, FiEye, FiClock, FiTag, FiCheck, FiX } = FiIcons;

const GiftCard = ({ gift, onEdit, onDelete, onViewRedemptions, showActions = true }) => {
  const isExpired = gift.expiryDate && new Date(gift.expiryDate) < new Date();
  const isOutOfStock = gift.totalRedeemed >= gift.availableQuantity;
  const stockPercentage = (gift.totalRedeemed / gift.availableQuantity) * 100;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'coupon': return FiTag;
      case 'voucher': return FiGift;
      case 'experience': return FiCalendar;
      case 'digital': return FiUsers;
      default: return FiGift;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'coupon': return 'bg-green-100 text-green-800';
      case 'voucher': return 'bg-purple-100 text-purple-800';
      case 'experience': return 'bg-orange-100 text-orange-800';
      case 'digital': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'bg-red-100 text-red-800';
    if (isOutOfStock) return 'bg-gray-100 text-gray-800';
    if (gift.status === 'active') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isOutOfStock) return 'Out of Stock';
    if (gift.status === 'active') return 'Active';
    return 'Inactive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Gift Image */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {gift.photo ? (
              <img
                src={gift.photo}
                alt={gift.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeIcon icon={getTypeIcon(gift.type)} className="text-white text-xl" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{gift.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(gift.type)}`}>
                {gift.type.charAt(0).toUpperCase() + gift.type.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{gift.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <SafeIcon icon={FiTag} className="text-xs" />
                <span>{gift.category}</span>
              </span>
              {gift.expiryDate && (
                <span className={`flex items-center space-x-1 ${isExpired ? 'text-red-600' : ''}`}>
                  <SafeIcon icon={FiClock} className="text-xs" />
                  <span>Expires {format(new Date(gift.expiryDate), 'MMM dd, yyyy')}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onViewRedemptions(gift)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Redemptions"
            >
              <SafeIcon icon={FiEye} className="text-sm" />
            </button>
            <button
              onClick={() => onEdit(gift)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Gift"
            >
              <SafeIcon icon={FiEdit} className="text-sm" />
            </button>
            <button
              onClick={() => onDelete(gift.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Gift"
            >
              <SafeIcon icon={FiTrash} className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <SafeIcon icon={FiStar} className="text-blue-600 text-lg mx-auto mb-1" />
          <p className="text-xs text-gray-600">Points Required</p>
          <p className="font-bold text-blue-600">{gift.pointsRequired}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <SafeIcon icon={FiUsers} className="text-green-600 text-lg mx-auto mb-1" />
          <p className="text-xs text-gray-600">Redeemed</p>
          <p className="font-bold text-green-600">{gift.totalRedeemed}/{gift.availableQuantity}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <SafeIcon icon={FiGift} className="text-purple-600 text-lg mx-auto mb-1" />
          <p className="text-xs text-gray-600">Limit/Person</p>
          <p className="font-bold text-purple-600">{gift.limitPerPerson}</p>
        </div>
      </div>

      {/* Stock Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Stock Availability</span>
          <span className="text-sm text-gray-600">
            {gift.availableQuantity - gift.totalRedeemed} remaining
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stockPercentage >= 100
                ? 'bg-red-500'
                : stockPercentage >= 80
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Targeted Trainees */}
      {gift.targetedTrainees && gift.targetedTrainees.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <SafeIcon icon={FiUsers} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Targeted to {gift.targetedTrainees.length} specific trainee{gift.targetedTrainees.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {gift.targetedTrainees.slice(0, 3).map(trainee => (
              <span key={trainee.id} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {trainee.name}
              </span>
            ))}
            {gift.targetedTrainees.length > 3 && (
              <span className="text-xs text-yellow-600">
                +{gift.targetedTrainees.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Terms */}
      {gift.terms && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Terms & Conditions:</h4>
          <p className="text-sm text-gray-600">{gift.terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
        <span>Created {format(new Date(gift.createdAt), 'MMM dd, yyyy')}</span>
        {(isExpired || isOutOfStock) && (
          <div className="flex items-center space-x-1 text-red-600">
            <SafeIcon icon={FiX} className="text-xs" />
            <span>Not Available</span>
          </div>
        )}
        {!isExpired && !isOutOfStock && gift.status === 'active' && (
          <div className="flex items-center space-x-1 text-green-600">
            <SafeIcon icon={FiCheck} className="text-xs" />
            <span>Available</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GiftCard;