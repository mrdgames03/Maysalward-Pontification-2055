import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TraineeProvider } from './context/TraineeContext';
import Navigation from './components/Navigation';
import LoginScreen from './components/LoginScreen';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Scanner from './pages/Scanner';
import TraineeList from './pages/TraineeList';
import TraineeDetails from './pages/TraineeDetails';
import TrainingCourses from './pages/TrainingCourses';
import Instructors from './pages/Instructors';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading Training Hub...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <TraineeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navigation />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/trainees" element={<TraineeList />} />
              <Route path="/trainee/:id" element={<TraineeDetails />} />
              <Route path="/training-courses" element={<TrainingCourses />} />
              <Route path="/instructors" element={<Instructors />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TraineeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;