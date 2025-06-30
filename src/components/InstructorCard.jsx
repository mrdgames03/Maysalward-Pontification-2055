import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiMail, FiPhone, FiBook, FiEdit, FiTrash, FiAward, FiCalendar } = FiIcons;

const InstructorCard = ({ instructor, onEdit, onDelete }) => {
  const handleEmailClick = () => {
    window.open(`mailto:${instructor.email}`);
  };

  const handlePhoneClick = () => {
    window.open(`tel:${instructor.phone}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Profile Photo */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
            {instructor.photo ? (
              <img 
                src={instructor.photo} 
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <SafeIcon icon={FiUser} className="text-white text-xl" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{instructor.name}</h3>
            <p className="text-sm text-gray-600">Instructor</p>
            <div className="flex items-center space-x-1 mt-1">
              <SafeIcon icon={FiCalendar} className="text-gray-400 text-xs" />
              <span className="text-xs text-gray-500">
                Joined {format(new Date(instructor.createdAt), 'MMM yyyy')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(instructor)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Instructor"
          >
            <SafeIcon icon={FiEdit} className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(instructor.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Instructor"
          >
            <SafeIcon icon={FiTrash} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Bio */}
      {instructor.bio && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{instructor.bio}</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiMail} className="text-gray-400 text-sm" />
          <button
            onClick={handleEmailClick}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            {instructor.email}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiPhone} className="text-gray-400 text-sm" />
          <button
            onClick={handlePhoneClick}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            {instructor.phone}
          </button>
        </div>
      </div>

      {/* Available Courses */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <SafeIcon icon={FiBook} className="text-gray-600" />
          <h4 className="font-medium text-gray-900">Can Conduct ({instructor.availableCourses.length})</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {instructor.availableCourses.map(course => (
            <span
              key={course}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
            >
              <SafeIcon icon={FiAward} className="mr-1 text-xs" />
              {course}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorCard;