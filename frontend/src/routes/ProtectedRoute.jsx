import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();

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

  // Admin console is gated to HIGHER_MANAGEMENT — the app's role values are
  // STUDENT / KATALYST_MANAGEMENT / HIGHER_MANAGEMENT (see Admin.jsx's own
  // gate and backend constants/roles.js); there is no 'ADMIN' role.
  if (adminOnly && user?.role !== 'HIGHER_MANAGEMENT') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
