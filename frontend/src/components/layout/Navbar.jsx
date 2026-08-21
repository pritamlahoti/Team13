import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Users } from 'lucide-react';

export default function Navbar({ activeSection }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLinkClick = (id) => {
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <nav className="max-w-6xl mx-auto glass-panel px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-lg border border-white/20">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 bg-gradient-to-tr from-theme-berry to-theme-peach rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-theme-plum">
            पढ़<span className="text-theme-berry">AI</span> Katalyst
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {[
            { id: 'hero', label: 'Home', path: '/#hero' },
            { id: 'problem', label: 'The Challenge', path: '/#problem' },
            { id: 'idea', label: 'The Method', path: '/#idea' },
            { id: 'impact', label: 'Our Impact', path: '/#impact' }
          ].map((link) => {
            if (isHomePage) {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`transition-colors duration-300 font-display cursor-pointer hover:text-theme-berry ${
                    activeSection === link.id ? 'text-theme-berry' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            } else {
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className="transition-colors duration-300 font-display cursor-pointer hover:text-theme-berry text-slate-600"
                >
                  {link.label}
                </Link>
              );
            }
          })}
          <Link
            to="/about"
            className={`transition-colors duration-300 font-display cursor-pointer hover:text-theme-berry ${
              location.pathname === '/about' ? 'text-theme-berry' : 'text-slate-600'
            }`}
          >
            About Us
          </Link>
        </div>

        {/* Nav CTA */}
        <div className="flex items-center gap-3">
          {isHomePage ? (
            <button
              onClick={() => handleLinkClick('join')}
              className="px-4 py-2 bg-theme-plum/5 hover:bg-theme-plum/10 text-theme-plum text-xs font-bold rounded-xl border border-theme-plum/10 transition-all duration-300 hover:scale-[1.03] flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join Us</span>
            </button>
          ) : (
            <Link
              to="/#join"
              className="px-4 py-2 bg-theme-plum/5 hover:bg-theme-plum/10 text-theme-plum text-xs font-bold rounded-xl border border-theme-plum/10 transition-all duration-300 hover:scale-[1.03] flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join Us</span>
            </Link>
          )}
          
          <Link
            to="/login"
            className="px-4 py-2 text-slate-600 hover:text-theme-berry text-xs font-bold transition-all duration-300 cursor-pointer"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-gradient-to-r from-theme-berry to-theme-peach text-white text-xs font-bold rounded-xl shadow-md hover:shadow-berry/20 hover:scale-[1.03] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
