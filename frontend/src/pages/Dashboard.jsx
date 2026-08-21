import { useAuth } from '../hooks/useAuth';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';
import Admin from './Admin';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-theme-berry border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Role routing inside dashboard
  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboard />;
    case 'KATALYST_MANAGEMENT':
      return <MentorDashboard />;
    case 'HIGHER_MANAGEMENT':
      // Admin (Director Priya Iyer) gets the Admin console directly as their dashboard
      return <Admin />;
    default:
      return (
        <div className="p-8 text-center bg-white/40 border border-theme-plum/5 rounded-2xl">
          <h2 className="font-display font-bold text-lg text-theme-plum">Unknown User Role</h2>
          <p className="text-xs text-slate-500 mt-1">Please contact system administration to configure your credentials.</p>
        </div>
      );
  }
}
