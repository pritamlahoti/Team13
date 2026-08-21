import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-theme-cream flex flex-col items-center justify-center text-center space-y-4 px-6">
      <div className="w-16 h-16 rounded-full bg-theme-berry/10 flex items-center justify-center text-theme-berry shadow-sm border border-theme-berry/20">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="font-display font-black text-3xl text-theme-plum">404 — Off the map</h1>
      <p className="text-sm text-slate-500 max-w-md font-sans">
        This route doesn't exist. Let's get you back on the path.
      </p>
      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        className="px-5 py-2.5 bg-theme-plum text-white font-bold rounded-xl text-xs hover:scale-[1.02] transition-all shadow-md shadow-theme-plum/10"
      >
        {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
      </Link>
    </div>
  );
}
