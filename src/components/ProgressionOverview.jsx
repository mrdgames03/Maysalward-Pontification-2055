import React from 'react';
import { motion } from 'framer-motion';
import { PROGRESSION_LEVELS, getLevelStatistics } from '../utils/progressionSystem';
import { useTrainee } from '../context/TraineeContext';

const ProgressionOverview = () => {
  const { trainees } = useTrainee();
  const levelStats = getLevelStatistics(trainees);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Progression Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PROGRESSION_LEVELS.map((level, index) => {
          const stats = levelStats[level.id];
          const percentage = trainees.length > 0 ? (stats.count / trainees.length) * 100 : 0;
          
          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-lg border-2"
              style={{
                backgroundColor: level.bgColor,
                borderColor: level.borderColor
              }}
            >
              <div className="text-2xl mb-2">{level.emoji}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: level.textColor }}>
                {level.name}
              </div>
              <div className="text-lg font-bold" style={{ color: level.textColor }}>
                {stats.count}
              </div>
              <div className="text-xs opacity-75" style={{ color: level.textColor }}>
                {percentage.toFixed(1)}%
              </div>
              <div className="text-xs mt-1" style={{ color: level.textColor }}>
                {level.minPoints}+ pts
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top Performers */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="space-y-2">
          {trainees
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map((trainee, index) => {
              const level = PROGRESSION_LEVELS.find(l => 
                trainee.points >= l.minPoints && trainee.points <= l.maxPoints
              );
              
              return (
                <div key={trainee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                      <div className="flex items-center space-x-2">
                        <span>{level?.emoji}</span>
                        <span className="text-sm" style={{ color: level?.color }}>
                          {level?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{trainee.points} pts</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressionOverview;