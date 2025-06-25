import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import TraineeCard from '../components/TraineeCard';
import AddTrainingModal from '../components/AddTrainingModal';
import AddCourseModal from '../components/AddCourseModal';
import TrainingSessionCard from '../components/TrainingSessionCard';
import CourseCard from '../components/CourseCard';

const { FiArrowLeft, FiFlag, FiStar, FiActivity, FiCalendar, FiUser, FiMail, FiPhone, FiBook, FiPlus, FiAward } = FiIcons;

const TraineeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getTraineeById,
    getTraineeCheckIns,
    flagTrainee,
    addTrainingSession,
    getTraineeTrainingSessions,
    markSessionComplete,
    updateTrainingSession,
    deleteTrainingSession,
    addCourse,
    getTraineeCourses,
    markCourseComplete,
    updateCourse,
    deleteCourse
  } = useTrainee();

  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const trainee = getTraineeById(id);
  const checkIns = getTraineeCheckIns(id);
  const trainingSessions = getTraineeTrainingSessions(id);
  const courses = getTraineeCourses(id);

  if (!trainee) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUser} className="text-6xl text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trainee Not Found</h2>
        <p className="text-gray-600 mb-6">The trainee you're looking for doesn't exist.</p>
        <Link
          to="/trainees"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
        >
          <SafeIcon icon={FiArrowLeft} />
          <span>Back to Trainees</span>
        </Link>
      </div>
    );
  }

  const handleFlag = () => {
    if (!flagReason.trim()) return;
    flagTrainee(id, flagReason);
    setShowFlagModal(false);
    setFlagReason('');
  };

  const handleAddTraining = (trainingData) => {
    addTrainingSession(trainingData);
  };

  const handleAddCourse = (courseData) => {
    addCourse(courseData);
  };

  const handleCompleteSession = (sessionId) => {
    markSessionComplete(sessionId);
  };

  const handleCompleteCourse = (courseId) => {
    markCourseComplete(courseId);
  };

  const handleEditSession = (session) => {
    console.log('Edit session:', session);
  };

  const handleEditCourse = (course) => {
    console.log('Edit course:', course);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this training session?')) {
      deleteTrainingSession(sessionId);
    }
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to remove this course enrollment?')) {
      deleteCourse(courseId);
    }
  };

  const completedSessions = trainingSessions.filter(s => s.status === 'completed').length;
  const upcomingSessions = trainingSessions.filter(s => {
    const sessionDate = new Date(`${s.date}T${s.startTime}`);
    return sessionDate > new Date() && s.status !== 'completed';
  }).length;

  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const activeCourses = courses.filter(c => c.status === 'enrolled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/trainees')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trainee Details</h1>
            <p className="text-gray-600">View and manage trainee information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCourseModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiAward} />
            <span>Add Course</span>
          </button>
          <button
            onClick={() => setShowTrainingModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Training</span>
          </button>
          <button
            onClick={() => setShowFlagModal(true)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiFlag} />
            <span>Flag Trainee</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FiUser },
              { id: 'courses', label: 'Courses', icon: FiAward },
              { id: 'trainings', label: 'Training Sessions', icon: FiBook },
              { id: 'activity', label: 'Activity', icon: FiActivity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.label}</span>
                {tab.id === 'courses' && courses.length > 0 && (
                  <span className="bg-green-100 text-green-600 rounded-full px-2 py-1 text-xs">
                    {courses.length}
                  </span>
                )}
                {tab.id === 'trainings' && trainingSessions.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs">
                    {trainingSessions.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <TraineeCard trainee={trainee} showActions={true} />
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiStar} className="text-blue-600" />
                        <span className="font-medium text-gray-900">Total Points</span>
                      </div>
                      <span className="font-bold text-blue-600">{trainee.points}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiAward} className="text-green-600" />
                        <span className="font-medium text-gray-900">Courses</span>
                      </div>
                      <span className="font-bold text-green-600">{completedCourses}/{courses.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiBook} className="text-purple-600" />
                        <span className="font-medium text-gray-900">Trainings</span>
                      </div>
                      <span className="font-bold text-purple-600">{completedSessions}/{trainingSessions.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiActivity} className="text-yellow-600" />
                        <span className="font-medium text-gray-900">Check-ins</span>
                      </div>
                      <span className="font-bold text-yellow-600">{checkIns.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiFlag} className="text-red-600" />
                        <span className="font-medium text-gray-900">Flags</span>
                      </div>
                      <span className="font-bold text-red-600">{trainee.flags?.length || 0}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMail} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a
                          href={`mailto:${trainee.email}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {trainee.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiPhone} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <a
                          href={`tel:${trainee.phone}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {trainee.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiBook} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Education</p>
                        <p className="text-gray-900">{trainee.education}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiAward} className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold text-green-600">{courses.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiBook} className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-blue-600">{activeCourses}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiStar} className="text-purple-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-purple-600">{completedCourses}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses List */}
              <div className="space-y-4">
                {courses.length > 0 ? (
                  courses
                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                    .map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onComplete={handleCompleteCourse}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                      />
                    ))
                ) : (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiAward} className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                    <p className="text-gray-600 mb-6">
                      This trainee hasn't been enrolled in any courses yet.
                    </p>
                    <button
                      onClick={() => setShowCourseModal(true)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiAward} />
                      <span>Enroll in First Course</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Training Sessions Tab */}
          {activeTab === 'trainings' && (
            <div className="space-y-6">
              {/* Training Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiBook} className="text-blue-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-blue-600">{trainingSessions.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiActivity} className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{completedSessions}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiCalendar} className="text-yellow-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-2xl font-bold text-yellow-600">{upcomingSessions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Sessions List */}
              <div className="space-y-4">
                {trainingSessions.length > 0 ? (
                  trainingSessions
                    .sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`))
                    .map((session) => (
                      <TrainingSessionCard
                        key={session.id}
                        session={session}
                        onComplete={handleCompleteSession}
                        onEdit={handleEditSession}
                        onDelete={handleDeleteSession}
                      />
                    ))
                ) : (
                  <div className="text-center py-12">
                    <SafeIcon icon={FiBook} className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Training Sessions</h3>
                    <p className="text-gray-600 mb-6">
                      No training sessions have been scheduled for this trainee yet.
                    </p>
                    <button
                      onClick={() => setShowTrainingModal(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiPlus} />
                      <span>Schedule First Training</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {checkIns.length > 0 ? (
                checkIns
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((checkIn) => (
                    <div
                      key={checkIn.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiActivity} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Check-in</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(checkIn.timestamp), 'PPp')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">+{checkIn.points} pts</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <SafeIcon icon={FiActivity} className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>No check-ins yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSave={handleAddCourse}
        trainee={trainee}
      />

      {/* Add Training Modal */}
      <AddTrainingModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        onSave={handleAddTraining}
        trainee={trainee}
      />

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flag Trainee</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for flagging
                </label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows="3"
                  placeholder="Enter reason for flagging this trainee..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleFlag}
                  disabled={!flagReason.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Flag Trainee (-5 pts)
                </button>
                <button
                  onClick={() => {
                    setShowFlagModal(false);
                    setFlagReason('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TraineeDetails;