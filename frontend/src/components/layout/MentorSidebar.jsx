import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, 
  CheckSquare, ClipboardList, UserCircle, LogOut 
} from 'lucide-react';
import { authService } from "../../services/authService";
import { useNavigate } from 'react-router-dom';

export default function MentorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/mentor/dashboard' },
    { name: 'Mentees', icon: Users, path: '/mentor/mentees' },
    { name: 'Sessions', icon: Calendar, path: '/mentor/sessions' },
    { name: 'Reviews', icon: CheckSquare, path: '/mentor/reviews' },
    { name: 'Assignments', icon: ClipboardList, path: '/mentor/assignments' },
    { name: 'Profile', icon: UserCircle, path: '/mentor/profile' },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white h-full border-r border-theme-plum/10 shadow-lg flex flex-col relative z-20 shrink-0">
      <div className="p-8 border-b border-theme-plum/5">
        <h1 className="text-2xl font-black font-display text-theme-berry flex items-center gap-2">
          Katalyst
        </h1>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1 block">
          Mentor Portal
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-bold text-sm ${
                isActive 
                  ? 'bg-theme-plum text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-theme-berry'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-theme-peach' : 'text-slate-400 group-hover:text-theme-berry'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-theme-plum/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
          Logout
        </button>
      </div>
    </aside>
  );
}
