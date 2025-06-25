import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBook, FiCalendar, FiUser, FiStar, FiClock, FiTag, FiMapPin, FiUsers, FiUserPlus, FiEdit, FiTrash, FiEye } = FiIcons;

const TrainingCourseCard = ({ course, onEdit, onDelete, onViewAttendees, onAddAttendees }) => {
  const startDate = new Date(`${course.startDate}T${course.startTime}`);
  const endDate = new Date(`${course.endDate}T${course.endTime}`);
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
    if (isOngoing) return 'Ongoing';
    if (isUpcoming) return 'Upcoming';
    if (isPast) return 'Past';
    return 'Scheduled';
  };

  const getDaysRemaining = () => {
    if (isCompleted) return null;
    if (isUpcoming) return differenceInDays(startDate, now);
    if (isOngoing) return differenceInDays(endDate, now);
    return null;
  };

  const daysRemaining = getDaysRemaining();
  const attendeeCount = course.attendees ? course.attendees.length : 0;
  const availableSpots = course.maxAttendees - attendeeCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-500"
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
          <button
            onClick={() => onViewAttendees(course)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View Attendees"
          >
            <SafeIcon icon={FiEye} className="text-sm" />
          </button>
          <button
            onClick={() => onAddAttendees(course)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Add Attendees"
          >
            <SafeIcon icon={FiUserPlus} className="text-sm" />
          </button>
          <button
            onClick={() => onEdit(course)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Course"
          >
            <SafeIcon icon={FiEdit} className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Course"
          >
            <SafeIcon icon={FiTrash} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Course Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiCalendar} className="text-xs" />
            <span>{format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiClock} className="text-xs" />
            <span>
              {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </span>
          </div>
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
          {course.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiMapPin} className="text-xs" />
              <span>{course.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Attendee Info */}
      <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">
              {attendeeCount}/{course.maxAttendees} Attendees
            </span>
          </div>
          <div className="text-sm text-indigo-700">
            {availableSpots > 0 ? `${availableSpots} spots available` : 'Full'}
          </div>
        </div>
        <div className="mt-2 w-full bg-indigo-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(attendeeCount / course.maxAttendees) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements */}
      {course.requirements && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Requirements:</h4>
          <p className="text-sm text-gray-600">{course.requirements}</p>
        </div>
      )}

      {/* Materials */}
      {course.materials && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Materials:</h4>
          <p className="text-sm text-blue-600">{course.materials}</p>
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

        <div className="flex space-x-2">
          <motion.button
            onClick={() => onAddAttendees(course)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={availableSpots === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiUserPlus} />
            <span>Add Attendees</span>
          </motion.button>
          
          <motion.button
            onClick={() => onViewAttendees(course)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
          >
            <SafeIcon icon={FiUsers} />
            <span>View ({attendeeCount})</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrainingCourseCard;