// Progression System Configuration
export const PROGRESSION_LEVELS = [
  {
    id: 'amateur',
    name: 'Amateur',
    minPoints: 0,
    maxPoints: 99,
    emoji: '🟢',
    color: '#22c55e', // green-500
    bgColor: '#dcfce7', // green-100
    textColor: '#166534', // green-800
    borderColor: '#16a34a', // green-600
    description: 'Just getting started on your learning journey',
    perks: [
      'Access to basic training materials',
      'Welcome bonus points',
      'Basic profile customization'
    ]
  },
  {
    id: 'beginner',
    name: 'Beginner',
    minPoints: 100,
    maxPoints: 249,
    emoji: '🟦',
    color: '#3b82f6', // blue-500
    bgColor: '#dbeafe', // blue-100
    textColor: '#1e3a8a', // blue-900
    borderColor: '#2563eb', // blue-600
    description: 'Building foundational skills and knowledge',
    perks: [
      'Access to intermediate courses',
      'Digital certificate of completion',
      'Priority support access',
      'Basic mentorship program'
    ]
  },
  {
    id: 'novice',
    name: 'Novice',
    minPoints: 250,
    maxPoints: 499,
    emoji: '🟡',
    color: '#eab308', // yellow-500
    bgColor: '#fef3c7', // yellow-100
    textColor: '#92400e', // yellow-800
    borderColor: '#ca8a04', // yellow-600
    description: 'Developing practical skills and confidence',
    perks: [
      'Access to specialized workshops',
      'Novice achievement badge',
      'Course completion certificates',
      'Extended library access',
      'Peer mentoring opportunities'
    ]
  },
  {
    id: 'skilled',
    name: 'Skilled',
    minPoints: 500,
    maxPoints: 799,
    emoji: '🟠',
    color: '#f97316', // orange-500
    bgColor: '#fed7aa', // orange-100
    textColor: '#9a3412', // orange-800
    borderColor: '#ea580c', // orange-600
    description: 'Demonstrating competency and expertise',
    perks: [
      'Access to advanced training modules',
      'Skilled practitioner certificate',
      'Guest speaker opportunities',
      'Access to premium resources',
      'Project collaboration privileges',
      'Small monetary rewards'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    minPoints: 800,
    maxPoints: 1199,
    emoji: '🔵',
    color: '#6366f1', // indigo-500
    bgColor: '#e0e7ff', // indigo-100
    textColor: '#3730a3', // indigo-800
    borderColor: '#4f46e5', // indigo-600
    description: 'Advanced practitioner with deep knowledge',
    perks: [
      'Access to expert-level content',
      'Advanced practitioner certification',
      'Teaching assistant opportunities',
      'Special event invitations',
      'Advanced project access',
      'Quarterly bonus rewards',
      'Professional networking events'
    ]
  },
  {
    id: 'expert',
    name: 'Expert',
    minPoints: 1200,
    maxPoints: 1799,
    emoji: '🟣',
    color: '#8b5cf6', // violet-500
    bgColor: '#ede9fe', // violet-100
    textColor: '#5b21b6', // violet-800
    borderColor: '#7c3aed', // violet-600
    description: 'Expert level with exceptional knowledge and skills',
    perks: [
      'Exclusive expert-only sessions',
      'Expert certification and digital badge',
      'Mentorship program participation',
      'Conference speaking opportunities',
      'Beta access to new features',
      'Significant monetary rewards',
      'Professional development budget',
      'Industry networking access'
    ]
  },
  {
    id: 'elite',
    name: 'Elite',
    minPoints: 1800,
    maxPoints: 2499,
    emoji: '🏅',
    color: '#d97706', // amber-600
    bgColor: '#fef3c7', // amber-100
    textColor: '#92400e', // amber-800
    borderColor: '#f59e0b', // amber-500
    description: 'Elite performer with outstanding achievements',
    perks: [
      'Elite status recognition',
      'Exclusive elite community access',
      'Premium certification with honors',
      'Guest lecturer opportunities',
      'Research project participation',
      'Substantial financial rewards',
      'Professional conference sponsorship',
      'Career advancement support',
      'VIP event access'
    ]
  },
  {
    id: 'master',
    name: 'Master',
    minPoints: 2500,
    maxPoints: Infinity,
    emoji: '👑',
    color: '#dc2626', // red-600
    bgColor: '#fee2e2', // red-100
    textColor: '#991b1b', // red-800
    borderColor: '#ef4444', // red-500
    description: 'Master level - the pinnacle of achievement',
    perks: [
      'Master status with special recognition',
      'Master certification with highest honors',
      'Program advisory board invitation',
      'Curriculum development participation',
      'Maximum financial rewards',
      'Industry partnership opportunities',
      'Lifetime achievement recognition',
      'Executive mentorship access',
      'Special master privileges',
      'Legacy program participation'
    ]
  }
];

// Get current level based on points
export const getCurrentLevel = (points) => {
  return PROGRESSION_LEVELS.find(level => 
    points >= level.minPoints && points <= level.maxPoints
  ) || PROGRESSION_LEVELS[0];
};

// Get next level
export const getNextLevel = (points) => {
  const currentLevel = getCurrentLevel(points);
  const currentIndex = PROGRESSION_LEVELS.findIndex(level => level.id === currentLevel.id);
  
  if (currentIndex < PROGRESSION_LEVELS.length - 1) {
    return PROGRESSION_LEVELS[currentIndex + 1];
  }
  
  return null; // Already at max level
};

// Calculate progress to next level
export const getProgressToNextLevel = (points) => {
  const currentLevel = getCurrentLevel(points);
  const nextLevel = getNextLevel(points);
  
  if (!nextLevel) {
    return {
      current: points,
      required: currentLevel.minPoints,
      progress: 100,
      pointsToNext: 0
    };
  }
  
  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsRequiredForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progress = Math.min((pointsInCurrentLevel / pointsRequiredForNextLevel) * 100, 100);
  const pointsToNext = nextLevel.minPoints - points;
  
  return {
    current: points,
    required: nextLevel.minPoints,
    progress: Math.round(progress),
    pointsToNext: Math.max(pointsToNext, 0)
  };
};

// Get achievements for a trainee
export const getTraineeAchievements = (trainee) => {
  const currentLevel = getCurrentLevel(trainee.points);
  const achievements = [];
  
  // Level achievements
  PROGRESSION_LEVELS.forEach(level => {
    if (trainee.points >= level.minPoints) {
      achievements.push({
        id: `level-${level.id}`,
        type: 'level',
        title: `${level.name} Level Achieved`,
        description: level.description,
        emoji: level.emoji,
        achievedAt: trainee.registrationDate, // In real app, track when each level was achieved
        level: level
      });
    }
  });
  
  // Point milestones
  const pointMilestones = [50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];
  pointMilestones.forEach(milestone => {
    if (trainee.points >= milestone) {
      achievements.push({
        id: `points-${milestone}`,
        type: 'milestone',
        title: `${milestone} Points Milestone`,
        description: `Earned ${milestone} total points`,
        emoji: '⭐',
        achievedAt: trainee.registrationDate
      });
    }
  });
  
  return achievements.sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt));
};

// Check if trainee just leveled up
export const checkForLevelUp = (oldPoints, newPoints) => {
  const oldLevel = getCurrentLevel(oldPoints);
  const newLevel = getCurrentLevel(newPoints);
  
  if (oldLevel.id !== newLevel.id) {
    return {
      leveledUp: true,
      oldLevel,
      newLevel,
      pointsGained: newPoints - oldPoints
    };
  }
  
  return {
    leveledUp: false,
    oldLevel,
    newLevel: oldLevel,
    pointsGained: newPoints - oldPoints
  };
};

// Get level statistics
export const getLevelStatistics = (trainees) => {
  const stats = {};
  
  PROGRESSION_LEVELS.forEach(level => {
    stats[level.id] = {
      level,
      count: 0,
      trainees: []
    };
  });
  
  trainees.forEach(trainee => {
    const level = getCurrentLevel(trainee.points);
    stats[level.id].count++;
    stats[level.id].trainees.push(trainee);
  });
  
  return stats;
};