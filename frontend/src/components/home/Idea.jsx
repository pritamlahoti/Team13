import { motion } from 'framer-motion';
import { Award, Zap, Flame, Sparkles } from 'lucide-react';

export default function Idea() {
  const floats = [
    {
      icon: <Flame className="w-5 h-5 text-theme-berry fill-theme-berry" />,
      title: "14-Day Streak",
      sub: "Active learner",
      style: "top-[15%] left-[10%] lg:left-[5%]",
      animation: "animate-float"
    },
    {
      icon: <Zap className="w-5 h-5 text-theme-berry fill-theme-berry" />,
      title: "+350 XP Gained",
      sub: "Algebra Quest complete",
      style: "top-[40%] right-[5%] lg:right-[15%]",
      animation: "animate-float-delayed"
    },
    {
      icon: <Award className="w-5 h-5 text-theme-berry" />,
      title: "Master Badge",
      sub: "Unlocked: Gravity Physics",
      style: "bottom-[20%] left-[15%] lg:left-[10%]",
      animation: "animate-float-slow"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-theme-berry" />,
      title: "Level 12 Reached",
      sub: "Title: Junior Chemist",
      style: "top-[65%] right-[10%] lg:right-[8%]",
      animation: "animate-float"
    }
  ];

  return (
    <section id="idea" className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 relative z-10 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto gap-8">
        
        {/* Left Column: Content */}
        <motion.div 
          className="flex flex-col justify-center space-y-8 max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <span className="text-theme-berry uppercase tracking-widest text-sm font-semibold">The Method</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-theme-plum leading-tight">
              Turn progress into play.
            </h2>
            <p className="text-slate-700 font-sans text-base leading-relaxed">
              We apply proven game-design mechanics to core curriculums. By breaking educational lessons into mini-missions with clear rewards, we keep kids engaged for longer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-theme-berry mt-2"></div>
              <div>
                <h4 className="font-display font-bold text-theme-plum text-lg">Instant Feedback Loops</h4>
                <p className="text-slate-600 text-sm mt-1">Immediate micro-rewards trigger dopamine releases, making learning addictive and positive.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-theme-berry mt-2"></div>
              <div>
                <h4 className="font-display font-bold text-theme-plum text-lg">Quest-Based Learning</h4>
                <p className="text-slate-600 text-sm mt-1">Replacing exams with missions. Failing a mission isn't a grade; it's an opportunity to try again and gain XP.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Floating Gamification Elements around the 3D Pencil */}
        <div className="relative min-h-[400px] lg:min-h-0 flex items-center justify-center">
          {floats.map((float, idx) => (
            <div 
              key={idx}
              className={`absolute ${float.style} ${float.animation} glass-panel p-4 rounded-xl flex items-center gap-3 w-56 shadow-2xl border border-white/10`}
            >
              <div className="p-2 bg-theme-plum/5 rounded-lg border border-theme-plum/5">
                {float.icon}
              </div>
              <div className="overflow-hidden">
                <h5 className="font-display font-bold text-sm text-theme-plum truncate">{float.title}</h5>
                <p className="text-xs text-slate-500 truncate">{float.sub}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
