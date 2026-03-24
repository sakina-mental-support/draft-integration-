import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import Register from './components/Register';
import Login from './components/login';
import ChatPage from './components/ChatPage';
import Profile from './components/Profile';
import Exercises from './components/exercises';
import ExerciseDetail from './components/ExerciseDetail';
import MoodTracker from './components/MoodTracker';
import MoodAnalytics from './components/MoodAnalytics';
import ForgotPassword from './components/Forgotpassword';
import CheckEmail from './components/Checkemail';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />

          {/* Protected routes */}
          <Route path="/chat" element={<ProtectedRoute><MainLayout><ChatPage /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><MainLayout><Exercises /></MainLayout></ProtectedRoute>} />
          <Route path="/exercise-detail" element={<ProtectedRoute><MainLayout><ExerciseDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><MainLayout><MoodTracker /></MainLayout></ProtectedRoute>} />
          <Route path="/mood-analytics" element={<ProtectedRoute><MainLayout><MoodAnalytics /></MainLayout></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;