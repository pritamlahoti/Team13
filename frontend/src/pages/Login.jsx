<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState } from 'react';
>>>>>>> origin/mohit
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Scene from '../components/home/Scene';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
  useEffect(() => {
    // Disable body scrolling when on the login page
    document.body.style.overflow = 'hidden';

    // Intercept back button to navigate to landing page
    const handlePopState = () => {
      navigate('/', { replace: true });
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Re-enable body scrolling when leaving the login page
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

=======
>>>>>>> origin/mohit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Success! Redirect to user dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 3D Stars background scene (no pencil) */}
      <Scene showPencil={false} />

      {/* Main Page Content Wrapper */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        {/* Colorful background glow meshes */}
        <div className="bg-mesh bg-gradient-to-tr from-theme-berry to-theme-plum top-[20%] left-[-200px]"></div>
        <div className="bg-mesh bg-gradient-to-tr from-theme-peach to-theme-cream top-[50%] right-[-250px]"></div>

        <div className="w-full max-w-md relative">
          {/* Main Form Glassmorphic Card */}
          <motion.div
            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo and Greeting */}
            <div className="text-center space-y-3">
              <Link to="/" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-theme-berry text-xs font-semibold w-fit transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-theme-peach" />
                <span className="font-display">Welcome to पढ़AI Katalyst</span>
              </Link>
              <h1 className="font-display font-black text-3xl text-theme-plum tracking-tight mt-2">
                Sign In
              </h1>
              <p className="text-slate-600 font-sans text-xs max-w-xs mx-auto">
                Access your personalized gamified learning journeys and complete learning quests.
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <motion.div
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-sans"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Login failed:</span> {error}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-theme-plum/80 text-xs font-semibold font-sans tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/50 border border-theme-plum/10 text-theme-plum placeholder-slate-500 focus:outline-none focus:border-theme-berry focus:ring-1 focus:ring-theme-berry transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-theme-plum/80 text-xs font-semibold font-sans tracking-wide">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-theme-berry hover:underline font-semibold font-sans transition-all"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/50 border border-theme-plum/10 text-theme-plum placeholder-slate-500 focus:outline-none focus:border-theme-berry focus:ring-1 focus:ring-theme-berry transition-all font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-theme-berry cursor-pointer transition-all"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-theme-berry focus:ring-theme-berry border-theme-plum/20 cursor-pointer accent-theme-berry"
                  />
                  <span className="text-slate-600 font-sans text-xs select-none group-hover:text-theme-plum transition-all">
                    Remember me on this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-white font-bold rounded-xl shadow-lg hover:shadow-berry/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Helper Text for Demos */}
            <div className="p-3.5 rounded-2xl bg-white/20 border border-white/30 text-[10px] text-slate-600 leading-normal font-sans space-y-1 select-none">
              <span className="font-bold text-theme-plum block">🚀 Sandbox Demo Accounts:</span>
              <div>• Student: <span className="font-semibold text-theme-berry select-all">student@questacademy.org</span> / <span className="font-semibold text-theme-plum select-all">student123</span></div>
              <div>• Management: <span className="font-semibold text-theme-berry select-all">admin@questacademy.org</span> / <span className="font-semibold text-theme-plum select-all">admin123</span></div>
            </div>

            {/* Bottom Register Redirect */}
            <div className="text-center text-xs text-slate-600 font-sans border-t border-theme-plum/5 pt-4 select-none">
              New explorer?{' '}
              <Link to="/register" className="text-theme-berry font-bold hover:underline">
                Sign Up
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
