import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import { CalendarDays, PlayCircle, CheckSquare, Clock, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States: 'list', 'prepare', 'session', 'wrapup'
  const [viewState, setViewState] = useState('list');
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTimer, setSessionTimer] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await mentorService.getUpcomingSessions();
      setSessions(data);
      setLoading(false);
    }
    load();
  }, []);

  // Timer logic for session mode
  useEffect(() => {
    let interval;
    if (viewState === 'session') {
      interval = setInterval(() => {
        setSessionTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [viewState]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePrepare = (session) => {
    setActiveSession(session);
    setViewState('prepare');
  };

  if (loading) return <div className="text-center p-8"><div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      
      {viewState === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <header className="mb-8">
            <h1 className="text-3xl font-black font-display text-theme-plum">Mentoring Sessions</h1>
            <p className="text-slate-500">Prepare for and conduct your upcoming mentoring sessions.</p>
          </header>

          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="bg-white/60 backdrop-blur p-12 rounded-2xl border border-theme-plum/10 text-center">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-theme-plum">No sessions found.</h3>
                <p className="text-slate-500">Your mentoring calendar is clear. That's a good thing.</p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="bg-white/60 backdrop-blur p-6 rounded-2xl border border-theme-plum/10 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-theme-plum/5 rounded-xl flex flex-col items-center justify-center text-theme-plum">
                      <CalendarDays className="w-5 h-5 mb-0.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-theme-plum text-lg">{session.studentName}</h3>
                      <p className="text-sm font-semibold text-slate-500">{session.time} • {session.task}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePrepare(session)}
                    className="px-5 py-2.5 bg-theme-plum text-white rounded-xl text-xs font-bold hover:bg-theme-berry transition shadow-sm flex items-center gap-2"
                  >
                    Prepare <PlayCircle className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {viewState === 'prepare' && activeSession && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <button onClick={() => setViewState('list')} className="text-xs font-bold text-slate-500 hover:text-theme-plum flex items-center gap-1 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Sessions
          </button>
          
          <div className="bg-white/80 backdrop-blur rounded-3xl border border-theme-plum/10 shadow-lg overflow-hidden">
            <div className="p-8 border-b border-theme-plum/10 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-theme-berry tracking-widest mb-1">Session Preparation</h4>
                <h2 className="text-2xl font-black font-display text-theme-plum">{activeSession.studentName}</h2>
                <p className="text-sm font-semibold text-slate-500 mt-1">{activeSession.task}</p>
              </div>
              <button 
                onClick={() => { setViewState('session'); setSessionTimer(0); }}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition shadow-md flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" /> Start Session
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-theme-plum mb-4">Today's Goal</h3>
                <div className="p-4 bg-theme-plum/5 rounded-xl border border-theme-plum/10 text-theme-plum font-semibold">
                  {activeSession.task} Architecture Review
                </div>
                
                <h3 className="font-bold text-theme-plum mt-8 mb-4">Suggested Discussion Points</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-slate-600"><CheckSquare className="w-5 h-5 text-theme-peach flex-shrink-0" /> Review project architecture decisions</li>
                  <li className="flex gap-3 text-sm text-slate-600"><CheckSquare className="w-5 h-5 text-theme-peach flex-shrink-0" /> Discuss API error handling approach</li>
                  <li className="flex gap-3 text-sm text-slate-600"><CheckSquare className="w-5 h-5 text-theme-peach flex-shrink-0" /> Check progress on milestone 2</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-theme-plum mb-4">Context</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Last Session</span>
                    <p className="text-sm text-theme-plum font-semibold mt-1">Discussed API design and data models.</p>
                  </div>
                  <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-rose-400 font-bold uppercase">Open Action Items</span>
                    <p className="text-sm text-rose-700 font-bold mt-1">2 items pending from {activeSession.studentName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {viewState === 'session' && activeSession && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 bg-[#fdf8f5] flex flex-col">
          {/* Header */}
          <div className="px-8 py-4 bg-theme-plum text-white flex justify-between items-center shadow-md">
            <div>
              <h2 className="text-lg font-black font-display">{activeSession.studentName}</h2>
              <p className="text-xs text-white/70">{activeSession.task}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg font-mono font-bold text-xl">
                <Clock className="w-5 h-5 text-theme-peach" />
                {formatTime(sessionTimer)}
              </div>
              <button 
                onClick={() => setViewState('wrapup')}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition"
              >
                End Session
              </button>
            </div>
          </div>
          
          {/* Workspace */}
          <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
                <h3 className="font-bold text-theme-plum mb-4">Quick Notes</h3>
                <textarea 
                  className="flex-1 w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-theme-peach resize-none"
                  placeholder="Type notes here during the session..."
                ></textarea>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-theme-plum mb-4">Today's Goals</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-theme-berry" /> <span className="text-sm">Review architecture</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-theme-berry" /> <span className="text-sm">Discuss API design</span>
                  </label>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-theme-plum mb-4">New Action Items</h3>
                <input type="text" placeholder="+ Add action item and press Enter" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-theme-berry" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {viewState === 'wrapup' && activeSession && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-theme-plum/10 mt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black font-display text-theme-plum">Session Completed</h2>
            <p className="text-sm text-slate-500 font-bold mt-2">Duration: {formatTime(sessionTimer)} min</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-theme-plum mb-2">What was achieved?</label>
              <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 focus:outline-none focus:border-theme-berry"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-plum mb-2">What should the mentee do next?</label>
              <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 focus:outline-none focus:border-theme-berry"></textarea>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-theme-plum">Does this mentee need follow-up?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="followup" className="accent-theme-berry"/> Yes</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="followup" defaultChecked className="accent-theme-berry"/> No</label>
              </div>
            </div>
            <button 
              onClick={() => { setViewState('list'); setSessionTimer(0); setActiveSession(null); }}
              className="w-full py-4 bg-theme-plum text-white font-bold rounded-xl hover:bg-theme-berry transition shadow-lg flex justify-center items-center gap-2"
            >
              <Send className="w-4 h-4" /> Save Session & Follow-up
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
