import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiMapPin, FiUser, FiStar, FiCheck, FiEdit, FiTrash } = FiIcons;

const TrainingSessionCard = ({ session, onComplete, onEdit, onDelete }) => {
  const startDateTime = new Date(`${session.date}T${session.startTime}`);
  const endDateTime = new Date(`${session.date}T${session.endTime}`);
  const now = new Date();
  
  const isUpcoming = startDateTime > now;
  const isOngoing = startDateTime <= now && endDateTime >= now;
  const isPast = endDateTime < now;
  
  const getStatusColor = () => {
    if (session.status === 'completed') return 'bg-green-100 text-green-800';
    if (isOngoing) return 'bg-blue-100 text-blue-800';
    if (isUpcoming) return 'bg-yellow-100 text-yellow-800';
    if (isPast) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (session.status === 'completed') return 'Completed';
    if (isOngoing) return 'Ongoing';
    if (isUpcoming) return 'Upcoming';
    if (isPast) return 'Past';
    return 'Scheduled';
  };

  const duration = Math.round((endDateTime - startDateTime) / (1000 * 60 * 60 * 100)) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {session.description && (
            <p className="text-gray-600 text-sm mb-3">{session.description}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          {session.status !== 'completed' && !isPast && (
            <button
              onClick={() => onEdit(session)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit} className="text-sm" />
            </button>
          )}
          
          <button
            onClick={() => onDelete(session.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Training Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiClock} className="text-xs" />
            <span>{format(startDateTime, 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiClock} className="text-xs" />
            <span>
              {format(startDateTime, 'HH:mm')} - {format(endDateTime, 'HH:mm')}
              {duration && <span className="text-gray-400 ml-1">({duration}h)</span>}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {session.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="text-xs" />
              <span>{session.location}</span>
            </div>
          )}
          
          {session.instructor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="text-xs" />
              <span>{session.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Points and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiStar} className="text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            {session.points} points
          </span>
        </div>

        {session.status !== 'completed' && isPast && (
          <motion.button
            onClick={() => onComplete(session.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiCheck} />
            <span>Mark Complete</span>
          </motion.button>
        )}

        {session.status === 'completed' && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <SafeIcon icon={FiCheck} />
            <span>Completed</span>
            {session.completedAt && (
              <span className="text-gray-400">
                on {format(new Date(session.completedAt), 'MMM dd')}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TrainingSessionCard;