import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiSearch, FiFilter, FiUser, FiStar, FiFlag, FiEye, FiCalendar, FiMail } = FiIcons;

const TraineeList = () => {
  const { trainees, flagTrainee } = useTrainee();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFlagModal, setShowFlagModal] = useState(null);
  const [flagReason, setFlagReason] = useState('');

  // Filter and sort trainees
  const filteredTrainees = React.useMemo(() => {
    let filtered = trainees.filter(trainee => {
      const matchesSearch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trainee.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trainee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || trainee.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    // Sort trainees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'points':
          return b.points - a.points;
        case 'registration':
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        case 'flags':
          return (b.flags?.length || 0) - (a.flags?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trainees, searchTerm, sortBy, filterStatus]);

  const handleFlag = (traineeId) => {
    if (!flagReason.trim()) return;
    
    flagTrainee(traineeId, flagReason);
    setShowFlagModal(null);
    setFlagReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Trainees</h1>
          <p className="text-gray-600">Manage and view all registered trainees</p>
        </div>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiUser} />
          <span>Add Trainee</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search trainees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SafeIcon 
              icon={FiFilter} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="points">Sort by Points</option>
              <option value="registration">Sort by Registration</option>
              <option value="flags">Sort by Flags</option>
            </select>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Trainees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainees.map((trainee, index) => (
          <motion.div
            key={trainee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-blue-200"
          >
            {/* Trainee Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-blue-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {trainee.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-mono">
                    {trainee.serialNumber}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trainee.status)}`}>
                  {trainee.status || 'active'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <SafeIcon icon={FiStar} className="text-blue-600 text-lg mx-auto mb-1" />
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-bold text-blue-600">{trainee.points}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <SafeIcon icon={FiFlag} className="text-red-600 text-lg mx-auto mb-1" />
                <p className="text-sm text-gray-600">Flags</p>
                <p className="font-bold text-red-600">{trainee.flags?.length || 0}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiMail} className="text-xs" />
                <span className="truncate">{trainee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiCalendar} className="text-xs" />
                <span>Registered {format(new Date(trainee.registrationDate), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                to={`/trainee/${trainee.id}`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <SafeIcon icon={FiEye} className="text-sm" />
                <span>View</span>
              </Link>
              
              <button
                onClick={() => setShowFlagModal(trainee.id)}
                className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <SafeIcon icon={FiFlag} className="text-sm" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrainees.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUser} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trainees found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by registering your first trainee'}
          </p>
          {!searchTerm && (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <SafeIcon icon={FiUser} />
              <span>Register First Trainee</span>
            </Link>
          )}
        </div>
      )}

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
                  onClick={() => handleFlag(showFlagModal)}
                  disabled={!flagReason.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Flag Trainee
                </button>
                <button
                  onClick={() => {
                    setShowFlagModal(null);
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

export default TraineeList;