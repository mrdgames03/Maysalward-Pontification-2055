import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import AddInstructorModal from '../components/AddInstructorModal';
import InstructorCard from '../components/InstructorCard';
import DeleteInstructorModal from '../components/DeleteInstructorModal';

const { FiUser, FiPlus, FiSearch, FiBook, FiUsers, FiMail, FiPhone } = FiIcons;

const Instructors = () => {
  const { 
    instructors, 
    addInstructor, 
    updateInstructor, 
    deleteInstructor,
    instructorCourses 
  } = useTrainee();

  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter instructors based on search
  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.availableCourses.some(course => 
      course.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddInstructor = (instructorData) => {
    if (editingInstructor) {
      updateInstructor(editingInstructor.id, instructorData);
      setEditingInstructor(null);
    } else {
      addInstructor(instructorData);
    }
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructor(instructor);
    setShowInstructorModal(true);
  };

  const handleDeleteInstructor = (instructorId) => {
    deleteInstructor(instructorId);
    setShowDeleteModal(null);
  };

  const handleCloseModal = () => {
    setShowInstructorModal(false);
    setEditingInstructor(null);
  };

  // Calculate stats
  const stats = {
    total: instructors.length,
    totalCourses: instructorCourses.length,
    avgCoursesPerInstructor: instructors.length > 0 
      ? (instructors.reduce((sum, inst) => sum + inst.availableCourses.length, 0) / instructors.length).toFixed(1)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
          <p className="text-gray-600">Manage and view all instructors in the system</p>
        </div>
        <motion.button
          onClick={() => setShowInstructorModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Instructor</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUsers} className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Instructors</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBook} className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Available Courses</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUser} className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Avg Courses/Instructor</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgCoursesPerInstructor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search instructors by name, email, or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor, index) => (
            <motion.div
              key={instructor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InstructorCard
                instructor={instructor}
                onEdit={handleEditInstructor}
                onDelete={(id) => setShowDeleteModal(instructors.find(i => i.id === id))}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiUser} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No instructors found' : 'No Instructors Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first instructor to the system'
              }
            </p>
            {!searchTerm && (
              <motion.button
                onClick={() => setShowInstructorModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Add First Instructor</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Available Courses Summary */}
      {instructorCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiBook} className="text-blue-600" />
            <span>All Available Courses ({instructorCourses.length})</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {instructorCourses.map(course => {
              const instructorCount = instructors.filter(inst => 
                inst.availableCourses.includes(course)
              ).length;
              
              return (
                <div key={course} className="bg-gray-50 rounded-lg p-3 border">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{course}</h4>
                  <p className="text-xs text-gray-600">
                    {instructorCount} instructor{instructorCount !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <AddInstructorModal
        isOpen={showInstructorModal}
        onClose={handleCloseModal}
        onSave={handleAddInstructor}
        instructorToEdit={editingInstructor}
      />

      <DeleteInstructorModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        instructor={showDeleteModal}
        onConfirmDelete={handleDeleteInstructor}
      />
    </div>
  );
};

export default Instructors;