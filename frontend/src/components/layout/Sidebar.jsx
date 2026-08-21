import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Rocket,
  Trophy,
  Award,
  LogOut,
  Flame,
  Sparkles,
  User,
  MessageSquare,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { gamificationService } from '../../services/gamificationService';

export default function Sidebar({ onOpenCoach }) {
  const { user, logout } = useAuth();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (user?.id) {
      gamificationService.getXp(user.id)
        .then(val => {
          setXp(val);
        })
        .catch(() => {
          setXp(1380); // Fallback
        });
    }
  }, [user]);

  // Game Math: 500 XP per level
  const getRoleLabel = (role) => {
    if (role === 'HIGHER_MANAGEMENT') return 'Program Director';
    if (role === 'KATALYST_MANAGEMENT') return 'Mentor Coach';
    return 'Katalyst Scholar';
  };

  // Compile menu items dynamically based on user role
  const menuItems = [
    { to: '/dashboard', label: 'Mission Control', icon: LayoutDashboard },
  ];

  if (user?.role === 'STUDENT') {
    menuItems.push(
      { to: '/learning-path', label: 'Learning Path', icon: Compass },
      { to: '/challenges', label: 'Challenges', icon: Rocket },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/achievements', label: 'Achievements', icon: Award }
    );
  } else if (user?.role === 'KATALYST_MANAGEMENT') {
    menuItems.push(
      { to: '/mentor-dashboard', label: 'Mentor Console', icon: ClipboardList },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy }
    );
  } else if (user?.role === 'HIGHER_MANAGEMENT') {
    menuItems.push(
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/admin', label: 'Admin Console', icon: ShieldCheck }
    );
  }

  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelXp = xp % xpPerLevel;
  const progressPercent = Math.min((currentLevelXp / xpPerLevel) * 100, 100);

  const getInitials = (name) => {
    if (!name) return 'EX';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-80 h-full flex flex-col glass-panel border-r border-white/20 p-6 space-y-6 flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-theme-berry to-theme-peach flex items-center justify-center text-white font-bold shadow-md shadow-theme-berry/20">
          क
        </div>
        <span className="font-display font-black text-lg text-theme-plum tracking-tight">
          पढ़AI Katalyst
        </span>
      </div>

      {/* User Player Card */}
      <div className="p-4 rounded-2xl bg-white/40 border border-theme-plum/5 space-y-4 shadow-sm relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-theme-peach/10 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
        <div className="flex items-center gap-3">
          {/* Avatar Sphere */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-berry via-theme-peach to-theme-cream flex items-center justify-center text-theme-plum font-bold shadow-inner relative">
            <span className="font-display font-semibold text-sm text-white">
              {getInitials(user?.name)}
            </span>
            {/* Level Badge Pill */}
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-theme-plum text-white text-[9px] font-bold rounded-full border border-white flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-theme-peach animate-pulse" />
              Lvl {level}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm text-theme-plum truncate">
              {user?.name || 'Explorer'}
            </h3>
            <p className="text-[10px] text-slate-500 truncate font-sans tracking-wide">
              {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-theme-plum/80 font-sans">
            <span>Level Progress</span>
            <span>{currentLevelXp}/{xpPerLevel} XP</span>
          </div>
          <div className="w-full h-2.5 bg-theme-plum/5 rounded-full overflow-hidden p-[1px] border border-theme-plum/5">
            <div 
              className="h-full bg-gradient-to-r from-theme-berry via-theme-peach to-theme-cream rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Streak Widget */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-theme-berry/5 to-theme-peach/5 border border-theme-berry/10">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-theme-berry fill-theme-berry animate-bounce" />
            <span className="text-[11px] font-bold text-theme-plum font-sans">
              Daily Streak
            </span>
          </div>
          <span className="text-xs font-black text-theme-berry font-display">
            5 Days
          </span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold font-sans text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-theme-plum text-white shadow-md shadow-theme-plum/10'
                    : 'text-theme-plum/70 hover:bg-white/50 hover:text-theme-plum hover:scale-[1.01]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Special AI Coach Navigation Shortcut */}
        <button
          onClick={onOpenCoach}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold font-sans text-sm text-theme-plum/70 hover:bg-white/50 hover:text-theme-plum hover:scale-[1.01] transition-all cursor-pointer text-left"
        >
          <MessageSquare className="w-4 h-4 text-theme-berry" />
          <span>Ask AI Coach</span>
        </button>
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-theme-plum/5 space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold font-sans text-xs transition-all ${
              isActive
                ? 'bg-white/60 text-theme-plum'
                : 'text-slate-500 hover:text-theme-plum hover:bg-white/30'
            }`
          }
        >
          <User className="w-3.5 h-3.5" />
          <span>My Profile</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold font-sans text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-500/5 hover:scale-[1.01] transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
