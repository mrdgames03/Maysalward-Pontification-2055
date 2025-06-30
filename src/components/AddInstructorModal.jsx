import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PhotoUpload from './PhotoUpload';
import { useTrainee } from '../context/TraineeContext';

const { FiX, FiSave, FiUser, FiMail, FiPhone, FiBook, FiPlus, FiCheck, FiStar } = FiIcons;

const AddInstructorModal = ({ isOpen, onClose, onSave, instructorToEdit = null }) => {
  const { instructorCourses, addInstructorCourse } = useTrainee();
  const isEditMode = !!instructorToEdit;

  const [formData, setFormData] = useState({
    name: instructorToEdit?.name || '',
    email: instructorToEdit?.email || '',
    phone: instructorToEdit?.phone || '',
    bio: instructorToEdit?.bio || '',
    photo: instructorToEdit?.photo || null,
    expertise: instructorToEdit?.expertise || [],
    availableCourses: instructorToEdit?.availableCourses || []
  });

  const [errors, setErrors] = useState({});
  const [showCustomCourse, setShowCustomCourse] = useState(false);
  const [customCourse, setCustomCourse] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(!!instructorToEdit?.photo);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.availableCourses.length === 0) {
      newErrors.availableCourses = 'Please select at least one course';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (photo) => {
    const hadPhoto = !!formData.photo;
    const hasPhoto = !!photo;
    
    setFormData(prev => ({ ...prev, photo }));
    
    // Track if photo was just uploaded (not removed)
    if (!hadPhoto && hasPhoto) {
      setPhotoUploaded(true);
    } else if (hadPhoto && !hasPhoto) {
      setPhotoUploaded(false);
    }
  };

  const handleCourseToggle = (course) => {
    setFormData(prev => ({
      ...prev,
      availableCourses: prev.availableCourses.includes(course)
        ? prev.availableCourses.filter(c => c !== course)
        : [...prev.availableCourses, course]
    }));

    // Clear error when user selects a course
    if (errors.availableCourses) {
      setErrors(prev => ({ ...prev, availableCourses: '' }));
    }
  };

  const handleAddCustomCourse = () => {
    if (customCourse.trim()) {
      const success = addInstructorCourse(customCourse.trim());
      if (success) {
        setFormData(prev => ({
          ...prev,
          availableCourses: [...prev.availableCourses, customCourse.trim()]
        }));
        setCustomCourse('');
        setShowCustomCourse(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const instructorData = {
      ...formData,
      id: isEditMode ? instructorToEdit.id : Date.now().toString(),
      createdAt: isEditMode ? instructorToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    onSave(instructorData);

    // Reset form only if not editing
    if (!isEditMode) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        bio: '',
        photo: null,
        expertise: [],
        availableCourses: []
      });
      setPhotoUploaded(false);
    }
    
    setErrors({});
    setShowCustomCourse(false);
    setCustomCourse('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Instructor' : 'Add New Instructor'}
            </h2>
            <p className="text-gray-600">
              {isEditMode ? 'Update instructor details' : 'Register a new instructor in the system'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload with Bonus Info */}
          <div className="relative">
            <PhotoUpload 
              photo={formData.photo} 
              onPhotoChange={handlePhotoChange}
              type="instructor"
            />
            {/* Photo Uploaded Confirmation */}
            {photoUploaded && formData.photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiStar} className="text-green-600 text-sm" />
                  <span className="text-green-800 text-xs font-medium">
                    Professional photo uploaded - great for instructor profile!
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiUser} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter instructor's full name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="instructor@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiPhone} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+962 7X XXX XXXX"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio / Background
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Brief description of instructor's background and experience..."
            />
          </div>

          {/* Available Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Courses They Can Conduct *
            </label>
            <div className="space-y-3">
              {/* Course Selection Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {instructorCourses.map(course => (
                  <motion.div
                    key={course}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCourseToggle(course)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.availableCourses.includes(course)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.availableCourses.includes(course)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.availableCourses.includes(course) && (
                          <SafeIcon icon={FiCheck} className="text-white text-xs" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{course}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Custom Course */}
              {!showCustomCourse ? (
                <motion.button
                  type="button"
                  onClick={() => setShowCustomCourse(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add New Course</span>
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiBook} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new course name"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomCourse}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCourse(false);
                      setCustomCourse('');
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
              )}
            </div>
            {errors.availableCourses && (
              <p className="mt-1 text-sm text-red-600">{errors.availableCourses}</p>
            )}
          </div>

          {/* Selected Courses Summary */}
          {formData.availableCourses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Courses ({formData.availableCourses.length})</h4>
              <div className="flex flex-wrap gap-2">
                {formData.availableCourses.map(course => (
                  <span
                    key={course}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => handleCourseToggle(course)}
                      className="ml-2 hover:text-blue-600"
                    >
                      <SafeIcon icon={FiX} className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>{isEditMode ? 'Update Instructor' : 'Add Instructor'}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddInstructorModal;