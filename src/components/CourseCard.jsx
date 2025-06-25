import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBook, FiCalendar, FiUser, FiStar, FiCheck, FiClock, FiTag, FiEdit, FiTrash } = FiIcons;

const CourseCard = ({ course, onComplete, onEdit, onDelete }) => {
  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);
  const now = new Date();
  
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;
  const isCompleted = course.status === 'completed';

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800';
    if (isOngoing) return 'bg-blue-100 text-blue-800';
    if (isUpcoming) return 'bg-yellow-100 text-yellow-800';
    if (isPast) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isOngoing) return 'In Progress';
    if (isUpcoming) return 'Upcoming';
    if (isPast) return 'Overdue';
    return 'Enrolled';
  };

  const getDaysRemaining = () => {
    if (isCompleted) return null;
    if (isUpcoming) return differenceInDays(startDate, now);
    if (isOngoing) return differenceInDays(endDate, now);
    return null;
  };

  const daysRemaining = getDaysRemaining();

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
            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {course.description && (
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {!isCompleted && (
            <button
              onClick={() => onEdit(course)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit} className="text-sm" />
            </button>
          )}
          <button
            onClick={() => onDelete(course.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiCalendar} className="text-xs" />
            <span>{format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}</span>
          </div>
          {course.duration && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiClock} className="text-xs" />
              <span>{course.duration}</span>
            </div>
          )}
          {daysRemaining !== null && (
            <div className={`flex items-center space-x-2 text-sm ${
              isOngoing ? 'text-blue-600' : isUpcoming ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              <SafeIcon icon={FiClock} className="text-xs" />
              <span>
                {isUpcoming ? `Starts in ${daysRemaining} days` : 
                 isOngoing ? `${daysRemaining} days remaining` : ''}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiTag} className="text-xs" />
            <span>{course.category}</span>
          </div>
          {course.instructor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="text-xs" />
              <span>{course.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prerequisites */}
      {course.requirements && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Prerequisites:</h4>
          <p className="text-sm text-gray-600">{course.requirements}</p>
        </div>
      )}

      {/* Points and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiStar} className="text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            {course.points} points
          </span>
        </div>

        {!isCompleted && isPast && (
          <motion.button
            onClick={() => onComplete(course.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiCheck} />
            <span>Mark Complete</span>
          </motion.button>
        )}

        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <SafeIcon icon={FiCheck} />
            <span>Completed</span>
            {course.completedAt && (
              <span className="text-gray-400">
                on {format(new Date(course.completedAt), 'MMM dd')}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;