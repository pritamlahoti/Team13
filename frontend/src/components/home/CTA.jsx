<<<<<<< HEAD
import { useState } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> origin/mohit
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Trigger themed rewards celebration confetti!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#532e3b', '#c84771', '#f4989e', '#f8dfcb']
    });

    setSubmitted(true);
  };

  return (
    <section id="join" className="min-h-screen flex items-center justify-center px-6 relative z-10 py-20">
      <div className="w-full max-w-4xl mx-auto text-center space-y-12">
        <motion.div
          className="space-y-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="px-3 py-1.5 rounded-full glass-panel text-theme-berry text-sm font-semibold tracking-wide">
            Get Involved
          </span>
          <h2 className="font-display font-black text-5xl md:text-6xl text-theme-plum leading-tight">
            Let's make students <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-glow-berry">
              want to learn.
            </span>
          </h2>
          <p className="text-slate-700 font-sans text-base md:text-lg">
            Because when learning becomes engaging, progress follows. Join us in redesigning the educational experience.
          </p>
        </motion.div>

        {/* Input box */}
        <motion.div
          className="max-w-md mx-auto glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/50 border border-theme-plum/10 text-theme-plum placeholder-slate-500 focus:outline-none focus:border-theme-berry focus:ring-1 focus:ring-theme-berry transition-all font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-white font-bold rounded-xl shadow-lg hover:shadow-berry/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                >
                  <span>Join the Movement</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="flex flex-col items-center justify-center py-6 space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="p-3 bg-theme-berry/10 rounded-full border border-theme-berry/30">
                  <CheckCircle className="w-8 h-8 text-theme-berry animate-bounce" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-theme-plum text-lg">You're in, explorer! 🎒✨</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    Check your inbox. We will send you updates on missions and classroom beta invites.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer info */}
        <p className="text-slate-500 text-xs font-sans">
          पढ़AI Katalyst is a registered 501(c)(3) educational charity organization.
        </p>
      </div>
    </section>
  );
}
