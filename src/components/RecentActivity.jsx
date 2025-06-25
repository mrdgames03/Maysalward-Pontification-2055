import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTrainee } from '../context/TraineeContext';

const { FiActivity, FiUserCheck, FiFlag, FiClock } = FiIcons;

const RecentActivity = () => {
  const { checkIns, trainees } = useTrainee();
  
  // Get recent activities (check-ins and flags)
  const recentActivities = React.useMemo(() => {
    const activities = [];
    
    // Add recent check-ins
    checkIns.slice(-10).forEach(checkIn => {
      const trainee = trainees.find(t => t.id === checkIn.traineeId);
      if (trainee) {
        activities.push({
          id: `checkin-${checkIn.id}`,
          type: 'checkin',
          trainee,
          timestamp: checkIn.timestamp,
          points: checkIn.points
        });
      }
    });
    
    // Add recent flags
    trainees.forEach(trainee => {
      if (trainee.flags && trainee.flags.length > 0) {
        trainee.flags.slice(-3).forEach(flag => {
          activities.push({
            id: `flag-${flag.id}`,
            type: 'flag',
            trainee,
            timestamp: flag.timestamp,
            reason: flag.reason,
            pointsDeducted: flag.pointsDeducted
          });
        });
      }
    });
    
    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 8);
  }, [checkIns, trainees]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiActivity} className="text-xl text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <Link 
          to="/trainees" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'checkin' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <SafeIcon 
                  icon={activity.type === 'checkin' ? FiUserCheck : FiFlag} 
                  className="text-lg" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.trainee.name}
                </p>
                <p className="text-xs text-gray-600">
                  {activity.type === 'checkin' 
                    ? `Checked in (+${activity.points} pts)`
                    : `Flagged: ${activity.reason} (-${activity.pointsDeducted} pts)`
                  }
                </p>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <SafeIcon icon={FiClock} />
                <span>{format(new Date(activity.timestamp), 'HH:mm')}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <SafeIcon icon={FiActivity} className="text-4xl mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentActivity;