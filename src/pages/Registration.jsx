import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import { useAuth } from '../context/AuthContext';
import TraineeCard from '../components/TraineeCard';
import PhotoUpload from '../components/PhotoUpload';

const { FiUser, FiPhone, FiMail, FiCalendar, FiBook, FiSave, FiCheckCircle, FiPlus, FiStar, FiKey } = FiIcons;

const Registration = () => {
  const navigate = useNavigate();
  const { addTrainee, educationOptions, addEducationOption } = useTrainee();
  const { createTraineeUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTrainee, setNewTrainee] = useState(null);
  const [newUserAccount, setNewUserAccount] = useState(null);
  const [showCustomEducation, setShowCustomEducation] = useState(false);
  const [customEducation, setCustomEducation] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    education: '',
    photo: null
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
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // If education changes to something other than 'custom', hide custom input
    if (name === 'education' && value !== 'custom') {
      setShowCustomEducation(false);
      setCustomEducation('');
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
      setErrors(prev => ({ ...prev, customEducation: '', education: '' }));
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

      // Calculate initial points - 5 points for photo upload
      const initialPoints = photoUploaded ? 5 : 0;

      const trainee = addTrainee({
        ...formData,
        points: initialPoints
      });

      // Create user account automatically
      const userAccount = createTraineeUser(trainee);

      setNewTrainee(trainee);
      setNewUserAccount(userAccount);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        education: '',
        photo: null
      });
      setShowCustomEducation(false);
      setCustomEducation('');
      setPhotoUploaded(false);
    } catch (error) {
      console.error('Error registering trainee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRegistration = () => {
    setNewTrainee(null);
    setNewUserAccount(null);
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
          <p className="text-gray-600 mb-4">
            Trainee has been registered successfully and a user account has been created.
          </p>

          {/* User Account Created Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SafeIcon icon={FiKey} className="text-blue-600 text-lg" />
              <span className="text-blue-900 font-medium">User Account Created!</span>
            </div>
            <div className="text-blue-800 text-sm space-y-1">
              <p><strong>Username:</strong> {newUserAccount?.username}</p>
              <p><strong>Password:</strong> 12345 (default)</p>
              <p className="text-blue-600 mt-2">The trainee can now log in to access their profile and redeem gifts!</p>
            </div>
          </motion.div>

          {/* Points Award Message */}
          {newTrainee.points > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiStar} className="text-yellow-600 text-lg" />
                <span className="text-yellow-800 font-medium">
                  Bonus! +{newTrainee.points} points awarded for uploading profile photo!
                </span>
              </div>
            </motion.div>
          )}

          <p className="text-gray-600 mb-6">
            Here's their digital card:
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
            Fill in the details to register a new trainee and create their user account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload with Points Info */}
          <div className="relative">
            <PhotoUpload
              photo={formData.photo}
              onPhotoChange={handlePhotoChange}
              type="trainee"
            />
            {/* Points Info */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={FiStar} className="text-yellow-600 text-sm" />
                <span className="text-yellow-800 text-xs font-medium">
                  Upload a profile photo to earn 5 bonus points!
                </span>
              </div>
            </motion.div>

            {/* Photo Uploaded Confirmation */}
            {photoUploaded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="text-green-600 text-sm" />
                  <span className="text-green-800 text-xs font-medium">
                    Great! You'll earn 5 points for uploading a photo
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
              Email Address * <span className="text-blue-600 text-xs">(will be used as username)</span>
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
            <p className="mt-1 text-xs text-gray-500">
              A user account will be created automatically with this email as username and password "12345"
            </p>
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

          {/* User Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiKey} className="text-blue-600" />
              <span className="text-blue-900 font-medium">Auto User Account Creation</span>
            </div>
            <div className="text-blue-800 text-sm">
              <p>✅ Username will be set to the email address</p>
              <p>✅ Default password will be: <strong>12345</strong></p>
              <p>✅ Trainee can change password after first login</p>
              <p>✅ Account will have trainee permissions to view profile and redeem gifts</p>
            </div>
          </motion.div>

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
                <span>Register Trainee & Create Account</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Registration;