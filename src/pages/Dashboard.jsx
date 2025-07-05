import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';
import ProgressionOverview from '../components/ProgressionOverview';
import EducationManagementModal from '../components/EducationManagementModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import LevelUpModal from '../components/LevelUpModal';

const { FiUsers, FiUserCheck, FiScan, FiFlag, FiTrendingUp, FiActivity, FiBook, FiAward, FiSettings, FiUser, FiShield, FiGift, FiEye, FiStar } = FiIcons;

const Dashboard = () => {
  const { getTraineeStats, checkIns, trainees, trainingSessions, courses, levelUpNotifications, markLevelUpNotificationSeen } = useTrainee();
  const { getCurrentPassword, hasPermission, currentUser } = useAuth();
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [currentLevelUp, setCurrentLevelUp] = useState(null);

  const stats = getTraineeStats();

  // Check for unseen level up notifications
  React.useEffect(() => {
    const unseenNotifications = levelUpNotifications.filter(n => !n.seen);
    if (unseenNotifications.length > 0) {
      setCurrentLevelUp(unseenNotifications[0]);
      setShowLevelUpModal(true);
    }
  }, [levelUpNotifications]);

  const handleLevelUpClose = () => {
    if (currentLevelUp) {
      markLevelUpNotificationSeen(currentLevelUp.id);
    }
    setShowLevelUpModal(false);
    setCurrentLevelUp(null);
  };

  // Quick actions based on user permissions
  const quickActions = [
    {
      title: 'Register Trainee',
      description: 'Add a new trainee to the system',
      icon: FiUsers,
      color: 'blue',
      path: '/register',
      permission: 'add_trainees'
    },
    {
      title: 'Scan QR Code',
      description: 'Check-in trainees with QR scanner',
      icon: FiScan,
      color: 'green',
      path: '/scanner',
      permission: ['view_all', 'view_trainees']
    },
    {
      title: 'View All Trainees',
      description: 'Manage and view trainee records',
      icon: FiUserCheck,
      color: 'purple',
      path: '/trainees',
      permission: ['view_all', 'view_trainees']
    },
    {
      title: 'Manage Gifts',
      description: 'Create and manage gifts & rewards',
      icon: FiGift,
      color: 'yellow',
      path: '/gifts',
      permission: 'add_gifts'
    },
    {
      title: 'My Profile',
      description: 'View your progress and achievements',
      icon: FiEye,
      color: 'indigo',
      path: '/profile',
      permission: 'view_own_profile'
    },
    {
      title: 'Redeem Gifts',
      description: 'Use points to redeem rewards',
      icon: FiStar,
      color: 'pink',
      path: '/gifts/redeem',
      permission: 'redeem_gifts'
    }
  ];

  // Filter quick actions based on permissions
  const visibleQuickActions = quickActions.filter(action => 
    Array.isArray(action.permission) 
      ? action.permission.some(p => hasPermission(p))
      : hasPermission(action.permission)
  );

  const getRoleGreeting = () => {
    switch (currentUser?.role) {
      case 'super_admin':
        return 'Super Administrator Dashboard';
      case 'admin':
        return 'Administrator Dashboard';
      case 'trainee':
        return 'Welcome to Your Learning Journey';
      default:
        return 'Training Hub Dashboard';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Maysalward Training Hub
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {getRoleGreeting()}
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
            <SafeIcon icon={FiShield} className="text-blue-600" />
            <span className="text-blue-800 font-medium">
              Logged in as: {currentUser?.name} (@{currentUser?.username})
            </span>
          </div>
        </div>

        {/* Admin Settings */}
        {hasPermission('system_settings') && (
          <div className="ml-4 flex space-x-2">
            {/* Password Status & Change */}
            <motion.button
              onClick={() => setShowPasswordModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
              title="Change Password"
            >
              <SafeIcon icon={FiShield} className="text-lg" />
              <div className="text-left">
                <p className="text-xs font-medium">Password</p>
                <p className="text-xs">{getCurrentPassword()}</p>
              </div>
            </motion.button>

            {/* Education Options */}
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
        )}
      </motion.div>

      {/* Stats Grid - Only for Super Admin and Admin */}
      {hasPermission('view_analytics') && (
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
            title="Instructors"
            value={stats.totalInstructors}
            icon={FiUser}
            color="indigo"
            trend="+3"
          />
          <StatCard
            title="Active Gifts"
            value={stats.activeGifts}
            icon={FiGift}
            color="red"
            trend={`${stats.totalRedemptions} redeemed`}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleQuickActions.map((action, index) => (
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

      {/* Recent Activity and Progression Overview - Only for Super Admin and Admin */}
      {hasPermission('view_analytics') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <ProgressionOverview />
        </div>
      )}

      {/* Modals */}
      {hasPermission('system_settings') && (
        <>
          <EducationManagementModal
            isOpen={showEducationModal}
            onClose={() => setShowEducationModal(false)}
          />
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        </>
      )}
      
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={handleLevelUpClose}
        levelUpData={currentLevelUp?.levelUpData}
      />
    </div>
  );
};

export default Dashboard;