import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Edit3, PlayCircle, CheckSquare, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MentorSidebar from './MentorSidebar';

export default function MentorLayout() {
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fdf8f5] relative text-theme-plum font-sans">
      {/* Distinct Mentor Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-theme-peach/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-theme-berry/10 blur-[120px]" />
      </div>

      <MentorSidebar />

      <main className="flex-1 h-full overflow-y-auto p-8 relative z-10">
        <Outlet />
      </main>

      {/* Global Quick Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showQuickActions && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-theme-plum/10 p-2 w-56 mb-2 origin-bottom-right"
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Quick Actions</span>
              </div>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-theme-plum transition">
                <PlayCircle className="w-4 h-4 text-emerald-500" /> <span className="text-xs font-bold">Log Session</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-theme-plum transition">
                <Edit3 className="w-4 h-4 text-theme-berry" /> <span className="text-xs font-bold">Add Note</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-theme-plum transition">
                <CheckSquare className="w-4 h-4 text-amber-500" /> <span className="text-xs font-bold">Review Submission</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-theme-plum transition">
                <Star className="w-4 h-4 text-theme-peach" /> <span className="text-xs font-bold">Celebrate Progress</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowQuickActions(!showQuickActions)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-theme-plum/20 transition-all duration-300 ${showQuickActions ? 'bg-theme-berry rotate-45' : 'bg-theme-plum hover:scale-105 hover:bg-theme-berry'}`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
