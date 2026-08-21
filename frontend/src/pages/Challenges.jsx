import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Rocket, Target, Clock3, Users, Play } from 'lucide-react';

export default function Challenges() {
  const [activeCategory, setActiveCategory] = useState('all');

  const challengesList = [
    {
      id: "ai-bootcamp-3",
      title: "Module 3: Neural Networks Sandbox",
      category: "bootcamp",
      description: "Build a single layer neuron simulation to classify logical AND/OR operations.",
      reward: "120 XP",
      duration: "45 mins",
      difficulty: "Intermediate",
      icon: Code,
      badge: "Sandbox",
      progress: 40
    },
    {
      id: "project-canvas",
      title: "Katalyst Canvas Scope Brief",
      category: "projects",
      description: "Produce a visual diagram map showing how your proposed AI agents communicate.",
      reward: "200 XP",
      duration: "90 mins",
      difficulty: "Advanced",
      icon: Rocket,
      badge: "Project",
      progress: 0
    },
    {
      id: "mentoring-question",
      title: "Mentor Session: Scope Alignment",
      category: "mentoring",
      description: "Submit 2 prepared scope constraints to discuss with your mentor this Thursday.",
      reward: "80 XP",
      duration: "20 mins",
      difficulty: "Beginner",
      icon: Users,
      badge: "Q&A Setup",
      progress: 100
    },
    {
      id: "ai-bootcamp-4",
      title: "Module 4: Transformer Architecture",
      category: "bootcamp",
      description: "Explore the self-attention mechanism and write attention weights calculation.",
      reward: "150 XP",
      duration: "60 mins",
      difficulty: "Advanced",
      icon: Code,
      badge: "Sandbox",
      progress: 0
    }
  ];

  const filteredChallenges = activeCategory === 'all' 
    ? challengesList 
    : challengesList.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-plum/80">
          <Target className="w-4 h-4 text-theme-berry" />
          <span>CHALLENGES HUB</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-theme-peach/10 border border-theme-peach/30 text-theme-plum text-[10px] font-bold">
          Active Challenge Loop
        </div>
      </header>

      {/* Banner */}
      <section className="p-6 rounded-2xl bg-white/50 border border-theme-plum/5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-theme-berry uppercase tracking-widest font-sans">Quest Library</span>
          <h2 className="font-display font-black text-lg text-theme-plum">Select your next milestone</h2>
          <p className="text-[11px] text-slate-500 font-sans">Filter by bootcamp modules, cohort projects, or mentor assignments.</p>
        </div>

        {/* Filter categories */}
        <div className="flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {['all', 'bootcamp', 'projects', 'mentoring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold font-sans rounded-xl border cursor-pointer transition-all ${
                activeCategory === cat 
                  ? 'bg-theme-plum text-white border-theme-plum shadow-xs' 
                  : 'bg-white/60 text-slate-500 border-theme-plum/10 hover:bg-white hover:text-theme-plum'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => {
          const Icon = challenge.icon;
          const isComplete = challenge.progress === 100;

          return (
            <motion.article
              key={challenge.id}
              className={`p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-all duration-300 relative group overflow-hidden ${
                isComplete ? 'bg-slate-50/50 opacity-80' : ''
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-theme-peach/5 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-theme-plum/5 text-theme-berry flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-theme-berry uppercase tracking-widest font-sans block">{challenge.badge}</span>
                      <h3 className={`font-display font-bold text-sm text-theme-plum ${isComplete ? 'line-through text-slate-400' : ''}`}>{challenge.title}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-gradient-to-tr from-theme-berry/5 to-theme-peach/5 border border-theme-berry/15 text-theme-berry text-[10px] font-bold">
                    {challenge.reward}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {challenge.description}
                </p>
              </div>

              {/* Progress and start action */}
              <div className="space-y-3 pt-4 border-t border-theme-plum/5">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 font-sans">
                  <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5 text-theme-berry" /> {challenge.duration}</span>
                  <span>{challenge.difficulty}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-theme-berry`} style={{ width: `${challenge.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-theme-plum shrink-0">{challenge.progress}%</span>
                </div>

                {isComplete ? (
                  <div className="w-full py-2 bg-green-50 rounded-xl border border-green-200 text-green-600 font-sans text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <span>Task Completed</span>
                  </div>
                ) : (
                  <button className="w-full py-2 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-theme-berry cursor-pointer transition-all">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Challenge</span>
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
