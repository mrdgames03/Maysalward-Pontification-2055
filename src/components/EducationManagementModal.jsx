import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiX, FiPlus, FiEdit, FiTrash, FiSave, FiBook, FiAlert } = FiIcons;

const EducationManagementModal = ({ isOpen, onClose }) => {
  const { 
    educationOptions, 
    addEducationOption, 
    removeEducationOption, 
    updateEducationOption 
  } = useTrainee();
  
  const [newOption, setNewOption] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) {
      setError('Please enter an education option');
      return;
    }

    const success = addEducationOption(newOption.trim());
    if (success) {
      setNewOption('');
      setError('');
    } else {
      setError('This education option already exists');
    }
  };

  const handleStartEdit = (option) => {
    setEditingOption(option);
    setEditValue(option);
    setError('');
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      setError('Education option cannot be empty');
      return;
    }

    const result = updateEducationOption(editingOption, editValue.trim());
    if (result.success) {
      setEditingOption(null);
      setEditValue('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingOption(null);
    setEditValue('');
    setError('');
  };

  const handleRemoveOption = (option) => {
    if (window.confirm(`Are you sure you want to remove "${option}"?`)) {
      const result = removeEducationOption(option);
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Education Options</h2>
            <p className="text-gray-600">Add, edit, or remove educational background options</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Add New Option */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className="text-blue-600" />
            <span>Add New Education Option</span>
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiBook} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={newOption}
                onChange={(e) => {
                  setNewOption(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => handleKeyPress(e, handleAddOption)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new education option"
              />
            </div>
            <motion.button
              onClick={handleAddOption}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiPlus} />
              <span>Add</span>
            </motion.button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-800"
          >
            <SafeIcon icon={FiAlert} className="text-red-600" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Education Options List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Education Options</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {educationOptions.map((option) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  {editingOption === option ? (
                    <div className="flex-1 flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SafeIcon icon={FiBook} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => {
                            setEditValue(e.target.value);
                            setError('');
                          }}
                          onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Save"
                        >
                          <SafeIcon icon={FiSave} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <SafeIcon icon={FiX} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiBook} className="text-gray-600" />
                        <span className="font-medium text-gray-900">{option}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStartEdit(option)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit} />
                        </button>
                        <button
                          onClick={() => handleRemoveOption(option)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <SafeIcon icon={FiTrash} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {educationOptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiBook} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No education options available</p>
            </div>
          )}
        </div>

        {/* Footer */}
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

export default EducationManagementModal;