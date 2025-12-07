import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider, useStudent } from './context/StudentContext';
import { AuthPage } from './pages/AuthPage';
import { ProfileDetails } from './pages/ProfileDetails';
import { ResumePage } from './pages/ResumePage';
import { PsychometricPage } from './pages/PsychometricPage';
import { Dashboard } from './pages/Dashboard';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { isAuthenticated } = useStudent();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { theme } = useStudent();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileDetails />
            </ProtectedRoute>
          } />
          <Route path="/resume" element={
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
          } />
          <Route path="/psychometric" element={
            <ProtectedRoute>
              <PsychometricPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
};

export default function App() {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}