import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';
import { useAuth } from '../context/AuthContext';
import TraineeCard from '../components/TraineeCard';
import ProgressionProgress from '../components/ProgressionProgress';
import { getCurrentLevel } from '../utils/progressionSystem';

const { FiUser, FiStar, FiBook, FiGift, FiActivity, FiCalendar, FiAward, FiDownload, FiMail, FiShare2, FiCreditCard, FiShoppingBag } = FiIcons;

const TraineeProfile = () => {
  const { currentUser } = useAuth();
  const { trainees, getTraineeCheckIns, getTraineeCourses, getTraineeTrainingSessions, gifts, getAvailableGiftsForTrainee, getTraineeRedemptions } = useTrainee();

  // Find trainee by username (assuming username matches some trainee identifier)
  const trainee = trainees.find(t => 
    t.email?.toLowerCase() === currentUser?.username?.toLowerCase() ||
    t.serialNumber?.toLowerCase() === currentUser?.username?.toLowerCase()
  );

  if (!trainee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiUser} className="text-yellow-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find a trainee profile associated with your account.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Logged in as: {currentUser?.username}</p>
            <p className="text-xs text-gray-500 mt-1">
              Please contact your administrator to link your account with a trainee profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const checkIns = getTraineeCheckIns(trainee.id);
  const courses = getTraineeCourses(trainee.id);
  const trainingSessions = getTraineeTrainingSessions(trainee.id);
  const availableGifts = getAvailableGiftsForTrainee(trainee.id);
  const redemptions = getTraineeRedemptions(trainee.id);
  const currentLevel = getCurrentLevel(trainee.points);

  const completedCourses = courses.filter(c => c.status === 'completed').length;
  const completedSessions = trainingSessions.filter(s => s.status === 'completed').length;

  const stats = [
    { icon: FiStar, label: 'Total Points', value: trainee.points, color: 'blue' },
    { icon: FiBook, label: 'Completed Courses', value: `${completedCourses}/${courses.length}`, color: 'green' },
    { icon: FiActivity, label: 'Training Sessions', value: `${completedSessions}/${trainingSessions.length}`, color: 'purple' },
    { icon: FiGift, label: 'Available Gifts', value: availableGifts.length, color: 'yellow' },
    { icon: FiCalendar, label: 'Check-ins', value: checkIns.length, color: 'indigo' },
    { icon: FiAward, label: 'Redemptions', value: redemptions.length, color: 'pink' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      pink: 'bg-pink-50 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Track your progress and achievements</p>
        
        {/* Quick Actions for Trainee */}
        <div className="flex justify-center space-x-4 mt-4">
          <Link 
            to="/gifts/redeem"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <SafeIcon icon={FiShoppingBag} />
            <span>Redeem Gifts ({availableGifts.length} available)</span>
          </Link>
        </div>
      </div>

      {/* Points Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {trainee.name}!</h2>
            <p className="text-blue-100 mb-4">Here's your current progress</p>
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-blue-100 text-sm">Current Points</p>
                <p className="text-4xl font-bold">{trainee.points}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Current Level</p>
                <p className="text-xl font-semibold">{currentLevel.emoji} {currentLevel.name}</p>
              </div>
            </div>
          </div>
          {trainee.photo && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30">
              <img src={trainee.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Membership Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCreditCard} className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">My Membership Card</h2>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <TraineeCard trainee={trainee} showActions={true} />
        </div>
      </motion.div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Overview</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                style={{
                  backgroundColor: currentLevel.bgColor,
                  borderColor: currentLevel.borderColor,
                  color: currentLevel.textColor
                }}
              >
                <span className="text-lg">{currentLevel.emoji}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentLevel.name}</h3>
                <p className="text-gray-600">{currentLevel.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{trainee.points}</p>
              <p className="text-sm text-gray-600">points</p>
            </div>
          </div>
          <ProgressionProgress points={trainee.points} showDetails={true} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${getColorClasses(stat.color)}`}>
              <SafeIcon icon={stat.icon} className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Available Gifts Preview */}
      {availableGifts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Rewards</h2>
            <Link 
              to="/gifts/redeem"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableGifts.slice(0, 3).map((gift) => (
              <div key={gift.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiGift} className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{gift.title}</h3>
                    <p className="text-sm text-gray-600">{gift.pointsRequired} points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/gifts/redeem"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <SafeIcon icon={FiShoppingBag} />
              <span>Browse All Rewards</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Level Perks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Level Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLevel.perks.map((perk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <SafeIcon icon={FiAward} className="text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{perk}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {checkIns.slice(-5).reverse().map((checkIn) => (
            <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiActivity} className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check-in</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(checkIn.timestamp), 'PPp')}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-green-600">+{checkIn.points} pts</span>
            </div>
          ))}
          {checkIns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiActivity} className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No activity yet</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TraineeProfile;