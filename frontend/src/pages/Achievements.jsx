import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Sparkles, Flame, Play, Clock3, Star, Lock, Heart, Check } from 'lucide-react';

const SPARK_IMAGE = "/manus-storage/katalyst-achievement-spark_a9c0935e.png";

export default function Achievements() {
  const [filter, setFilter] = useState('all'); // all | unlocked | locked

  const badges = [
    {
      id: "curious-builder",
      title: "Curious Builder",
      description: "Submit 3 objective code assignments verified by AI review.",
      unlocked: true,
      progress: "3 / 3",
      percent: 100,
      reward: "150 XP",
      tint: "bg-amber-100 text-amber-600 border-amber-200"
    },
    {
      id: "first-flight",
      title: "First Flight",
      description: "Enroll in and finish the AI Fundamentals Bootcamp module.",
      unlocked: true,
      progress: "1 / 1",
      percent: 100,
      reward: "100 XP",
      tint: "bg-cyan-100 text-cyan-600 border-cyan-200"
    },
    {
      id: "streak-pioneer",
      title: "Streak Pioneer",
      description: "Maintain a daily momentum spark streak of 5 days.",
      unlocked: true,
      progress: "5 / 5",
      percent: 100,
      reward: "200 XP",
      tint: "bg-rose-100 text-rose-600 border-rose-200"
    },
    {
      id: "neural-navigator",
      title: "Neural Navigator",
      description: "Submit 5 projects in the cohort and complete mentor review.",
      unlocked: false,
      progress: "2 / 5",
      percent: 40,
      reward: "300 XP",
      tint: "bg-slate-100 text-slate-400 border-slate-200"
    },
    {
      id: "coach-comrade",
      title: "Coach Comrade",
      description: "Interact with Nova AI Coach for 10 distinct topics.",
      unlocked: false,
      progress: "6 / 10",
      percent: 60,
      reward: "150 XP",
      tint: "bg-slate-100 text-slate-400 border-slate-200"
    },
    {
      id: "legendary-learner",
      title: "Legendary Learner",
      description: "Reach Level 10 and rank #1 in any weekly leaderboard.",
      unlocked: false,
      progress: "0 / 1",
      percent: 0,
      reward: "500 XP",
      tint: "bg-slate-100 text-slate-400 border-slate-200"
    }
  ];

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
                <span className="px-2 py-0.5 rounded-full bg-theme-plum/5 border border-theme-plum/10 text-theme-plum text-[8px] font-bold shrink-0">
                  {badge.reward}
                </span>
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
