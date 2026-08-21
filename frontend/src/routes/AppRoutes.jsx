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
<<<<<<< HEAD
=======

>>>>>>> 635c609 (starting for admin frontend)
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
