import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiUsers, FiStar, FiMail, FiUserMinus, FiAward } = FiIcons;

const ViewAttendeesModal = ({ isOpen, onClose, course, onRemoveAttendee, onMarkComplete }) => {
  if (!isOpen || !course) return null;

  const attendees = course.attendees || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Attendees</h2>
            <p className="text-gray-600">
              "{course.title}" - {attendees.length}/{course.maxAttendees} attendees
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Course Info */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-indigo-600 font-medium">Dates</p>
              <p className="text-indigo-900">
                {format(new Date(course.startDate), 'MMM dd')} - {format(new Date(course.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-indigo-600 font-medium">Time</p>
              <p className="text-indigo-900">{course.startTime} - {course.endTime}</p>
            </div>
            <div>
              <p className="text-indigo-600 font-medium">Points Reward</p>
              <p className="text-indigo-900">{course.points} points</p>
            </div>
          </div>
        </div>

        {/* Attendees List */}
        <div className="flex-1 overflow-y-auto">
          {attendees.length > 0 ? (
            <div className="space-y-3">
              {attendees.map((attendee) => (
                <motion.div
                  key={attendee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUsers} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{attendee.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{attendee.serialNumber}</span>
                        <span className="flex items-center space-x-1">
                          <SafeIcon icon={FiMail} className="text-xs" />
                          <span>{attendee.email}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <SafeIcon icon={FiStar} className="text-sm" />
                        <span className="font-medium">{attendee.points} pts</span>
                      </div>
                      <p className="text-xs text-gray-600">Current Points</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onMarkComplete(course.id, attendee.id)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <SafeIcon icon={FiAward} className="text-sm" />
                      </button>
                      <button
                        onClick={() => onRemoveAttendee(course.id, attendee.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove from course"
                      >
                        <SafeIcon icon={FiUserMinus} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <SafeIcon icon={FiUsers} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No attendees enrolled yet</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 mt-6 border-t border-gray-200">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewAttendeesModal;