import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  Users, 
  UserCheck, 
  AlertTriangle, 
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/admin/activities', label: 'Activities', icon: Target },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/mentors', label: 'Mentors', icon: UserCheck },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/engagement/at-risk', label: 'At-Risk Students', icon: AlertTriangle },
    { to: '/admin/reports', label: 'Reports', icon: FileText }
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-slate-800 flex flex-col gap-1">
        <h2 className="font-black text-xl text-white">Admin Portal</h2>
        <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">पढ़AI Katalyst</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user?.name || 'Administrator'}</span>
            <span className="text-xs text-slate-500">{user?.role || 'ADMIN'}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
