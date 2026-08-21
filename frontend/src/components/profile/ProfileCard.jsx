import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Trophy,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
  User,
  ShieldCheck,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { gamificationService } from '../../services/gamificationService';

const XP_PER_LEVEL = 500;

function getInitials(name) {
  if (!name) return 'EX';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getRoleLabel(role) {
  if (role === 'HIGHER_MANAGEMENT') return 'Program Director';
  if (role === 'KATALYST_MANAGEMENT') return 'Mentor Coach';
  return 'Katalyst Scholar';
}

function getRoleColor(role) {
  if (role === 'HIGHER_MANAGEMENT') return 'from-violet-500 to-purple-600';
  if (role === 'KATALYST_MANAGEMENT') return 'from-sky-500 to-indigo-600';
  return 'from-theme-berry via-theme-peach to-theme-cream';
}

function getRoleBadgeStyle(role) {
  if (role === 'HIGHER_MANAGEMENT') return 'bg-violet-50 text-violet-700 border-violet-100';
  if (role === 'KATALYST_MANAGEMENT') return 'bg-sky-50 text-sky-700 border-sky-100';
  return 'bg-rose-50 text-rose-700 border-rose-100';
}

/**
 * ProfileCard — embeddable widget showing the logged-in user's avatar,
 * name, role badge, XP bar, streak, and cohort year.
 *
 * Props:
 *   compact   (bool)  — shows a slim horizontal card (for dashboard sidebars)
 *   editable  (bool)  — shows an edit button to change display name
 *   className (str)   — extra tailwind classes on the root wrapper
 */
export default function ProfileCard({ compact = false, editable = false, className = '' }) {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [streak] = useState(() => {
    if (!user?.id) return 5;
    const subs = JSON.parse(localStorage.getItem('mock_submissions_db') || '[]');
    const userSubs = subs.filter(s => s.userId === user.id);
    const days = new Set(userSubs.map(s => new Date(s.submittedAt).toDateString()));
    return days.size || 5;
  });
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    gamificationService.getXp(user.id)
      .then(val => setXp(val ?? 0))
      .catch(() => setXp(1380));
  }, [user]);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const progressPercent = Math.min((currentLevelXp / XP_PER_LEVEL) * 100, 100);
  const xpToNext = XP_PER_LEVEL - currentLevelXp;

  const handleSaveName = async () => {
    if (!draftName.trim() || draftName === user?.name) { setEditing(false); return; }
    setSaving(true);
    // Persist locally (backend profile update endpoint not yet live)
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.name = draftName.trim();
      localStorage.setItem('user', JSON.stringify(parsed));
      // Force AuthContext to reflect new name by re-reading
      window.dispatchEvent(new Event('storage'));
    }
    setSaving(false);
    setEditing(false);
  };

  if (!user) return null;

  /* ─── COMPACT MODE (horizontal, for dashboard headers) ─── */
  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-theme-plum/5 shadow-sm backdrop-blur-sm ${className}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold shadow-inner flex-shrink-0 relative`}>
          <span className="font-display font-semibold text-xs">{getInitials(user?.name)}</span>
          <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-theme-plum text-white text-[8px] font-bold rounded-full border border-white shadow-sm">
            L{level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-theme-plum truncate">{user.name}</p>
          <p className="text-[10px] text-slate-500 font-sans truncate">{getRoleLabel(user.role)}</p>
        </div>

        {/* XP chip */}
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-black text-theme-berry font-display">{xp.toLocaleString()} XP</span>
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold text-orange-500">
              <Flame className="w-2.5 h-2.5 fill-orange-400" />{streak}d
            </span>
          )}
        </div>
      </div>
    );
  }

  /* ─── FULL CARD MODE ─── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-2xl border border-white/20 overflow-hidden ${className}`}
    >
      {/* Gradient banner */}
      <div className={`h-20 bg-gradient-to-br ${getRoleColor(user.role)} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent" />
      </div>

      <div className="px-6 pb-6 -mt-8 space-y-4">
        {/* Avatar row */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold shadow-lg border-4 border-white`}>
              <span className="font-display font-black text-lg">{getInitials(user?.name)}</span>
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-theme-plum text-white text-[9px] font-black rounded-full border-2 border-white flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2 h-2 text-theme-peach" />
              Lvl {level}
            </div>
          </div>

          {editable && (
            editing ? (
              <div className="flex gap-1.5 items-center">
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  className="px-2.5 py-1.5 border border-theme-berry rounded-lg text-sm font-sans text-theme-plum focus:outline-none focus:ring-1 focus:ring-theme-berry"
                />
                <button onClick={handleSaveName} disabled={saving} className="p-1.5 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setEditing(false); setDraftName(user.name); }} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg cursor-pointer hover:bg-slate-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-theme-plum/10 rounded-xl text-xs font-bold text-slate-500 hover:text-theme-plum hover:border-theme-plum/30 hover:bg-white/50 transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            )
          )}
        </div>

        {/* Name & Role */}
        <div className="space-y-1">
          <h2 className="font-display font-black text-xl text-theme-plum leading-tight">{user.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user.role)}`}>
              {user.role === 'HIGHER_MANAGEMENT' && <ShieldCheck className="w-2.5 h-2.5" />}
              {user.role === 'KATALYST_MANAGEMENT' && <Award className="w-2.5 h-2.5" />}
              {user.role === 'STUDENT' && <User className="w-2.5 h-2.5" />}
              {getRoleLabel(user.role)}
            </span>
            {user.cohortYear && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                <Calendar className="w-2.5 h-2.5" />
                Cohort {user.cohortYear}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-slate-400 font-sans pt-0.5">
            <Mail className="w-3 h-3" />
            {user.email}
          </p>
        </div>

        {/* XP Progress bar */}
        <div className="space-y-1.5 bg-white/40 rounded-xl p-3 border border-theme-plum/5">
          <div className="flex justify-between items-center text-[10px] font-semibold text-theme-plum/80 font-sans">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-theme-berry" />
              Level {level} Progress
            </span>
            <span className="font-black text-theme-berry">{xp.toLocaleString()} XP total</span>
          </div>
          <div className="w-full h-2.5 bg-theme-plum/5 rounded-full overflow-hidden border border-theme-plum/5">
            <motion.div
              className={`h-full bg-gradient-to-r ${getRoleColor(user.role)} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[9px] text-slate-400 font-sans text-right">{xpToNext} XP to Level {level + 1}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2.5 bg-white/40 rounded-xl border border-theme-plum/5 gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-display font-black text-sm text-theme-plum">{level}</span>
            <span className="text-[9px] text-slate-400 font-sans uppercase tracking-wider">Level</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-white/40 rounded-xl border border-theme-plum/5 gap-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span className="font-display font-black text-sm text-theme-plum">{streak}</span>
            <span className="text-[9px] text-slate-400 font-sans uppercase tracking-wider">Day Streak</span>
          </div>
          <div className="flex flex-col items-center p-2.5 bg-white/40 rounded-xl border border-theme-plum/5 gap-1">
            <Sparkles className="w-4 h-4 text-theme-berry animate-pulse" />
            <span className="font-display font-black text-sm text-theme-plum">{xp.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-sans uppercase tracking-wider">XP Earned</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
