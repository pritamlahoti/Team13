import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import { 
  Users, ChevronRight, Activity, TrendingUp, TrendingDown,
  BrainCircuit, Compass, MessageSquare, Target, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorMenteesPage() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentee, setSelectedMentee] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await mentorService.getAssignedMentees();
      setMentees(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-center p-8"><div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-black font-display text-theme-plum">My Mentees</h1>
        <p className="text-slate-500">Manage and view detailed progress for all mentees assigned to you.</p>
      </header>
      
      {/* List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees.map(mentee => (
          <div 
            key={mentee.id}
            onClick={() => setSelectedMentee(mentee)}
            className="bg-white/60 backdrop-blur p-6 rounded-2xl border border-theme-plum/10 shadow-sm hover:shadow-md transition cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-theme-plum/10 flex items-center justify-center text-theme-plum font-black text-lg group-hover:bg-theme-berry group-hover:text-white transition">
                {mentee.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-theme-plum text-lg leading-tight">{mentee.name}</h3>
                <span className={`text-[10px] font-bold uppercase ${mentee.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {mentee.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-semibold">{mentee.task}</span>
                  <span className="text-theme-plum font-bold">{mentee.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-plum rounded-full" style={{ width: `${mentee.progress}%` }}></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className={`text-xs font-bold flex items-center gap-1 ${mentee.pulseTrend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {mentee.pulseTrend.includes('+') ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                  {mentee.pulse}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-theme-berry transition" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Overlay / Modal */}
      <AnimatePresence>
        {selectedMentee && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#fdf8f5] w-full max-w-5xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-theme-plum/10 bg-white/80 backdrop-blur flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-theme-berry to-theme-peach flex items-center justify-center text-white font-black text-xl shadow-inner">
                    {selectedMentee.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-theme-plum">{selectedMentee.name}</h2>
                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedMentee.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {selectedMentee.task}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white text-theme-plum border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition">Log Session</button>
                  <button onClick={() => setSelectedMentee(null)} className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition">Close</button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8">
                
                {/* Top Banner - Next Best Action */}
                <div className="mb-8 bg-gradient-to-r from-theme-berry/10 to-theme-peach/10 border border-theme-berry/20 rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-theme-berry tracking-widest flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3" /> Next Best Action
                    </h4>
                    <p className="font-bold text-theme-plum text-lg">{selectedMentee.nextBestAction}</p>
                  </div>
                  <button className="px-5 py-2.5 bg-theme-berry text-white rounded-xl text-xs font-bold hover:bg-theme-plum transition shadow-md shadow-theme-berry/20">
                    Take Action
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Mentor Memory */}
                    <section className="bg-white rounded-2xl border border-theme-plum/5 p-6 shadow-sm">
                      <h3 className="font-display font-bold text-lg text-theme-plum mb-4 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-500" /> Mentor Memory
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Last Discussed</span>
                          <p className="text-sm text-theme-plum font-semibold mt-1">{selectedMentee.memory?.lastDiscussed}</p>
                        </div>
                        <div className="p-4 bg-rose-50/50 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Previous Concern</span>
                          <p className="text-sm text-theme-plum font-semibold mt-1">{selectedMentee.memory?.previousConcern}</p>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Agreed Action</span>
                          <p className="text-sm text-theme-plum font-semibold mt-1">{selectedMentee.memory?.agreedAction}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Next Checkpoint</span>
                          <p className="text-sm text-theme-plum font-semibold mt-1">{selectedMentee.memory?.nextCheckpoint}</p>
                        </div>
                      </div>
                    </section>

                    {/* Mentoring Progress Indicators (Radar Alternative) */}
                    <section className="bg-white rounded-2xl border border-theme-plum/5 p-6 shadow-sm">
                      <h3 className="font-display font-bold text-lg text-theme-plum mb-4 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-teal-500" /> Mentoring Progress Indicators
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Technical Skills', val: selectedMentee.radar?.tech, color: 'bg-indigo-500' },
                          { label: 'Communication', val: selectedMentee.radar?.comm, color: 'bg-theme-peach' },
                          { label: 'Problem Solving', val: selectedMentee.radar?.problem, color: 'bg-emerald-500' },
                          { label: 'Project Execution', val: selectedMentee.radar?.project, color: 'bg-blue-500' },
                          { label: 'Career Readiness', val: selectedMentee.radar?.career, color: 'bg-theme-berry' }
                        ].map(ind => (
                          <div key={ind.label}>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>{ind.label}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full flex gap-1">
                               {/* Segmented bar for visual interest */}
                               {[...Array(10)].map((_, i) => (
                                 <div 
                                   key={i} 
                                   className={`h-full flex-1 rounded-sm ${i * 10 < ind.val ? ind.color : 'bg-transparent'}`} 
                                 />
                               ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    
                    {/* Mentoring Journey Timeline */}
                    <section className="bg-white rounded-2xl border border-theme-plum/5 p-6 shadow-sm">
                      <h3 className="font-display font-bold text-lg text-theme-plum mb-6">Mentoring Journey</h3>
                      <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                        {selectedMentee.journey?.map((item, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-0 bg-white">
                              {idx === selectedMentee.journey.length - 1 ? 
                                <Circle className="w-4 h-4 text-theme-berry animate-pulse" /> :
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              }
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400">{item.date}</p>
                              <p className="text-sm font-bold text-theme-plum mt-0.5">{item.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
