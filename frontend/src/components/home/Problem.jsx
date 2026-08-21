import React from 'react';
import { motion } from 'framer-motion';
import { Frown, Clock, Trophy } from 'lucide-react';

export default function Problem() {
  const cards = [
    {
      icon: <Frown className="w-6 h-6 text-theme-berry" />,
      stat: "74%",
      label: "Disengaged Students",
      desc: "High schoolers reporting feeling bored or disconnected in passive classrooms."
    },
    {
      icon: <Clock className="w-6 h-6 text-theme-berry" />,
      stat: "8 Sec",
      label: "Attention Span",
      desc: "Traditional static text models fail to engage digital-native students."
    },
    {
      icon: <Trophy className="w-6 h-6 text-theme-berry" />,
      stat: "0",
      label: "Clear Rewards",
      desc: "Students lack micro-milestones, causing progress to feel invisible."
    }
  ];

  return (
    <section id="problem" className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 relative z-10 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto">
        {/* Left Side: Spacer for the 3D Pencil */}
        <div className="hidden lg:block"></div>
        
        {/* Right Side: Content */}
        <motion.div 
          className="flex flex-col justify-center space-y-8 lg:pl-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <span className="text-theme-berry uppercase tracking-widest text-sm font-semibold">The Challenge</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-theme-plum leading-tight">
              What if learning didn't feel like a chore?
            </h2>
            <p className="text-slate-700 font-sans text-base max-w-lg leading-relaxed">
              Education is still stuck in the lecture era. When learning becomes repetitive, passive, and disconnected from progress, students lose motivation.
            </p>
          </div>

          {/* Grid of Problem Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {cards.map((card, idx) => (
              <motion.div 
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="p-3 bg-theme-plum/5 rounded-xl border border-theme-plum/10 shrink-0">
                  {card.icon}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-black text-2xl md:text-3xl text-theme-plum">{card.stat}</span>
                    <span className="font-display text-sm font-semibold text-slate-500">{card.label}</span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
