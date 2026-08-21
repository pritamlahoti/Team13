import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
