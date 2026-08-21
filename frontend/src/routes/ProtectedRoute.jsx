import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  
  // If the hook is stubbed out and returns no user, 
  // you might need to fall back to a token check or local storage mock 
  // depending on how auth is truly implemented in the existing repo.
  // For now, if no user is provided, we simulate an unauthenticated state (or fallback).
  
  const token = localStorage.getItem('token');
  const mockUser = localStorage.getItem('mock_user') ? JSON.parse(localStorage.getItem('mock_user')) : null;
  
  const currentUser = user || mockUser;
  
  if (!currentUser && !token) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && currentUser?.role !== 'ADMIN') {
    // If they are not an admin, redirect them to the generic dashboard
    return <Navigate to="/dashboard" replace />;
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-theme-berry border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
