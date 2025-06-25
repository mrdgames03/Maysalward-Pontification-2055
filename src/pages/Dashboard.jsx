import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import EducationManagementModal from '../components/EducationManagementModal';

const { FiUsers, FiUserCheck, FiScan, FiFlag, FiTrendingUp, FiActivity, FiBook, FiAward, FiSettings } = FiIcons;

const Dashboard = () => {
  const { getTraineeStats, checkIns, trainees, trainingSessions, courses } = useTrainee();
  const [showEducationModal, setShowEducationModal] = useState(false);
  
  const stats = getTraineeStats();

  const quickActions = [
    {
      title: 'Register Trainee',
      description: 'Add a new trainee to the system',
      icon: FiUsers,
      color: 'blue',
      path: '/register'
    },
    {
      title: 'Scan QR Code',
      description: 'Check-in trainees with QR scanner',
      icon: FiScan,
      color: 'green',
      path: '/scanner'
    },
    {
      title: 'View All Trainees',
      description: 'Manage and view trainee records',
      icon: FiUserCheck,
      color: 'purple',
      path: '/trainees'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Maysalward Training Hub
          </h1>
          <p className="text-xl text-gray-600">
            Manage your trainees efficiently with our comprehensive system
          </p>
        </div>
        
        {/* Admin Settings */}
        <div className="ml-4">
          <motion.button
            onClick={() => setShowEducationModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            title="Manage Education Options"
          >
            <SafeIcon icon={FiSettings} className="text-lg" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard
          title="Total Trainees"
          value={stats.totalTrainees}
          icon={FiUsers}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Trainees"
          value={stats.activeTrainees}
          icon={FiUserCheck}
          color="green"
          trend="+8%"
        />
        <StatCard
          title="Total Check-ins"
          value={stats.totalCheckIns}
          icon={FiActivity}
          color="purple"
          trend="+24%"
        />
        <StatCard
          title="Training Sessions"
          value={stats.totalTrainingSessions}
          icon={FiBook}
          color="yellow"
          trend={`+${stats.completedSessions}`}
        />
        <StatCard
          title="Courses"
          value={stats.totalCourses}
          icon={FiAward}
          color="green"
          trend={`+${stats.completedCourses} completed`}
        />
        <StatCard
          title="Total Flags"
          value={stats.totalFlags}
          icon={FiFlag}
          color="red"
          trend="-5%"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.path}>
              <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-${action.color}-500 group hover:-translate-y-1`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <SafeIcon icon={action.icon} className={`text-xl text-${action.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiTrendingUp} className="text-xl text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
          </div>

          <div className="space-y-4">
            {trainees
              .sort((a, b) => b.points - a.points)
              .slice(0, 5)
              .map((trainee, index) => (
                <div
                  key={trainee.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trainee.name}</p>
                      <p className="text-sm text-gray-600">{trainee.serialNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{trainee.points} pts</p>
                  </div>
                </div>
              ))}

            {trainees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiUsers} className="text-4xl mx-auto mb-2 opacity-50" />
                <p>No trainees registered yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Education Management Modal */}
      <EducationManagementModal
        isOpen={showEducationModal}
        onClose={() => setShowEducationModal(false)}
      />
    </div>
  );
};

export default Dashboard;