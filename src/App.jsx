import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TraineeProvider } from './context/TraineeContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './components/LoginScreen';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Scanner from './pages/Scanner';
import TraineeList from './pages/TraineeList';
import TraineeDetails from './pages/TraineeDetails';
import TrainingCourses from './pages/TrainingCourses';
import Instructors from './pages/Instructors';
import GiftsManagement from './pages/GiftsManagement';
import GiftsRedeem from './pages/GiftsRedeem';
import TraineeProfile from './pages/TraineeProfile';
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
              
              {/* Dashboard - All users can access */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute permission={['view_all', 'view_trainees', 'view_own_profile']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Registration - Super Admin & Admin only */}
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute permission="add_trainees">
                    <Registration />
                  </ProtectedRoute>
                } 
              />
              
              {/* Scanner - Super Admin & Admin only */}
              <Route 
                path="/scanner" 
                element={
                  <ProtectedRoute permission={['view_all', 'view_trainees']}>
                    <Scanner />
                  </ProtectedRoute>
                } 
              />
              
              {/* Trainees List - Super Admin & Admin only */}
              <Route 
                path="/trainees" 
                element={
                  <ProtectedRoute permission={['view_all', 'view_trainees']}>
                    <TraineeList />
                  </ProtectedRoute>
                } 
              />
              
              {/* Trainee Details - Super Admin & Admin only */}
              <Route 
                path="/trainee/:id" 
                element={
                  <ProtectedRoute permission={['view_all', 'view_trainees']}>
                    <TraineeDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Training Courses - All users can access (different views) */}
              <Route 
                path="/training-courses" 
                element={
                  <ProtectedRoute permission={['view_all', 'add_courses', 'view_available_courses']}>
                    <TrainingCourses />
                  </ProtectedRoute>
                } 
              />
              
              {/* Instructors - Super Admin & Admin only */}
              <Route 
                path="/instructors" 
                element={
                  <ProtectedRoute permission={['view_all', 'add_instructors']}>
                    <Instructors />
                  </ProtectedRoute>
                } 
              />
              
              {/* Gifts Management - Super Admin only */}
              <Route 
                path="/gifts" 
                element={
                  <ProtectedRoute permission="add_gifts">
                    <GiftsManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Gifts Redeem - Trainee only */}
              <Route 
                path="/gifts/redeem" 
                element={
                  <ProtectedRoute permission={['redeem_gifts', 'view_available_gifts']}>
                    <GiftsRedeem />
                  </ProtectedRoute>
                } 
              />
              
              {/* Trainee Profile - Trainee only */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute permission="view_own_profile">
                    <TraineeProfile />
                  </ProtectedRoute>
                } 
              />
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