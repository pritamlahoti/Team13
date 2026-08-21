import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { gamificationService } from '../services/gamificationService';

const SPARK_IMAGE = "/manus-storage/katalyst-achievement-spark_a9c0935e.png";
const TINTS = [
  'bg-amber-100 text-amber-600 border-amber-200',
  'bg-cyan-100 text-cyan-600 border-cyan-200',
  'bg-rose-100 text-rose-600 border-rose-200'
];
const LOCKED_TINT = 'bg-slate-100 text-slate-400 border-slate-200';

export default function Achievements() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all | unlocked | locked
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    gamificationService.getAchievements(user.id).then((achievements) => {
      setBadges(achievements.map((a, i) => ({
        id: a.id,
        title: a.name,
        description: a.description,
        unlocked: a.earned,
        progress: a.earned ? 'Unlocked' : 'Locked',
        percent: a.earned ? 100 : 0,
        reward: '',
        tint: a.earned ? TINTS[i % TINTS.length] : LOCKED_TINT
      })));
    });
  }, [user]);

  const filteredBadges = badges.filter(b => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  const totalUnlocked = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-plum/80">
          <Award className="w-4 h-4 text-theme-berry" />
          <span>REWARDS CABINET</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-theme-berry/10 border border-theme-berry/20 text-theme-berry text-[10px] font-bold">
          Unlocked {totalUnlocked} of {badges.length} Badges
        </div>
      </header>

      {/* Filter and overview banner */}
      <section className="p-6 rounded-2xl bg-white/50 border border-theme-plum/5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-theme-berry uppercase tracking-widest font-sans">Achievements Milestone</span>
          <h2 className="font-display font-black text-lg text-theme-plum">Your rewards dashboard</h2>
          <p className="text-[11px] text-slate-500 font-sans">Unlocked rewards yield massive XP boosts and special roles.</p>
        </div>

        {/* Filter keys */}
        <div className="flex gap-2 shrink-0">
          {['all', 'unlocked', 'locked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-xs font-bold font-sans rounded-xl border cursor-pointer transition-all ${
                filter === tab 
                  ? 'bg-theme-plum text-white border-theme-plum shadow-xs' 
                  : 'bg-white/60 text-slate-500 border-theme-plum/10 hover:bg-white hover:text-theme-plum'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <motion.article
            key={badge.id}
            className={`p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs flex gap-4 transition-all duration-300 relative group overflow-hidden ${
              !badge.unlocked ? 'opacity-85' : ''
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Visual glow indicator */}
            {badge.unlocked && (
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-theme-berry/5 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
            )}

            {/* Badge Icon Sphere */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border relative ${badge.tint}`}>
              {badge.unlocked ? (
                <>
                  <img 
                    className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500" 
                    src={SPARK_IMAGE} 
                    alt="Unlocked Spark" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Award className="w-6 h-6 text-theme-berry absolute" style={{ display: 'none' }} id={`badge-fallback-${badge.id}`} />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-green-500 rounded-full text-white border border-white">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                </>
              ) : (
                <Lock className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className={`font-display font-bold text-sm text-theme-plum ${!badge.unlocked ? 'text-slate-500' : ''}`}>
                  {badge.title}
                </h3>
                {badge.reward && (
                  <span className="px-2 py-0.5 rounded-full bg-theme-plum/5 border border-theme-plum/10 text-theme-plum text-[8px] font-bold shrink-0">
                    {badge.reward}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 leading-normal font-sans">
                {badge.description}
              </p>

              {/* Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-400 font-sans">
                  <span>Progress</span>
                  <span>{badge.progress}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${badge.unlocked ? 'bg-gradient-to-r from-theme-berry to-theme-peach' : 'bg-slate-400'}`}
                    style={{ width: `${badge.percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
