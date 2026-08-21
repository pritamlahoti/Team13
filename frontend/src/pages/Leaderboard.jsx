<<<<<<< HEAD
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search, Users, Flame } from 'lucide-react';
=======
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Search, Sparkles, Users, ArrowUpRight, Flame } from 'lucide-react';
>>>>>>> origin/mohit
import { useAuth } from '../hooks/useAuth';

export default function Leaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('individual'); // individual | teams
  const [searchQuery, setSearchQuery] = useState('');

  const individualLearners = [
    { position: 1, name: "Ananya Rao", level: 10, xp: 4890, initials: "AR", streak: 12, color: "bg-amber-400 text-amber-950" },
    { position: 2, name: "Kabir Shah", level: 9, xp: 4210, initials: "KS", streak: 8, color: "bg-slate-300 text-slate-900" },
    { position: 3, name: user?.name || "Shriya Mehta", level: 8, xp: 3820, initials: "SM", streak: 5, color: "bg-amber-600 text-amber-100", mine: true },
    { position: 4, name: "Vihaan Gupta", level: 7, xp: 3380, initials: "VG", streak: 15 },
    { position: 5, name: "Diya Sharma", level: 7, xp: 3100, initials: "DS", streak: 4 },
    { position: 6, name: "Aarav Patel", level: 6, xp: 2850, initials: "AP", streak: 2 },
    { position: 7, name: "Isha Malhotra", level: 6, xp: 2600, initials: "IM", streak: 0 }
  ];

  const teamStandings = [
    { position: 1, name: "Alpha Agents", members: 4, xp: 14500, avatar: "AA", tint: "bg-theme-berry/10 text-theme-berry" },
    { position: 2, name: "Neural Knights", members: 5, xp: 13200, avatar: "NK", tint: "bg-theme-peach/10 text-theme-berry" },
    { position: 3, name: "Prompt Pioneers", members: 4, xp: 11400, avatar: "PP", tint: "bg-theme-cream/30 text-theme-plum" }
  ];

  const filteredLearners = individualLearners.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = teamStandings.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top 3 Podium spots
  const podiumSpots = individualLearners.slice(0, 3);
  // Sort podium spots as: 2nd place, 1st place, 3rd place for layout rendering
  const podiumSorted = [podiumSpots[1], podiumSpots[0], podiumSpots[2]];

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-plum/80">
          <Trophy className="w-4 h-4 text-theme-berry" />
          <span>COHORT STANDINGS</span>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/50 border border-theme-plum/10 text-xs focus:outline-none focus:border-theme-berry focus:bg-white transition-all font-sans"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2.5 border-b border-theme-plum/5 pb-2">
        <button
          onClick={() => setActiveTab('individual')}
          className={`px-4 py-2 text-sm font-bold font-sans cursor-pointer transition-all border-b-2 -mb-2.5 ${
            activeTab === 'individual' 
              ? 'border-theme-berry text-theme-berry' 
              : 'border-transparent text-slate-500 hover:text-theme-plum'
          }`}
        >
          Individual Rank
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 text-sm font-bold font-sans cursor-pointer transition-all border-b-2 -mb-2.5 ${
            activeTab === 'teams' 
              ? 'border-theme-berry text-theme-berry' 
              : 'border-transparent text-slate-500 hover:text-theme-plum'
          }`}
        >
          Cohort Teams
        </button>
      </div>

      {activeTab === 'individual' ? (
        <>
          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">
            {podiumSorted.map((learner) => {
              if (!learner) return null;
              const isFirst = learner.position === 1;
              const heightClass = isFirst ? 'h-52 bg-gradient-to-t from-theme-cream/20 to-white' : 'h-40 bg-white';
              const trophyColor = learner.position === 1 ? 'text-amber-400' : learner.position === 2 ? 'text-slate-400' : 'text-amber-600';

              return (
                <motion.div 
                  key={learner.name}
                  className={`rounded-3xl border border-theme-plum/5 shadow-md p-4 text-center flex flex-col justify-end items-center relative overflow-hidden group ${heightClass}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: learner.position * 0.1 }}
                >
                  <div className="absolute top-3 right-3 text-[10px] font-black text-slate-300">
                    #{learner.position}
                  </div>
                  
                  {/* Avatar bubble */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-theme-berry to-theme-peach text-white flex items-center justify-center font-display font-black text-sm relative shadow-sm mb-3">
                    {learner.initials}
                    <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${learner.color}`}>
                      {learner.position}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-xs text-theme-plum truncate max-w-[100px]">
                      {learner.name}
                    </h3>
                    <p className="text-[10px] text-theme-berry font-bold font-sans">
                      {learner.xp} XP
                    </p>
                    <span className="text-[9px] text-slate-400 block font-sans">
                      Level {learner.level}
                    </span>
                  </div>

                  {isFirst && (
                    <Trophy className={`absolute top-3 left-3 w-5 h-5 ${trophyColor} animate-pulse`} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* List Table of rankings */}
          <section className="p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs space-y-4">
            <h2 className="font-display font-black text-base text-theme-plum">Cohort Standings</h2>
            
            <div className="divide-y divide-theme-plum/5">
              {filteredLearners.map((learner) => (
                <div 
                  key={learner.name}
                  className={`flex items-center justify-between py-3.5 px-3 rounded-xl border transition-all ${
                    learner.mine 
                      ? 'bg-theme-plum/5 border-theme-berry/20 font-bold' 
                      : 'border-transparent hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-black text-slate-400 text-center">#{learner.position}</span>
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-theme-plum/5 text-theme-plum flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                      {learner.initials}
                    </div>
                    <div>
                      <h4 className="text-xs text-theme-plum truncate">{learner.name}</h4>
                      <span className="text-[9px] text-slate-500 font-sans">Level {learner.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    {learner.streak > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-theme-berry font-bold font-sans">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{learner.streak}d</span>
                      </div>
                    )}
                    <span className="text-xs font-black text-theme-plum font-sans">{learner.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Team Standings View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <motion.div 
              key={team.name}
              className="p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs flex flex-col justify-between min-h-[180px] hover:shadow-md transition-shadow relative group overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-theme-berry/5 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
              
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm shrink-0 shadow-sm ${team.tint}`}>
                  {team.avatar}
                </div>
                <span className="text-[10px] font-black text-slate-400">#{team.position} PLACE</span>
              </div>

              <div className="space-y-1.5 py-4">
                <h3 className="font-display font-bold text-sm text-theme-plum">{team.name}</h3>
                <p className="text-[10px] text-slate-500 font-sans flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-theme-berry" />
                  <span>{team.members} Active Members</span>
                </p>
              </div>

              <div className="flex justify-between items-end border-t border-theme-plum/5 pt-3">
                <span className="text-[10px] font-bold text-slate-400 font-sans">Total Score</span>
                <span className="text-sm font-black text-theme-plum font-sans">{team.xp} XP</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
