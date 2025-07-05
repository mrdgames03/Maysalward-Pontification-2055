import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkForLevelUp } from '../utils/progressionSystem';

const TraineeContext = createContext();

export const useTrainee = () => {
  const context = useContext(TraineeContext);
  if (!context) {
    throw new Error('useTrainee must be used within a TraineeProvider');
  }
  return context;
};

export const TraineeProvider = ({ children }) => {
  const [trainees, setTrainees] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [giftRedemptions, setGiftRedemptions] = useState([]);
  const [levelUpNotifications, setLevelUpNotifications] = useState([]);
  const [educationOptions, setEducationOptions] = useState([
    'School Student', 'University Student', 'Graduate', 'Startup'
  ]);

  // Course Categories
  const [courseCategories, setCourseCategories] = useState([
    'General', 'Programming', 'Web Development', 'Mobile Development', 'Design',
    'UI/UX', 'Marketing', 'Digital Marketing', 'Management', 'Leadership',
    'Technical Skills', 'Soft Skills', 'Communication', 'Language',
    'Certification', 'Security', 'Data Science', 'AI/ML'
  ]);

  // Locations
  const [locations, setLocations] = useState([
    'Amman', 'Irbid', 'Zarqa', 'Karak', 'Aqaba', 'Ma\'an'
  ]);

  // Instructor Courses (predefined + custom)
  const [instructorCourses, setInstructorCourses] = useState([
    'Unity', 'Blender', 'Maya', 'Photoshop', 'Illustrator', 'After Effects',
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#',
    'JavaScript', 'TypeScript'
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTrainees = localStorage.getItem('trainees');
    const savedCheckIns = localStorage.getItem('checkIns');
    const savedTrainingSessions = localStorage.getItem('trainingSessions');
    const savedCourses = localStorage.getItem('courses');
    const savedTrainingCourses = localStorage.getItem('trainingCourses');
    const savedInstructors = localStorage.getItem('instructors');
    const savedGifts = localStorage.getItem('gifts');
    const savedGiftRedemptions = localStorage.getItem('giftRedemptions');
    const savedEducationOptions = localStorage.getItem('educationOptions');
    const savedCourseCategories = localStorage.getItem('courseCategories');
    const savedLocations = localStorage.getItem('locations');
    const savedInstructorCourses = localStorage.getItem('instructorCourses');

    if (savedTrainees) {
      setTrainees(JSON.parse(savedTrainees));
    }
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
    if (savedTrainingSessions) {
      setTrainingSessions(JSON.parse(savedTrainingSessions));
    }
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
    if (savedTrainingCourses) {
      setTrainingCourses(JSON.parse(savedTrainingCourses));
    }
    if (savedInstructors) {
      setInstructors(JSON.parse(savedInstructors));
    }
    if (savedGifts) {
      setGifts(JSON.parse(savedGifts));
    }
    if (savedGiftRedemptions) {
      setGiftRedemptions(JSON.parse(savedGiftRedemptions));
    }
    if (savedEducationOptions) {
      setEducationOptions(JSON.parse(savedEducationOptions));
    }
    if (savedCourseCategories) {
      setCourseCategories(JSON.parse(savedCourseCategories));
    }
    if (savedLocations) {
      setLocations(JSON.parse(savedLocations));
    }
    if (savedInstructorCourses) {
      setInstructorCourses(JSON.parse(savedInstructorCourses));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('trainees', JSON.stringify(trainees));
  }, [trainees]);

  useEffect(() => {
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('trainingSessions', JSON.stringify(trainingSessions));
  }, [trainingSessions]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('trainingCourses', JSON.stringify(trainingCourses));
  }, [trainingCourses]);

  useEffect(() => {
    localStorage.setItem('instructors', JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    localStorage.setItem('gifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('giftRedemptions', JSON.stringify(giftRedemptions));
  }, [giftRedemptions]);

  useEffect(() => {
    localStorage.setItem('educationOptions', JSON.stringify(educationOptions));
  }, [educationOptions]);

  useEffect(() => {
    localStorage.setItem('courseCategories', JSON.stringify(courseCategories));
  }, [courseCategories]);

  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('instructorCourses', JSON.stringify(instructorCourses));
  }, [instructorCourses]);

  const generateSerialNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `TR-${timestamp}-${random}`.toUpperCase();
  };

  const addTrainee = (traineeData) => {
    const newTrainee = {
      id: Date.now().toString(),
      serialNumber: generateSerialNumber(),
      ...traineeData,
      registrationDate: new Date().toISOString(),
      points: traineeData.points || 0,
      flags: [],
      status: 'active'
    };

    setTrainees(prev => [...prev, newTrainee]);

    // Auto-create user account for the trainee
    if (window.authContext) {
      window.authContext.createTraineeUser(newTrainee);
    }

    return newTrainee;
  };

  const updateTrainee = (id, updates) => {
    setTrainees(prev => prev.map(trainee => {
      if (trainee.id === id) {
        const oldPoints = trainee.points;
        const newPoints = updates.points !== undefined ? updates.points : oldPoints;
        const updatedTrainee = { ...trainee, ...updates };

        // Check for level up
        if (newPoints > oldPoints) {
          const levelUpResult = checkForLevelUp(oldPoints, newPoints);
          if (levelUpResult.leveledUp) {
            // Add level up notification
            setLevelUpNotifications(prev => [...prev, {
              id: Date.now().toString(),
              traineeId: id,
              traineeName: trainee.name,
              levelUpData: levelUpResult,
              timestamp: new Date().toISOString(),
              seen: false
            }]);
          }
        }

        // Update user account if email or name changed
        if (window.authContext && (updates.email || updates.name)) {
          window.authContext.updateTraineeUser(updatedTrainee);
        }

        return updatedTrainee;
      }
      return trainee;
    }));
  };

  // Enhanced Delete trainee function with comprehensive cleanup
  const deleteTrainee = (traineeId) => {
    // Remove trainee from main list
    setTrainees(prev => prev.filter(trainee => trainee.id !== traineeId));

    // Remove all related data
    setCheckIns(prev => prev.filter(checkIn => checkIn.traineeId !== traineeId));
    setTrainingSessions(prev => prev.filter(session => session.traineeId !== traineeId));
    setCourses(prev => prev.filter(course => course.traineeId !== traineeId));

    // Remove from training course attendees
    setTrainingCourses(prev => prev.map(course => ({
      ...course,
      attendees: course.attendees ? course.attendees.filter(attendee => attendee.id !== traineeId) : []
    })));

    // Remove gift redemptions
    setGiftRedemptions(prev => prev.filter(redemption => redemption.traineeId !== traineeId));

    // Remove level up notifications
    setLevelUpNotifications(prev => prev.filter(notification => notification.traineeId !== traineeId));

    // Delete user account
    if (window.authContext) {
      window.authContext.deleteTraineeUser(traineeId);
    }
  };

  // Bulk delete function
  const bulkDeleteTrainees = (traineeIds) => {
    traineeIds.forEach(id => deleteTrainee(id));
  };

  // Level up notification management
  const markLevelUpNotificationSeen = (notificationId) => {
    setLevelUpNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, seen: true } : notification
    ));
  };

  const clearSeenLevelUpNotifications = () => {
    setLevelUpNotifications(prev => prev.filter(notification => !notification.seen));
  };

  // Instructor Management
  const addInstructor = (instructorData) => {
    const newInstructor = {
      ...instructorData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setInstructors(prev => [...prev, newInstructor]);
    return newInstructor;
  };

  const updateInstructor = (id, updates) => {
    setInstructors(prev => prev.map(instructor =>
      instructor.id === id ? { ...instructor, ...updates, updatedAt: new Date().toISOString() } : instructor
    ));
  };

  const deleteInstructor = (instructorId) => {
    setInstructors(prev => prev.filter(instructor => instructor.id !== instructorId));
  };

  const getInstructorById = (id) => {
    return instructors.find(i => i.id === id);
  };

  const getInstructorsByName = (name) => {
    return instructors.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
  };

  const getInstructorsByCourse = (course) => {
    return instructors.filter(i => i.availableCourses.includes(course));
  };

  // Instructor Courses Management
  const addInstructorCourse = (course) => {
    const trimmedCourse = course.trim();
    if (trimmedCourse && !instructorCourses.includes(trimmedCourse)) {
      setInstructorCourses(prev => [...prev, trimmedCourse].sort());
      return true;
    }
    return false;
  };

  const removeInstructorCourse = (course) => {
    // Check if any instructor is using this course
    const isInUse = instructors.some(instructor => instructor.availableCourses.includes(course));
    if (isInUse) {
      return { success: false, message: 'Cannot remove course that is currently assigned to instructors' };
    }
    setInstructorCourses(prev => prev.filter(c => c !== course));
    return { success: true };
  };

  const updateInstructorCourse = (oldCourse, newCourse) => {
    const trimmedNewCourse = newCourse.trim();
    if (!trimmedNewCourse) {
      return { success: false, message: 'Course name cannot be empty' };
    }

    if (oldCourse === trimmedNewCourse) {
      return { success: true };
    }

    if (instructorCourses.includes(trimmedNewCourse)) {
      return { success: false, message: 'Course already exists' };
    }

    // Update instructor courses
    setInstructorCourses(prev => prev.map(course =>
      course === oldCourse ? trimmedNewCourse : course
    ).sort());

    // Update all instructors using the old course
    setInstructors(prev => prev.map(instructor => ({
      ...instructor,
      availableCourses: instructor.availableCourses.map(course =>
        course === oldCourse ? trimmedNewCourse : course
      )
    })));

    return { success: true };
  };

  // Education Options Management
  const addEducationOption = (option) => {
    const trimmedOption = option.trim();
    if (trimmedOption && !educationOptions.includes(trimmedOption)) {
      setEducationOptions(prev => [...prev, trimmedOption].sort());
      return true;
    }
    return false;
  };

  const removeEducationOption = (option) => {
    // Check if any trainee is using this education option
    const isInUse = trainees.some(trainee => trainee.education === option);
    if (isInUse) {
      return { success: false, message: 'Cannot remove education option that is currently in use by trainees' };
    }
    setEducationOptions(prev => prev.filter(opt => opt !== option));
    return { success: true };
  };

  const updateEducationOption = (oldOption, newOption) => {
    const trimmedNewOption = newOption.trim();
    if (!trimmedNewOption) {
      return { success: false, message: 'Education option cannot be empty' };
    }

    if (oldOption === trimmedNewOption) {
      return { success: true };
    }

    if (educationOptions.includes(trimmedNewOption)) {
      return { success: false, message: 'Education option already exists' };
    }

    // Update education options
    setEducationOptions(prev => prev.map(opt =>
      opt === oldOption ? trimmedNewOption : opt
    ).sort());

    // Update all trainees using the old option
    setTrainees(prev => prev.map(trainee =>
      trainee.education === oldOption ? { ...trainee, education: trimmedNewOption } : trainee
    ));

    return { success: true };
  };

  // Course Categories Management
  const addCourseCategory = (category) => {
    const trimmedCategory = category.trim();
    if (trimmedCategory && !courseCategories.includes(trimmedCategory)) {
      setCourseCategories(prev => [...prev, trimmedCategory].sort());
      return true;
    }
    return false;
  };

  const removeCourseCategory = (category) => {
    // Check if any course is using this category
    const isInUse = [...courses, ...trainingCourses].some(course => course.category === category);
    if (isInUse) {
      return { success: false, message: 'Cannot remove category that is currently in use by courses' };
    }
    setCourseCategories(prev => prev.filter(cat => cat !== category));
    return { success: true };
  };

  const updateCourseCategory = (oldCategory, newCategory) => {
    const trimmedNewCategory = newCategory.trim();
    if (!trimmedNewCategory) {
      return { success: false, message: 'Category cannot be empty' };
    }

    if (oldCategory === trimmedNewCategory) {
      return { success: true };
    }

    if (courseCategories.includes(trimmedNewCategory)) {
      return { success: false, message: 'Category already exists' };
    }

    // Update course categories
    setCourseCategories(prev => prev.map(cat =>
      cat === oldCategory ? trimmedNewCategory : cat
    ).sort());

    // Update all courses using the old category
    setCourses(prev => prev.map(course =>
      course.category === oldCategory ? { ...course, category: trimmedNewCategory } : course
    ));

    setTrainingCourses(prev => prev.map(course =>
      course.category === oldCategory ? { ...course, category: trimmedNewCategory } : course
    ));

    return { success: true };
  };

  // Locations Management
  const addLocation = (location) => {
    const trimmedLocation = location.trim();
    if (trimmedLocation && !locations.includes(trimmedLocation)) {
      setLocations(prev => [...prev, trimmedLocation].sort());
      return true;
    }
    return false;
  };

  const removeLocation = (location) => {
    // Check if any course is using this location
    const isInUse = [...trainingSessions, ...trainingCourses].some(item => item.location === location);
    if (isInUse) {
      return { success: false, message: 'Cannot remove location that is currently in use' };
    }
    setLocations(prev => prev.filter(loc => loc !== location));
    return { success: true };
  };

  const updateLocation = (oldLocation, newLocation) => {
    const trimmedNewLocation = newLocation.trim();
    if (!trimmedNewLocation) {
      return { success: false, message: 'Location cannot be empty' };
    }

    if (oldLocation === trimmedNewLocation) {
      return { success: true };
    }

    if (locations.includes(trimmedNewLocation)) {
      return { success: false, message: 'Location already exists' };
    }

    // Update locations
    setLocations(prev => prev.map(loc =>
      loc === oldLocation ? trimmedNewLocation : loc
    ).sort());

    // Update all items using the old location
    setTrainingSessions(prev => prev.map(session =>
      session.location === oldLocation ? { ...session, location: trimmedNewLocation } : session
    ));

    setTrainingCourses(prev => prev.map(course =>
      course.location === oldLocation ? { ...course, location: trimmedNewLocation } : course
    ));

    return { success: true };
  };

  const checkInTrainee = (serialNumber) => {
    const trainee = trainees.find(t => t.serialNumber === serialNumber);
    if (!trainee) {
      throw new Error('Trainee not found');
    }

    const checkIn = {
      id: Date.now().toString(),
      traineeId: trainee.id,
      serialNumber,
      timestamp: new Date().toISOString(),
      points: 10 // Default points for check-in
    };

    setCheckIns(prev => [...prev, checkIn]);

    // Update trainee points
    updateTrainee(trainee.id, {
      points: trainee.points + 10,
      lastCheckIn: checkIn.timestamp
    });

    return { trainee, checkIn };
  };

  const flagTrainee = (id, reason) => {
    const trainee = trainees.find(t => t.id === id);
    if (!trainee) return;

    const flag = {
      id: Date.now().toString(),
      reason,
      timestamp: new Date().toISOString(),
      pointsDeducted: 5
    };

    const newFlags = [...(trainee.flags || []), flag];
    const newPoints = Math.max(0, trainee.points - 5);

    updateTrainee(id, {
      flags: newFlags,
      points: newPoints
    });
  };

  // Training Session Management
  const addTrainingSession = (sessionData) => {
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    setTrainingSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const updateTrainingSession = (sessionId, updates) => {
    setTrainingSessions(prev => prev.map(session =>
      session.id === sessionId ? { ...session, ...updates } : session
    ));
  };

  const deleteTrainingSession = (sessionId) => {
    setTrainingSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const getTraineeTrainingSessions = (traineeId) => {
    return trainingSessions.filter(session => session.traineeId === traineeId);
  };

  const markSessionComplete = (sessionId) => {
    updateTrainingSession(sessionId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    // Award points to trainee
    const session = trainingSessions.find(s => s.id === sessionId);
    if (session) {
      const trainee = trainees.find(t => t.id === session.traineeId);
      if (trainee) {
        updateTrainee(trainee.id, {
          points: trainee.points + (session.points || 20)
        });
      }
    }
  };

  // Course Management
  const addCourse = (courseData) => {
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      createdAt: new Date().toISOString(),
      status: 'enrolled'
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (courseId, updates) => {
    setCourses(prev => prev.map(course =>
      course.id === courseId ? { ...course, ...updates } : course
    ));
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const getTraineeCourses = (traineeId) => {
    return courses.filter(course => course.traineeId === traineeId);
  };

  const markCourseComplete = (courseId) => {
    updateCourse(courseId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    // Award points to trainee upon course completion
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const trainee = trainees.find(t => t.id === course.traineeId);
      if (trainee) {
        updateTrainee(trainee.id, {
          points: trainee.points + (course.points || 5)
        });
      }
    }
  };

  // Training Course Management (Group Courses)
  const addTrainingCourse = (courseData) => {
    const newCourse = {
      id: Date.now().toString(),
      ...courseData,
      attendees: [],
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };
    setTrainingCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateTrainingCourse = (courseId, updates) => {
    setTrainingCourses(prev => prev.map(course =>
      course.id === courseId ? { ...course, ...updates } : course
    ));
  };

  const deleteTrainingCourse = (courseId) => {
    setTrainingCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const addAttendeesToCourse = (courseId, newAttendees) => {
    setTrainingCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const existingAttendeeIds = course.attendees ? course.attendees.map(a => a.id) : [];
        const attendeesToAdd = newAttendees.filter(attendee =>
          !existingAttendeeIds.includes(attendee.id)
        );
        return {
          ...course,
          attendees: [...(course.attendees || []), ...attendeesToAdd]
        };
      }
      return course;
    }));
  };

  const removeAttendeeFromCourse = (courseId, attendeeId) => {
    setTrainingCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          attendees: course.attendees ? course.attendees.filter(a => a.id !== attendeeId) : []
        };
      }
      return course;
    }));
  };

  const markCourseAttendeeComplete = (courseId, attendeeId) => {
    const course = trainingCourses.find(c => c.id === courseId);
    if (course) {
      const attendee = course.attendees?.find(a => a.id === attendeeId);
      if (attendee) {
        // Award points to trainee
        const trainee = trainees.find(t => t.id === attendeeId);
        if (trainee) {
          updateTrainee(attendeeId, {
            points: trainee.points + (course.points || 10)
          });
        }
      }
    }
  };

  // Gift Management
  const addGift = (giftData) => {
    const newGift = {
      id: Date.now().toString(),
      ...giftData,
      createdAt: new Date().toISOString(),
      status: 'active',
      totalRedeemed: 0
    };
    setGifts(prev => [...prev, newGift]);
    return newGift;
  };

  const updateGift = (giftId, updates) => {
    setGifts(prev => prev.map(gift =>
      gift.id === giftId ? { ...gift, ...updates } : gift
    ));
  };

  const deleteGift = (giftId) => {
    setGifts(prev => prev.filter(gift => gift.id !== giftId));
    // Also remove related redemptions
    setGiftRedemptions(prev => prev.filter(redemption => redemption.giftId !== giftId));
  };

  const redeemGift = (giftId, traineeId) => {
    const gift = gifts.find(g => g.id === giftId);
    const trainee = trainees.find(t => t.id === traineeId);

    if (!gift || !trainee) {
      return { success: false, message: 'Gift or trainee not found' };
    }

    if (gift.status !== 'active') {
      return { success: false, message: 'Gift is not available' };
    }

    if (gift.totalRedeemed >= gift.availableQuantity) {
      return { success: false, message: 'Gift is out of stock' };
    }

    if (trainee.points < gift.pointsRequired) {
      return { success: false, message: 'Insufficient points' };
    }

    // Check if trainee already redeemed this gift (if it's limited to one per person)
    const existingRedemption = giftRedemptions.find(r => r.giftId === giftId && r.traineeId === traineeId);
    if (existingRedemption && gift.limitPerPerson === 1) {
      return { success: false, message: 'You have already redeemed this gift' };
    }

    // Create redemption record
    const redemption = {
      id: Date.now().toString(),
      giftId,
      traineeId,
      giftTitle: gift.title,
      traineeName: trainee.name,
      traineeSerial: trainee.serialNumber,
      pointsDeducted: gift.pointsRequired,
      redeemedAt: new Date().toISOString(),
      status: 'redeemed'
    };

    setGiftRedemptions(prev => [...prev, redemption]);

    // Update gift
    updateGift(giftId, {
      totalRedeemed: gift.totalRedeemed + 1
    });

    // Deduct points from trainee
    updateTrainee(traineeId, {
      points: trainee.points - gift.pointsRequired
    });

    return { success: true, redemption };
  };

  const getAvailableGiftsForTrainee = (traineeId) => {
    const trainee = trainees.find(t => t.id === traineeId);
    if (!trainee) return [];

    return gifts.filter(gift => {
      // Check if gift is active
      if (gift.status !== 'active') return false;

      // Check if gift is in stock
      if (gift.totalRedeemed >= gift.availableQuantity) return false;

      // Check if trainee has enough points
      if (trainee.points < gift.pointsRequired) return false;

      // Check if trainee already redeemed (for limited gifts)
      if (gift.limitPerPerson === 1) {
        const alreadyRedeemed = giftRedemptions.some(r => r.giftId === gift.id && r.traineeId === traineeId);
        if (alreadyRedeemed) return false;
      }

      return true;
    });
  };

  const getTraineeRedemptions = (traineeId) => {
    return giftRedemptions.filter(r => r.traineeId === traineeId);
  };

  const getGiftRedemptions = (giftId) => {
    return giftRedemptions.filter(r => r.giftId === giftId);
  };

  const getTraineeStats = () => {
    const totalTrainees = trainees.length;
    const activeTrainees = trainees.filter(t => t.status === 'active').length;
    const totalCheckIns = checkIns.length;
    const totalFlags = trainees.reduce((sum, t) => sum + (t.flags?.length || 0), 0);
    const totalTrainingSessions = trainingSessions.length;
    const completedSessions = trainingSessions.filter(s => s.status === 'completed').length;
    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.status === 'completed').length;
    const totalTrainingCourses = trainingCourses.length;
    const totalInstructors = instructors.length;
    const totalGifts = gifts.length;
    const activeGifts = gifts.filter(g => g.status === 'active').length;
    const totalRedemptions = giftRedemptions.length;

    return {
      totalTrainees,
      activeTrainees,
      totalCheckIns,
      totalFlags,
      totalTrainingSessions,
      completedSessions,
      totalCourses,
      completedCourses,
      totalTrainingCourses,
      totalInstructors,
      totalGifts,
      activeGifts,
      totalRedemptions
    };
  };

  const getTraineeById = (id) => {
    return trainees.find(t => t.id === id);
  };

  const getTraineeBySerial = (serialNumber) => {
    return trainees.find(t => t.serialNumber === serialNumber);
  };

  const getTraineeCheckIns = (traineeId) => {
    return checkIns.filter(c => c.traineeId === traineeId);
  };

  const value = {
    trainees,
    checkIns,
    trainingSessions,
    courses,
    trainingCourses,
    instructors,
    gifts,
    giftRedemptions,
    educationOptions,
    courseCategories,
    locations,
    instructorCourses,
    levelUpNotifications,
    addTrainee,
    updateTrainee,
    deleteTrainee,
    bulkDeleteTrainees,
    markLevelUpNotificationSeen,
    clearSeenLevelUpNotifications,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    getInstructorById,
    getInstructorsByName,
    getInstructorsByCourse,
    addInstructorCourse,
    removeInstructorCourse,
    updateInstructorCourse,
    checkInTrainee,
    flagTrainee,
    addEducationOption,
    removeEducationOption,
    updateEducationOption,
    addCourseCategory,
    removeCourseCategory,
    updateCourseCategory,
    addLocation,
    removeLocation,
    updateLocation,
    addTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
    getTraineeTrainingSessions,
    markSessionComplete,
    addCourse,
    updateCourse,
    deleteCourse,
    getTraineeCourses,
    markCourseComplete,
    addTrainingCourse,
    updateTrainingCourse,
    deleteTrainingCourse,
    addAttendeesToCourse,
    removeAttendeeFromCourse,
    markCourseAttendeeComplete,
    addGift,
    updateGift,
    deleteGift,
    redeemGift,
    getAvailableGiftsForTrainee,
    getTraineeRedemptions,
    getGiftRedemptions,
    getTraineeStats,
    getTraineeById,
    getTraineeBySerial,
    getTraineeCheckIns
  };

  return (
    <TraineeContext.Provider value={value}>
      {children}
    </TraineeContext.Provider>
  );
};