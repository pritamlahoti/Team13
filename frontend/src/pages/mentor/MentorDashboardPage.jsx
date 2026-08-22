import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import { 
  Users, CalendarDays, CheckSquare, Activity, 
  Sparkles, AlertCircle, TrendingUp, TrendingDown,
  Edit3, PlayCircle, Star, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorDashboardPage() {
  const [mentees, setMentees] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [showQuickNote, setShowQuickNote] = useState(false);

  useEffect(() => {
    async function load() {
      const [m, s, r] = await Promise.all([
        mentorService.getAssignedMentees(),
        mentorService.getUpcomingSessions(),
        mentorService.getPendingReviews()
      ]);
      setMentees(m);
      setSessions(s);
      setReviews(r);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-slate-500 p-8 flex justify-center"><div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin"></div></div>;

  const needsAttentionCount = mentees.filter(m => m.status === 'At Risk').length;
  const overdueReviewsCount = reviews.filter(r => r.priority === 'High Priority').length;
  const todaySessionsCount = sessions.filter(s => s.time.includes('Today')).length;
  
  const spotlightMentee = mentees[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-black text-3xl text-theme-plum">Mentor Command Center</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what needs your attention today, Dr. Smith.</p>
        </div>
        <button 
          onClick={() => setShowQuickNote(true)}
          className="bg-theme-plum text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-theme-berry transition shadow-sm flex items-center gap-2"
        >
          <span className="text-lg leading-none mb-0.5">+</span> Quick Note
        </button>
      </header>

      {/* Top Section: Alerts & Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts / Pay Attention */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur p-5 rounded-2xl border border-theme-plum/10 shadow-sm flex flex-col justify-between group hover:border-rose-300 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle className="w-5 h-5"/></div>
              <span className="text-2xl font-black text-theme-plum">{needsAttentionCount}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-theme-plum">Mentees need attention</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Rohan Patil hasn't scheduled a session.</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur p-5 rounded-2xl border border-theme-plum/10 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><CheckSquare className="w-5 h-5"/></div>
              <span className="text-2xl font-black text-theme-plum">{overdueReviewsCount}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-theme-plum">Reviews are overdue</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Project reviews waiting &gt; 5 days.</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur p-5 rounded-2xl border border-theme-plum/10 shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CalendarDays className="w-5 h-5"/></div>
              <span className="text-2xl font-black text-theme-plum">{todaySessionsCount}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-theme-plum">Sessions today</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Next: Aarav at 10:30 AM.</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur p-5 rounded-2xl border border-theme-plum/10 shadow-sm flex flex-col justify-between group hover:border-theme-peach/50 transition cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-theme-peach/20 text-theme-peach rounded-xl"><Sparkles className="w-5 h-5"/></div>
              <span className="text-2xl font-black text-theme-plum">2</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold text-theme-plum">Strong improvements</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Sneha Gupta +22% progress.</p>
            </div>
          </div>
        </div>

        {/* Today's Mentoring Brief */}
        <div className="bg-theme-plum text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-theme-berry/20 rounded-full blur-2xl"></div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-theme-peach" />
              <span className="text-[10px] font-black uppercase tracking-widest text-theme-peach">Today's Mentoring Brief</span>
            </div>
            <p className="text-sm leading-relaxed text-white/90 font-medium">
              You have {todaySessionsCount} sessions today.<br/><br/>
              <strong className="text-white">2 mentees</strong> are making strong progress.<br/>
              <strong className="text-theme-peach">1 mentee</strong> needs additional guidance.<br/>
              <strong className="text-white">{reviews.length} reviews</strong> are waiting for your attention.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/70 mb-2">Highest-priority session:</p>
            <p className="text-sm font-bold">Rohan Patil — Project Review</p>
            <button className="mt-3 w-full py-2 bg-white text-theme-plum text-xs font-bold rounded-xl hover:bg-slate-100 transition">
              View Today's Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mentee Pulse */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur rounded-2xl border border-theme-plum/10 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-theme-plum">Mentee Pulse</h2>
            <button className="text-xs text-theme-berry font-bold hover:underline">View All Mentees</button>
          </div>
          <div className="space-y-6">
            {mentees.map(m => (
              <div key={m.id} className="space-y-2 group cursor-pointer">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-sm font-bold text-theme-plum">{m.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${
                      m.pulse === 'Strong Momentum' ? 'text-emerald-500' :
                      m.pulse === 'On Track' ? 'text-blue-500' :
                      'text-rose-500'
                    }`}>
                      {m.pulse}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold flex items-center gap-1 ${m.pulseTrend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {m.pulseTrend.includes('+') ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                      {m.pulseTrend}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      m.pulse === 'Strong Momentum' ? 'bg-emerald-400' :
                      m.pulse === 'On Track' ? 'bg-blue-400' :
                      'bg-rose-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentoring Momentum Chart & Toolbox */}
        <div className="space-y-6">
          
          <div className="bg-white/60 backdrop-blur rounded-2xl border border-theme-plum/10 shadow-sm p-6">
            <h2 className="font-display font-bold text-lg text-theme-plum mb-4">Mentoring Momentum</h2>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-theme-plum/10 text-theme-plum rounded text-[10px] font-bold cursor-pointer">Sessions</span>
              <span className="px-2 py-1 bg-transparent text-slate-500 rounded text-[10px] font-bold cursor-pointer hover:bg-slate-50">Reviews</span>
            </div>
            <div className="h-24 flex items-end justify-between gap-1">
              {[2, 5, 4, 7, 8, 3, 5].map((val, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-theme-berry/20 to-theme-peach/40 rounded-t-sm" style={{ height: `${val * 10}%` }}>
                  <div className="w-full bg-theme-berry h-1 rounded-t-sm"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-slate-400 font-bold uppercase">
              <span>Mon</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur rounded-2xl border border-theme-plum/10 shadow-sm p-6">
            <h2 className="font-display font-bold text-lg text-theme-plum mb-4">Mentor Toolbox</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowQuickNote(true)} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-theme-plum">
                <Edit3 className="w-5 h-5 text-theme-berry" />
                <span className="text-[10px] font-bold uppercase">Quick Note</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-theme-plum">
                <PlayCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase">Log Session</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-theme-plum">
                <CheckSquare className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-bold uppercase">Review</span>
              </button>
              <button onClick={() => setShowCelebrate(true)} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-theme-plum">
                <Star className="w-5 h-5 text-theme-peach" />
                <span className="text-[10px] font-bold uppercase">Celebrate</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mentee Spotlight */}
      <div className="bg-gradient-to-r from-theme-plum to-theme-berry rounded-2xl p-[1px] shadow-sm">
        <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-theme-berry to-theme-peach flex items-center justify-center text-white text-xl font-black shadow-inner">
              {spotlightMentee?.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mentee Spotlight</span>
              </div>
              <h3 className="font-display font-black text-xl text-theme-plum mt-0.5">{spotlightMentee?.name}</h3>
              <p className="text-xs text-emerald-600 font-bold">{spotlightMentee?.pulseTrend}</p>
            </div>
          </div>
          <div className="flex-1 px-6 border-l border-slate-100">
            <p className="text-sm italic text-slate-600">"{spotlightMentee?.lastFeedback}"</p>
            <div className="flex gap-4 mt-3">
              <span className="text-xs text-slate-500 font-bold">2 sessions</span>
              <span className="text-xs text-slate-500 font-bold">4 milestones</span>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-theme-plum/5 text-theme-plum hover:bg-theme-plum/10 rounded-xl text-xs font-bold transition">
            View Mentee
          </button>
        </div>
      </div>

      {/* Quick Note Modal */}
      <AnimatePresence>
        {showQuickNote && (
          <div className="fixed inset-0 bg-theme-plum/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="font-display font-bold text-lg text-theme-plum mb-4">Quick Mentor Note</h3>
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 focus:outline-none focus:border-theme-berry">
                <option>Select Mentee...</option>
                {mentees.map(m => <option key={m.id}>{m.name}</option>)}
              </select>
              <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-32 mb-4 focus:outline-none focus:border-theme-berry" placeholder="Write your thought..."></textarea>
              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-theme-berry/10 text-theme-berry text-xs font-bold rounded-full cursor-pointer">Session</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full cursor-pointer">Review</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full cursor-pointer">General</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowQuickNote(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                <button onClick={() => setShowQuickNote(false)} className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs hover:bg-theme-berry transition">Save Note</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebrate Progress Modal */}
      <AnimatePresence>
        {showCelebrate && (
          <div className="fixed inset-0 bg-theme-plum/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl"></div>
              <Star className="w-12 h-12 text-amber-400 fill-amber-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl text-theme-plum mb-2">Celebrate Progress</h3>
              <p className="text-sm text-slate-500 mb-6">Recognize a mentee's hard work to boost their momentum.</p>
              
              <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm mb-4 focus:outline-none focus:border-theme-berry text-left">
                <option>Select Mentee to celebrate...</option>
                {mentees.map(m => <option key={m.id}>{m.name}</option>)}
              </select>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200 cursor-pointer">Consistency</span>
                <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100">Technical Growth</span>
                <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100">Confidence</span>
              </div>
              
              <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 mb-6 focus:outline-none focus:border-theme-berry" placeholder="Add a personal message..."></textarea>

              <div className="flex gap-3">
                <button onClick={() => setShowCelebrate(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                <button onClick={() => setShowCelebrate(false)} className="flex-1 py-3 bg-gradient-to-r from-theme-berry to-theme-peach text-white font-bold rounded-xl text-xs shadow-md">Send Recognition</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
