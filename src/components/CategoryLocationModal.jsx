import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiX, FiPlus, FiEdit, FiTrash, FiSave, FiTag, FiMapPin, FiAlert } = FiIcons;

const CategoryLocationModal = ({ isOpen, onClose, type }) => {
  const {
    courseCategories,
    locations,
    addCourseCategory,
    removeCourseCategory,
    updateCourseCategory,
    addLocation,
    removeLocation,
    updateLocation
  } = useTrainee();

  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  const isCategory = type === 'category';
  const items = isCategory ? courseCategories : locations;
  const title = isCategory ? 'Course Categories' : 'Locations';
  const icon = isCategory ? FiTag : FiMapPin;
  const addFunction = isCategory ? addCourseCategory : addLocation;
  const removeFunction = isCategory ? removeCourseCategory : removeLocation;
  const updateFunction = isCategory ? updateCourseCategory : updateLocation;

  const handleAddItem = () => {
    if (!newItem.trim()) {
      setError(`Please enter a ${isCategory ? 'category' : 'location'}`);
      return;
    }

    const success = addFunction(newItem.trim());
    if (success) {
      setNewItem('');
      setError('');
    } else {
      setError(`This ${isCategory ? 'category' : 'location'} already exists`);
    }
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditValue(item);
    setError('');
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      setError(`${isCategory ? 'Category' : 'Location'} cannot be empty`);
      return;
    }

    const result = updateFunction(editingItem, editValue.trim());
    if (result.success) {
      setEditingItem(null);
      setEditValue('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
    setError('');
  };

  const handleRemoveItem = (item) => {
    if (window.confirm(`Are you sure you want to remove "${item}"?`)) {
      const result = removeFunction(item);
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
            <h2 className="text-2xl font-bold text-gray-900">Manage {title}</h2>
            <p className="text-gray-600">Add, edit, or remove {isCategory ? 'course categories' : 'training locations'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Add New Item */}
        <div className={`mb-6 p-4 rounded-lg border ${isCategory ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <SafeIcon icon={FiPlus} className={isCategory ? 'text-blue-600' : 'text-green-600'} />
            <span>Add New {isCategory ? 'Category' : 'Location'}</span>
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={icon} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={newItem}
                onChange={(e) => {
                  setNewItem(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => handleKeyPress(e, handleAddItem)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter new ${isCategory ? 'category' : 'location'}`}
              />
            </div>
            <motion.button
              onClick={handleAddItem}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                isCategory ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
              }`}
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

        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current {title}</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  {editingItem === item ? (
                    <div className="flex-1 flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SafeIcon icon={icon} className="text-gray-400" />
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
                        <SafeIcon icon={icon} className="text-gray-600" />
                        <span className="font-medium text-gray-900">{item}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <SafeIcon icon={FiEdit} />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item)}
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

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={icon} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No {isCategory ? 'categories' : 'locations'} available</p>
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

export default CategoryLocationModal;