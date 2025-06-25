import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import TraineeCard from '../components/TraineeCard';

const { FiUser, FiPhone, FiMail, FiCalendar, FiBook, FiSave, FiCheckCircle, FiPlus } = FiIcons;

const Registration = () => {
  const navigate = useNavigate();
  const { addTrainee, educationOptions, addEducationOption } = useTrainee();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTrainee, setNewTrainee] = useState(null);
  const [showCustomEducation, setShowCustomEducation] = useState(false);
  const [customEducation, setCustomEducation] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    education: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Educational background is required';
    }

    if (showCustomEducation && !customEducation.trim()) {
      newErrors.customEducation = 'Please enter the custom education option';
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

    // If education changes to something other than 'custom', hide custom input
    if (name === 'education' && value !== 'custom') {
      setShowCustomEducation(false);
      setCustomEducation('');
    }
  };

  const handleEducationChange = (e) => {
    const value = e.target.value;
    
    if (value === 'custom') {
      setShowCustomEducation(true);
      setFormData(prev => ({ ...prev, education: '' }));
    } else {
      setShowCustomEducation(false);
      setCustomEducation('');
      setFormData(prev => ({ ...prev, education: value }));
    }

    // Clear error
    if (errors.education) {
      setErrors(prev => ({ ...prev, education: '' }));
    }
  };

  const handleCustomEducationChange = (e) => {
    setCustomEducation(e.target.value);
    setFormData(prev => ({ ...prev, education: e.target.value }));
    
    // Clear error
    if (errors.customEducation || errors.education) {
      setErrors(prev => ({ 
        ...prev, 
        customEducation: '',
        education: ''
      }));
    }
  };

  const handleAddCustomEducation = () => {
    if (customEducation.trim()) {
      const success = addEducationOption(customEducation.trim());
      if (success) {
        setFormData(prev => ({ ...prev, education: customEducation.trim() }));
        setShowCustomEducation(false);
        setCustomEducation('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // If using custom education, add it to options first
      if (showCustomEducation && customEducation.trim()) {
        addEducationOption(customEducation.trim());
        setFormData(prev => ({ ...prev, education: customEducation.trim() }));
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const trainee = addTrainee(formData);
      setNewTrainee(trainee);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        education: ''
      });
      setShowCustomEducation(false);
      setCustomEducation('');
    } catch (error) {
      console.error('Error registering trainee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRegistration = () => {
    setNewTrainee(null);
  };

  if (newTrainee) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiCheckCircle} className="text-3xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Trainee has been registered successfully. Here's their digital card:
          </p>

          <TraineeCard trainee={newTrainee} showActions={true} />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleNewRegistration}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Register Another Trainee
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register New Trainee
          </h1>
          <p className="text-gray-600">
            Fill in the details to register a new trainee in the system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter full name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
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
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
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
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiCalendar} className="text-gray-400" />
              </div>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Educational Background *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiBook} className="text-gray-400" />
              </div>
              <select
                name="education"
                value={showCustomEducation ? 'custom' : formData.education}
                onChange={handleEducationChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                  errors.education ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select educational background</option>
                {educationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="custom">+ Add Custom Option</option>
              </select>
            </div>
            {errors.education && (
              <p className="mt-1 text-sm text-red-600">{errors.education}</p>
            )}
          </div>

          {/* Custom Education Input */}
          {showCustomEducation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Educational Background *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiBook} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customEducation}
                    onChange={handleCustomEducationChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.customEducation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter custom education background"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomEducation}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiPlus} />
                  <span>Add</span>
                </button>
              </div>
              {errors.customEducation && (
                <p className="mt-1 text-sm text-red-600">{errors.customEducation}</p>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <SafeIcon icon={FiSave} />
                <span>Register Trainee</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Registration;