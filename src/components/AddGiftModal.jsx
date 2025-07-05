import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import PhotoUpload from './PhotoUpload';

const { FiX, FiSave, FiGift, FiStar, FiHash, FiUsers, FiType, FiFileText, FiTag, FiPlus, FiMinus, FiCheck } = FiIcons;

const AddGiftModal = ({ isOpen, onClose, onSave, giftToEdit = null }) => {
  const { trainees } = useTrainee();
  const isEditMode = !!giftToEdit;

  const [formData, setFormData] = useState({
    title: giftToEdit?.title || '',
    description: giftToEdit?.description || '',
    type: giftToEdit?.type || 'gift',
    pointsRequired: giftToEdit?.pointsRequired || 50,
    availableQuantity: giftToEdit?.availableQuantity || 10,
    limitPerPerson: giftToEdit?.limitPerPerson || 1,
    photo: giftToEdit?.photo || null,
    category: giftToEdit?.category || 'General',
    expiryDate: giftToEdit?.expiryDate || '',
    terms: giftToEdit?.terms || '',
    targetedTrainees: giftToEdit?.targetedTrainees || []
  });

  const [errors, setErrors] = useState({});
  const [showTraineeSelection, setShowTraineeSelection] = useState(false);
  const [selectedTrainees, setSelectedTrainees] = useState(giftToEdit?.targetedTrainees || []);
  const [traineeSearch, setTraineeSearch] = useState('');

  const giftTypes = [
    { value: 'gift', label: 'Physical Gift' },
    { value: 'coupon', label: 'Discount Coupon' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'experience', label: 'Experience' },
    { value: 'digital', label: 'Digital Item' }
  ];

  const categories = [
    'General',
    'Electronics',
    'Books & Education',
    'Food & Beverages',
    'Fashion & Accessories',
    'Sports & Fitness',
    'Entertainment',
    'Travel',
    'Software & Apps',
    'Courses & Training'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Gift title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.pointsRequired < 1 || formData.pointsRequired > 10000) {
      newErrors.pointsRequired = 'Points must be between 1 and 10,000';
    }

    if (formData.availableQuantity < 1 || formData.availableQuantity > 1000) {
      newErrors.availableQuantity = 'Quantity must be between 1 and 1,000';
    }

    if (formData.limitPerPerson < 1 || formData.limitPerPerson > 10) {
      newErrors.limitPerPerson = 'Limit per person must be between 1 and 10';
    }

    if (formData.expiryDate) {
      const expiry = new Date(formData.expiryDate);
      const today = new Date();
      if (expiry <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (photo) => {
    setFormData(prev => ({ ...prev, photo }));
  };

  const handleTraineeToggle = (trainee) => {
    setSelectedTrainees(prev => {
      const isSelected = prev.find(t => t.id === trainee.id);
      if (isSelected) {
        return prev.filter(t => t.id !== trainee.id);
      } else {
        return [...prev, trainee];
      }
    });
  };

  const handleSelectAllTrainees = () => {
    const filteredTrainees = trainees.filter(trainee =>
      trainee.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
      trainee.serialNumber.toLowerCase().includes(traineeSearch.toLowerCase())
    );

    if (selectedTrainees.length === filteredTrainees.length) {
      setSelectedTrainees([]);
    } else {
      setSelectedTrainees(filteredTrainees);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const giftData = {
      ...formData,
      targetedTrainees: selectedTrainees,
      createdAt: isEditMode ? giftToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(giftData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'gift',
      pointsRequired: 50,
      availableQuantity: 10,
      limitPerPerson: 1,
      photo: null,
      category: 'General',
      expiryDate: '',
      terms: '',
      targetedTrainees: []
    });
    setSelectedTrainees([]);
    setErrors({});
    setShowTraineeSelection(false);
    setTraineeSearch('');
    onClose();
  };

  const filteredTrainees = trainees.filter(trainee =>
    trainee.name.toLowerCase().includes(traineeSearch.toLowerCase()) ||
    trainee.serialNumber.toLowerCase().includes(traineeSearch.toLowerCase())
  );

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
              {isEditMode ? 'Edit Gift' : 'Create New Gift'}
            </h2>
            <p className="text-gray-600">
              {isEditMode ? 'Update gift details' : 'Create a new gift, coupon, or giveaway for trainees'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <PhotoUpload
              photo={formData.photo}
              onPhotoChange={handlePhotoChange}
              type="gift"
              className="mb-4"
            />
          </div>

          {/* Title and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiGift} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter gift title"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiType} className="text-gray-400" />
                </div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {giftTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <SafeIcon icon={FiFileText} className="text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the gift, coupon, or offer..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Points, Quantity, and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Required *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiStar} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="pointsRequired"
                  value={formData.pointsRequired}
                  onChange={handleInputChange}
                  min="1"
                  max="10000"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pointsRequired ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Points needed to redeem"
                />
              </div>
              {errors.pointsRequired && (
                <p className="mt-1 text-sm text-red-600">{errors.pointsRequired}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiHash} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="availableQuantity"
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  min="1"
                  max="1000"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.availableQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Total available quantity"
                />
              </div>
              {errors.availableQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.availableQuantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiTag} className="text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Limit Per Person and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limit Per Person *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiUsers} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="limitPerPerson"
                  value={formData.limitPerPerson}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.limitPerPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="How many times per person"
                />
              </div>
              {errors.limitPerPerson && (
                <p className="mt-1 text-sm text-red-600">{errors.limitPerPerson}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions (Optional)
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Any terms, conditions, or restrictions..."
            />
          </div>

          {/* Targeted Trainees Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Target Specific Trainees (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowTraineeSelection(!showTraineeSelection)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={showTraineeSelection ? FiMinus : FiPlus} />
                <span>{showTraineeSelection ? 'Hide' : 'Select'} Trainees</span>
              </button>
            </div>

            {selectedTrainees.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 font-medium mb-2">
                  {selectedTrainees.length} trainee{selectedTrainees.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainees.slice(0, 5).map(trainee => (
                    <span
                      key={trainee.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      {trainee.name}
                    </span>
                  ))}
                  {selectedTrainees.length > 5 && (
                    <span className="text-xs text-blue-600">
                      +{selectedTrainees.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {showTraineeSelection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                {/* Search and Select All */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiUsers} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={traineeSearch}
                      onChange={(e) => setTraineeSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search trainees by name or serial..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllTrainees}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    {selectedTrainees.length === filteredTrainees.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* Trainees List */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredTrainees.map(trainee => {
                    const isSelected = selectedTrainees.find(t => t.id === trainee.id);
                    return (
                      <div
                        key={trainee.id}
                        onClick={() => handleTraineeToggle(trainee)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <SafeIcon icon={FiCheck} className="text-white text-xs" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{trainee.name}</p>
                            <p className="text-sm text-gray-600">{trainee.serialNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">{trainee.points} pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredTrainees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <SafeIcon icon={FiUsers} className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No trainees found</p>
                  </div>
                )}
              </motion.div>
            )}
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
              <span>{isEditMode ? 'Update Gift' : 'Create Gift'}</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={handleClose}
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

export default AddGiftModal;