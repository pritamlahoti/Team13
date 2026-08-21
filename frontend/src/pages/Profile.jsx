import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  Award,
  BarChart2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { gamificationService } from '../services/gamificationService';
import { learningService } from '../services/learningService';
import ProfileCard from '../components/profile/ProfileCard';

const ACHIEVEMENTS = [
  { id: 'first-quest', label: 'First Quest', desc: 'Completed your very first module.', icon: Star, unlocked: true, color: 'text-amber-500 bg-amber-50 border-amber-100' },
  { id: 'streak-pioneer', label: 'Streak Pioneer', desc: 'Maintained a 5-day activity streak.', icon: CheckCircle2, unlocked: true, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  { id: 'xp-500', label: 'XP Spark', desc: 'Earned 500 total XP.', icon: Sparkles, unlocked: true, color: 'text-rose-500 bg-rose-50 border-rose-100' },
  { id: 'mentor-session', label: 'Mentor Connect', desc: 'Attended your first mentor session.', icon: BookOpen, unlocked: false, color: 'text-slate-400 bg-slate-50 border-slate-100' },
  { id: 'xp-2000', label: 'Level 5 Legend', desc: 'Reach Level 5 (2,000 XP).', icon: Award, unlocked: false, color: 'text-slate-400 bg-slate-50 border-slate-100' },
  { id: 'top-3', label: 'Leaderboard Elite', desc: 'Finish in the top 3 on the leaderboard.', icon: BarChart2, unlocked: false, color: 'text-slate-400 bg-slate-50 border-slate-100' },
];

export default function Profile() {
  const { user } = useAuth();
  const [ledger, setLedger] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    Promise.allSettled([
      gamificationService.getLedger(user.id),
      learningService.getSubmissions(),
    ]).then(([ledgerRes, subsRes]) => {
      if (ledgerRes.status === 'fulfilled') setLedger(ledgerRes.value ?? []);
      if (subsRes.status === 'fulfilled') {
        const completed = (subsRes.value ?? []).filter(
          s => s.userId === user.id && (s.status === 'scored' || s.status === 'reviewed' || s.status === 'completed')
        );
        setCompletedModules(completed);
      }
      setLoadingLedger(false);
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-theme-berry animate-pulse" />
          <span className="text-xs font-bold font-display uppercase tracking-widest text-theme-berry">
            My Profile
          </span>
        </div>
        <h1 className="font-display font-black text-3xl text-theme-plum mt-1">
          Explorer Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your learning journey, stats, and achievements in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Profile Card (full mode with edit) */}
        <div className="lg:col-span-1">
          <ProfileCard editable className="w-full" />
        </div>

        {/* RIGHT: Activity & Achievements */}
        <div className="lg:col-span-2 space-y-6">

          {/* Completed Modules */}
          <div className="glass-panel rounded-2xl border border-white/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-theme-plum flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-theme-berry" />
                Completed Quests
              </h2>
              <span className="text-xs font-bold text-slate-400 font-sans">{completedModules.length} total</span>
            </div>

            {completedModules.length === 0 ? (
              <p className="text-xs text-slate-400 italic font-sans text-center py-4">
                No completed quests yet — start your first mission!
              </p>
            ) : (
              <div className="space-y-2">
                {completedModules.map(mod => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-theme-plum/5 hover:bg-white/70 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-theme-plum font-sans truncate">{mod.moduleTitle || mod.moduleId}</p>
                      <p className="text-[10px] text-slate-400 font-sans">
                        {new Date(mod.submittedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    {mod.xpAwarded > 0 && (
                      <span className="px-2 py-0.5 bg-theme-berry/10 text-theme-berry text-[10px] font-black rounded-full border border-theme-berry/10">
                        +{mod.xpAwarded} XP
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* XP Ledger */}
          <div className="glass-panel rounded-2xl border border-white/20 p-5 space-y-4">
            <h2 className="font-display font-bold text-base text-theme-plum flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-theme-berry" />
              XP Transaction History
            </h2>

            {loadingLedger ? (
              <div className="py-4 text-center">
                <div className="w-5 h-5 border-2 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : ledger.length === 0 ? (
              <p className="text-xs text-slate-400 italic font-sans text-center py-4">
                No XP earned yet — complete your first quest!
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {ledger.slice(0, 20).map((entry, i) => (
                  <div
                    key={entry.id ?? i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-theme-plum/5 text-xs font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-theme-plum/5 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-theme-plum/50" />
                      </div>
                      <div>
                        <p className="font-bold text-theme-plum capitalize">
                          {(entry.scored_by ?? entry.scoredBy ?? 'system').replace('_', ' ')}
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          {new Date(entry.created_at ?? entry.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-theme-berry">+{entry.xp_awarded ?? entry.xpAwarded} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="glass-panel rounded-2xl border border-white/20 p-5 space-y-4">
            <h2 className="font-display font-bold text-base text-theme-plum flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(ach => {
                const Icon = ach.unlocked ? ach.icon : Lock;
                return (
                  <motion.div
                    key={ach.id}
                    whileHover={{ scale: ach.unlocked ? 1.02 : 1 }}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                      ach.unlocked ? 'bg-white/60' : 'bg-white/30 opacity-60'
                    } ${ach.color.split(' ').slice(1).join(' ')}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${ach.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-theme-plum font-sans leading-snug">{ach.label}</p>
                      <p className="text-[9px] text-slate-400 font-sans mt-0.5 leading-snug">{ach.desc}</p>
                    </div>
                    {!ach.unlocked && (
                      <span className="text-[9px] text-slate-400 font-bold font-sans uppercase tracking-wider">Locked</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
