import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto">
        <motion.div 
          className="flex flex-col justify-center space-y-8 max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-theme-berry text-sm font-semibold w-fit">
            <Sparkles className="w-4 h-4 text-theme-peach animate-pulse" />
            <span className="font-display">पढ़AI Katalyst NGO</span>
          </div>
          
          {/* Main Title */}
          <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight text-theme-plum tracking-tight">
            Make Learning <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-glow-berry">
              a Game.
            </span>
          </h1>
          
          {/* Supporting Copy */}
          <p className="text-lg text-slate-700 font-sans leading-relaxed">
            Helping students stay engaged, motivated, and excited to learn through gamification. We turn homework into quests and milestones into celebrations.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-theme-berry to-theme-peach hover:from-theme-peach hover:to-theme-cream text-white font-bold rounded-xl shadow-lg hover:shadow-berry/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-theme-plum/5 hover:bg-theme-plum/10 text-theme-plum font-semibold rounded-xl border border-theme-plum/10 hover:border-theme-plum/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>See the Problem</span>
            </button>
          </div>
        </motion.div>
        
        {/* Spacer for 3D Pencil */}
        <div className="hidden lg:block"></div>
      </div>
    </section>
  );
}
