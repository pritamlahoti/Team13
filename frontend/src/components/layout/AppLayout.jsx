import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AICoachDrawer from '../coach/AICoachDrawer';
import { Bot } from 'lucide-react';

export default function AppLayout() {
  const [coachOpen, setCoachOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fdf8f5] relative text-theme-plum font-sans">
      {/* Mesh Background Glows */}
      <div className="bg-mesh bg-gradient-to-tr from-theme-berry to-theme-plum top-[10%] left-[-200px]"></div>
      <div className="bg-mesh bg-gradient-to-tr from-theme-peach to-theme-cream bottom-[10%] right-[-200px]"></div>

      {/* Sidebar Component */}
      <Sidebar onOpenCoach={() => setCoachOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-8 relative z-10">
        <Outlet context={{ onOpenCoach: () => setCoachOpen(true) }} />
      </main>

      {/* Floating AI Coach FAB */}
      <button
        onClick={() => setCoachOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-white p-3.5 rounded-full shadow-lg hover:shadow-berry/25 hover:scale-105 cursor-pointer transition-all flex items-center gap-2 border border-white/20"
        aria-label="Ask AI Coach"
      >
        <Bot className="w-5 h-5 text-theme-plum" />
        <span className="text-theme-plum font-display text-xs font-black pr-1">Coach Nova</span>
      </button>

      {/* Coach Chat Drawer */}
      <AICoachDrawer isOpen={coachOpen} onClose={() => setCoachOpen(false)} />
    </div>
  );
}
