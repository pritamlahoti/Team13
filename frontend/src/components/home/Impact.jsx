<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> origin/mohit
import { motion } from 'framer-motion';

function CountUp({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
<<<<<<< HEAD
=======
          let start = 0;
>>>>>>> origin/mohit
          const end = parseInt(value, 10);
          if (isNaN(end)) return;

          const duration = 1200; // ms
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * end);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={elementRef} className="font-display font-black text-6xl md:text-7xl text-theme-berry tracking-tight text-glow-berry">
      {count}{suffix}
    </span>
  );
}

export default function Impact() {
  const stats = [
    { value: "10", suffix: "K+", label: "Students Reached", desc: "Engaged in gamified study rooms daily." },
    { value: "50", suffix: "K+", label: "Quests Completed", desc: "Missions in math, science, and history." },
    { value: "85", suffix: "%", label: "Engagement Boost", desc: "Increase in weekly studying time per student." }
  ];

  return (
    <section id="impact" className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 relative z-10 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl mx-auto">
        
        {/* Left column: Spacer for 3D Pencil */}
        <div className="hidden lg:block"></div>
        
        {/* Right column: Content */}
        <motion.div 
          className="flex flex-col justify-center space-y-8 lg:pl-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <span className="text-theme-berry uppercase tracking-widest text-sm font-semibold">Our Impact</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-theme-plum leading-tight">
              Small rewards.<br />Bigger motivation.
            </h2>
            <p className="text-slate-700 font-sans text-base leading-relaxed">
              We track results across classrooms. Adding reward loops doesn't just increase scores; it transforms student confidence and learning habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-48 border border-white/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-theme-plum">{stat.label}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
