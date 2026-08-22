import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import MentorLayout from '../components/layout/MentorLayout';

// Pages
import Home from '../pages/Home';
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
import NotFound from '../pages/NotFound';

// Mentor Pages
import MentorDashboardPage from '../pages/mentor/MentorDashboardPage';
import MentorMenteesPage from '../pages/mentor/MentorMenteesPage';
import MentorSessionsPage from '../pages/mentor/MentorSessionsPage';
import MentorReviewsPage from '../pages/mentor/MentorReviewsPage';
import MentorAssignmentsPage from '../pages/mentor/MentorAssignmentsPage';
import MentorProfilePage from '../pages/mentor/MentorProfilePage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected Routes */}
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
        
        {/* Mentor Routes */}
        <Route path="/mentor" element={<ProtectedRoute><MentorLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<MentorDashboardPage />} />
          <Route path="mentees" element={<MentorMenteesPage />} />
          <Route path="sessions" element={<MentorSessionsPage />} />
          <Route path="reviews" element={<MentorReviewsPage />} />
          <Route path="assignments" element={<MentorAssignmentsPage />} />
          <Route path="profile" element={<MentorProfilePage />} />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
