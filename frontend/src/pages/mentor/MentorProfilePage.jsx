import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import { 
  Star, Flame, Award, Map, Calendar, Settings, 
  MessageCircle, Target, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function MentorProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Local state for interactive availability grid
  // Rows: 10AM to 3PM, Cols: Mon to Fri
  const [availability, setAvailability] = useState(
    Array(6).fill(null).map(() => Array(5).fill(false))
  );

  // Mock initial setup for visual interest
  useEffect(() => {
    async function load() {
      const data = await mentorService.getMentorStats();
      setStats(data);
      
      // Seed some availability
      const initialGrid = Array(6).fill(null).map(() => Array(5).fill(false));
      initialGrid[0][0] = true; initialGrid[0][1] = true; initialGrid[0][3] = true;
      initialGrid[1][0] = true; initialGrid[1][1] = true;
      initialGrid[3][1] = true; initialGrid[3][2] = true; initialGrid[3][3] = true;
      initialGrid[5][0] = true; initialGrid[5][1] = true; initialGrid[5][2] = true; initialGrid[5][3] = true;
      setAvailability(initialGrid);
      
      setLoading(false);
    }
    load();
  }, []);

  const toggleAvailability = (r, c) => {
    const newAvail = [...availability];
    newAvail[r][c] = !newAvail[r][c];
    setAvailability(newAvail);
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'];

  if (loading) return <div className="text-center p-8"><div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-theme-plum">Mentor Profile</h1>
          <p className="text-slate-500">Manage your brand, availability, and view your impact.</p>
        </div>
        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-theme-plum hover:bg-slate-50 transition shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Impact & Stats */}
        <div className="space-y-8">
          
          {/* Mentor Impact */}
          <div className="bg-gradient-to-br from-theme-plum to-theme-berry rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-xl flex items-center gap-2">
                <Star className="w-6 h-6 text-theme-peach fill-theme-peach" /> Mentor Impact
              </h2>
              <div className="text-3xl font-black">{stats.impactScore} <span className="text-sm text-white/60 font-bold">/ 5</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div>
                <span className="text-2xl font-black">{stats.sessions}</span>
                <span className="block text-[10px] uppercase font-bold text-white/70 tracking-widest mt-1">Sessions</span>
              </div>
              <div>
                <span className="text-2xl font-black">{stats.feedbackCycles}</span>
                <span className="block text-[10px] uppercase font-bold text-white/70 tracking-widest mt-1">Feedback</span>
              </div>
              <div>
                <span className="text-2xl font-black">{stats.mentees}</span>
                <span className="block text-[10px] uppercase font-bold text-white/70 tracking-widest mt-1">Mentees</span>
              </div>
              <div>
                <span className="text-2xl font-black">{stats.reviews}</span>
                <span className="block text-[10px] uppercase font-bold text-white/70 tracking-widest mt-1">Reviews</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <span className="block text-[10px] uppercase font-bold text-white/70 tracking-widest border-b border-white/20 pb-2 mb-4">Activity Insights</span>
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Mentee Progress</span><span>{stats.menteeProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-peach rounded-full" style={{ width: `${stats.menteeProgress}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Feedback Response</span><span>{stats.feedbackResponse}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-peach rounded-full" style={{ width: `${stats.feedbackResponse}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Session Consistency</span><span>{stats.sessionConsistency}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-peach rounded-full" style={{ width: `${stats.sessionConsistency}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mentor Consistency / Streak */}
          <div className="bg-white rounded-3xl p-6 border border-theme-plum/10 shadow-sm flex items-center gap-6 group hover:border-amber-300 transition">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
              <Flame className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-xl text-theme-plum">{stats.streak} Day Mentoring Streak</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                You've completed at least one mentoring action (session, review, feedback) for {stats.streak} consecutive days.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Brand, Badges, Availability */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Branding */}
            <div className="bg-white rounded-3xl p-6 border border-theme-plum/10 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-theme-plum mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" /> Mentor Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">System Architecture</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">React / Next.js</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">Career Guidance</span>
                  <span className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer">+ Add</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-display font-bold text-lg text-theme-plum mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" /> Mentoring Philosophy
                </h3>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-theme-plum font-semibold italic focus:outline-none focus:border-theme-berry"
                  defaultValue="I believe the best mentoring happens when students learn to solve problems themselves rather than simply receiving answers."
                  rows={4}
                ></textarea>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-theme-plum mb-3 flex items-center gap-2">
                  <Map className="w-5 h-5 text-theme-peach" /> Preferred Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Structured', 'Collaborative', 'Hands-on', 'Discussion-based'].map(style => (
                    <button 
                      key={style}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-left ${style === 'Collaborative' ? 'bg-theme-plum text-white border-theme-plum' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                      {style === 'Collaborative' ? '● ' : '○ '} {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mentor Milestones & Availability */}
            <div className="space-y-8">
              
              {/* Milestones */}
              <div className="bg-white rounded-3xl p-6 border border-theme-plum/10 shadow-sm">
                <h3 className="font-display font-bold text-lg text-theme-plum mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Mentor Milestones
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '🏆', title: 'First 10 Sessions', desc: 'Completed' },
                    { icon: '🎯', title: '25 Mentees Guided', desc: 'Completed' },
                    { icon: '💬', title: '50 Feedback Cycles', desc: 'Completed' },
                    { icon: '🌱', title: '10 Mentees Completed Goals', desc: 'In Progress (8/10)' }
                  ].map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-theme-plum text-sm">{badge.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Grid */}
              <div className="bg-white rounded-3xl p-6 border border-theme-plum/10 shadow-sm">
                <h3 className="font-display font-bold text-lg text-theme-plum mb-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" /> Weekly Availability
                </h3>
                <p className="text-xs text-slate-500 mb-4">Click slots to toggle when mentees can book you.</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr>
                        <th className="p-2"></th>
                        {days.map(d => <th key={d} className="p-2 font-bold text-slate-400 uppercase">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {times.map((t, rIdx) => (
                        <tr key={t}>
                          <td className="p-2 font-bold text-slate-400 text-[10px] whitespace-nowrap text-right">{t}</td>
                          {days.map((_, cIdx) => (
                            <td key={cIdx} className="p-1">
                              <button 
                                onClick={() => toggleAvailability(rIdx, cIdx)}
                                className={`w-full h-8 rounded-md transition border ${availability[rIdx][cIdx] ? 'bg-theme-berry border-theme-berry' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                              >
                                {availability[rIdx][cIdx] && <div className="w-2 h-2 rounded-full bg-white mx-auto"></div>}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
