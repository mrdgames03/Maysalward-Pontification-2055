import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiX, FiSave, FiBook, FiCalendar, FiUser, FiStar, FiClock, FiMapPin, FiUsers, FiPlus, FiEdit2 } = FiIcons;

const AddTrainingCourseModal = ({ isOpen, onClose, onSave, courseToEdit = null }) => {
  const { 
    courseCategories, 
    locations, 
    addCourseCategory, 
    addLocation, 
    updateCourseCategory, 
    updateLocation,
    instructors 
  } = useTrainee();
  
  const isEditMode = !!courseToEdit;
  
  const [formData, setFormData] = useState({
    title: courseToEdit?.title || '',
    description: courseToEdit?.description || '',
    startDate: courseToEdit?.startDate || new Date().toISOString().split('T')[0],
    endDate: courseToEdit?.endDate || '',
    startTime: courseToEdit?.startTime || '',
    endTime: courseToEdit?.endTime || '',
    instructor: courseToEdit?.instructor || '',
    category: courseToEdit?.category || courseCategories[0] || 'General',
    points: courseToEdit?.points || 10,
    maxAttendees: courseToEdit?.maxAttendees || 20,
    location: courseToEdit?.location || locations[0] || 'Amman',
    requirements: courseToEdit?.requirements || '',
    materials: courseToEdit?.materials || ''
  });

  const [errors, setErrors] = useState({});
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');
  const [editLocationValue, setEditLocationValue] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after or equal to start date';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.startDate}T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (formData.points < 1 || formData.points > 100) {
      newErrors.points = 'Points must be between 1 and 100';
    }

    if (formData.maxAttendees < 1 || formData.maxAttendees > 100) {
      newErrors.maxAttendees = 'Max attendees must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else if (value === 'edit') {
      // Don't change form data when selecting edit option
      return;
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomLocation(true);
      setFormData(prev => ({ ...prev, location: '' }));
    } else if (value === 'edit') {
      // Don't change form data when selecting edit option
      return;
    } else {
      setShowCustomLocation(false);
      setCustomLocation('');
      setFormData(prev => ({ ...prev, location: value }));
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      const success = addCourseCategory(customCategory.trim());
      if (success) {
        setFormData(prev => ({ ...prev, category: customCategory.trim() }));
        setShowCustomCategory(false);
        setCustomCategory('');
      }
    }
  };

  const handleAddCustomLocation = () => {
    if (customLocation.trim()) {
      const success = addLocation(customLocation.trim());
      if (success) {
        setFormData(prev => ({ ...prev, location: customLocation.trim() }));
        setShowCustomLocation(false);
        setCustomLocation('');
      }
    }
  };

  const handleStartEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryValue(category);
  };

  const handleStartEditLocation = (location) => {
    setEditingLocation(location);
    setEditLocationValue(location);
  };

  const handleSaveEditCategory = () => {
    if (editCategoryValue.trim()) {
      const result = updateCourseCategory(editingCategory, editCategoryValue.trim());
      if (result.success) {
        // Update form data if the current category was edited
        if (formData.category === editingCategory) {
          setFormData(prev => ({ ...prev, category: editCategoryValue.trim() }));
        }
        setEditingCategory(null);
        setEditCategoryValue('');
      }
    }
  };

  const handleSaveEditLocation = () => {
    if (editLocationValue.trim()) {
      const result = updateLocation(editingLocation, editLocationValue.trim());
      if (result.success) {
        // Update form data if the current location was edited
        if (formData.location === editingLocation) {
          setFormData(prev => ({ ...prev, location: editLocationValue.trim() }));
        }
        setEditingLocation(null);
        setEditLocationValue('');
      }
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryValue('');
  };

  const handleCancelEditLocation = () => {
    setEditingLocation(null);
    setEditLocationValue('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const courseData = {
      ...formData,
      status: isEditMode ? courseToEdit.status : 'scheduled',
      attendees: isEditMode ? courseToEdit.attendees : [],
      createdAt: isEditMode ? courseToEdit.createdAt : new Date().toISOString()
    };

    onSave(courseData);

    // Reset form only if not editing
    if (!isEditMode) {
      setFormData({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        startTime: '',
        endTime: '',
        instructor: '',
        category: courseCategories[0] || 'General',
        points: 10,
        maxAttendees: 20,
        location: locations[0] || 'Amman',
        requirements: '',
        materials: ''
      });
    }

    setErrors({});
    setShowCustomCategory(false);
    setShowCustomLocation(false);
    setCustomCategory('');
    setCustomLocation('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Training Course' : 'Create Training Course'}
            </h2>
            <p className="text-gray-600">
              {isEditMode ? 'Update course details' : 'Set up a new training course for attendees'}
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
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiBook} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter course title"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category and Max Attendees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category with Inline Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {!showCustomCategory ? (
                <div className="space-y-2">
                  <select
                    name="category"
                    value={showCustomCategory ? 'custom' : formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {courseCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="custom">+ Add New Category</option>
                  </select>
                  {/* Quick Edit Categories */}
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Quick Edit: </span>
                    {courseCategories.slice(0, 3).map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleStartEditCategory(category)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <SafeIcon icon={FiEdit2} className="text-xs" />
                        <span>{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new category"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCategory(false);
                      setCustomCategory('');
                      setFormData(prev => ({ ...prev, category: courseCategories[0] || 'General' }));
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUsers} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Maximum number of attendees"
                />
              </div>
              {errors.maxAttendees && (
                <p className="mt-1 text-sm text-red-600">{errors.maxAttendees}</p>
              )}
            </div>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiCalendar} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiCalendar} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Start and End Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiClock} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiClock} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter course description..."
            />
          </div>

          {/* Instructor, Location, and Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Instructor Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUser} className="text-gray-400" />
                </div>
                <select
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">Select instructor</option>
                  {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.name}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
              {instructors.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  No instructors registered. Add instructors first.
                </p>
              )}
            </div>

            {/* Location with Inline Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              {!showCustomLocation ? (
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiMapPin} className="text-gray-400" />
                    </div>
                    <select
                      name="location"
                      value={showCustomLocation ? 'custom' : formData.location}
                      onChange={handleLocationChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                      <option value="custom">+ Add New Location</option>
                    </select>
                  </div>
                  {/* Quick Edit Locations */}
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Quick Edit: </span>
                    {locations.slice(0, 2).map(location => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => handleStartEditLocation(location)}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <SafeIcon icon={FiEdit2} className="text-xs" />
                        <span>{location}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new location"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLocation}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLocation(false);
                      setCustomLocation('');
                      setFormData(prev => ({ ...prev, location: locations[0] || 'Amman' }));
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Points *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiStar} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.points ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Points awarded upon completion"
                />
              </div>
              {errors.points && (
                <p className="mt-1 text-sm text-red-600">{errors.points}</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites & Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Any prerequisites or requirements for attendees..."
            />
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials & Resources
            </label>
            <textarea
              name="materials"
              value={formData.materials}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Materials needed or resources provided..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>{isEditMode ? 'Update Course' : 'Create Training Course'}</span>
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

        {/* Inline Edit Modals */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-96"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
              <input
                type="text"
                value={editCategoryValue}
                onChange={(e) => setEditCategoryValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Category name"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveEditCategory}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEditCategory}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {editingLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 w-96"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Location</h3>
              <input
                type="text"
                value={editLocationValue}
                onChange={(e) => setEditLocationValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                placeholder="Location name"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveEditLocation}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEditLocation}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddTrainingCourseModal;