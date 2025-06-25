import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import AddTrainingCourseModal from '../components/AddTrainingCourseModal';
import TrainingCourseCard from '../components/TrainingCourseCard';
import AddAttendeesModal from '../components/AddAttendeesModal';
import ViewAttendeesModal from '../components/ViewAttendeesModal';

const { FiBook, FiPlus, FiSearch, FiFilter, FiCalendar, FiUsers } = FiIcons;

const TrainingCourses = () => {
  const {
    trainingCourses,
    addTrainingCourse,
    updateTrainingCourse,
    deleteTrainingCourse,
    addAttendeesToCourse,
    removeAttendeeFromCourse,
    markCourseAttendeeComplete,
    updateTrainee
  } = useTrainee();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [showViewAttendeesModal, setShowViewAttendeesModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = [
    'General', 'Programming', 'Web Development', 'Mobile Development',
    'Design', 'UI/UX', 'Marketing', 'Digital Marketing', 'Management',
    'Leadership', 'Technical Skills', 'Soft Skills', 'Communication',
    'Language', 'Certification', 'Security', 'Data Science', 'AI/ML'
  ];

  // Filter courses
  const filteredCourses = trainingCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    
    const now = new Date();
    const startDate = new Date(`${course.startDate}T${course.startTime}`);
    const endDate = new Date(`${course.endDate}T${course.endTime}`);
    
    let matchesStatus = true;
    if (filterStatus === 'upcoming') {
      matchesStatus = startDate > now;
    } else if (filterStatus === 'ongoing') {
      matchesStatus = startDate <= now && endDate >= now;
    } else if (filterStatus === 'completed') {
      matchesStatus = course.status === 'completed';
    } else if (filterStatus === 'past') {
      matchesStatus = endDate < now && course.status !== 'completed';
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddCourse = (courseData) => {
    addTrainingCourse(courseData);
  };

  const handleEditCourse = (course) => {
    console.log('Edit course:', course);
    // TODO: Implement edit functionality
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this training course?')) {
      deleteTrainingCourse(courseId);
    }
  };

  const handleAddAttendees = (course) => {
    setSelectedCourse(course);
    setShowAttendeesModal(true);
  };

  const handleViewAttendees = (course) => {
    setSelectedCourse(course);
    setShowViewAttendeesModal(true);
  };

  const handleAddAttendeesToCourse = (courseId, attendees) => {
    addAttendeesToCourse(courseId, attendees);
  };

  const handleRemoveAttendee = (courseId, attendeeId) => {
    if (window.confirm('Are you sure you want to remove this attendee from the course?')) {
      removeAttendeeFromCourse(courseId, attendeeId);
    }
  };

  const handleMarkAttendeeComplete = (courseId, attendeeId) => {
    const course = trainingCourses.find(c => c.id === courseId);
    if (course) {
      markCourseAttendeeComplete(courseId, attendeeId);
      // Award points to the trainee
      updateTrainee(attendeeId, { points: course.points || 10 });
    }
  };

  const stats = {
    total: trainingCourses.length,
    upcoming: trainingCourses.filter(c => {
      const start = new Date(`${c.startDate}T${c.startTime}`);
      return start > new Date();
    }).length,
    ongoing: trainingCourses.filter(c => {
      const now = new Date();
      const start = new Date(`${c.startDate}T${c.startTime}`);
      const end = new Date(`${c.endDate}T${c.endTime}`);
      return start <= now && end >= now;
    }).length,
    completed: trainingCourses.filter(c => c.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Courses</h1>
          <p className="text-gray-600">Create and manage group training courses</p>
        </div>
        <motion.button
          onClick={() => setShowCourseModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create Course</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBook} className="text-blue-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCalendar} className="text-yellow-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.upcoming}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiUsers} className="text-green-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Ongoing</p>
              <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBook} className="text-purple-600 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TrainingCourseCard
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onViewAttendees={handleViewAttendees}
                onAddAttendees={handleAddAttendees}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <SafeIcon icon={FiBook} className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Training Courses</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'No courses match your current filters'
                : 'Get started by creating your first training course'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <motion.button
                onClick={() => setShowCourseModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} />
                <span>Create First Course</span>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTrainingCourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSave={handleAddCourse}
      />

      <AddAttendeesModal
        isOpen={showAttendeesModal}
        onClose={() => {
          setShowAttendeesModal(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onAddAttendees={handleAddAttendeesToCourse}
      />

      <ViewAttendeesModal
        isOpen={showViewAttendeesModal}
        onClose={() => {
          setShowViewAttendeesModal(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onRemoveAttendee={handleRemoveAttendee}
        onMarkComplete={handleMarkAttendeeComplete}
      />
    </div>
  );
};

export default TrainingCourses;