import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Learning from '../pages/Learning';
import LearningPath from '../pages/LearningPath';
import Lesson from '../pages/Lesson';
import Quiz from '../pages/Quiz';
import Challenges from '../pages/Challenges';
import Leaderboard from '../pages/Leaderboard';
import Achievements from '../pages/Achievements';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ActivitiesManagement from '../pages/admin/ActivitiesManagement';
import ActivityDetails from '../pages/admin/ActivityDetails';
import StudentManagement from '../pages/admin/StudentManagement';
import StudentDetails from '../pages/admin/StudentDetails';
import MentorManagement from '../pages/admin/MentorManagement';
import AnalyticsOverview from '../pages/admin/AnalyticsOverview';
import AtRiskStudents from '../pages/admin/AtRiskStudents';
import Reports from '../pages/admin/Reports';

import AdminLayout from '../components/layout/AdminLayout';
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected Routes - General */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
        <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Protected Routes - Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="activities" element={<ActivitiesManagement />} />
          <Route path="activities/:id" element={<ActivityDetails />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:id" element={<StudentDetails />} />
          <Route path="students/:id/progress" element={<StudentDetails />} />
          <Route path="mentors" element={<MentorManagement />} />
          <Route path="analytics" element={<AnalyticsOverview />} />
          <Route path="engagement/at-risk" element={<AtRiskStudents />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
