import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import { 
  CheckSquare, AlertCircle, Clock, Send, 
  MessageSquare, ChevronRight, BrainCircuit, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MentorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  // Feedback Builder State
  const [fbTech, setFbTech] = useState('Developing');
  const [fbComm, setFbComm] = useState('Developing');
  const [fbProb, setFbProb] = useState('Developing');
  const [fbStrength, setFbStrength] = useState('');
  const [fbImprove, setFbImprove] = useState('');
  const [fbNext, setFbNext] = useState('');

  const quickChips = [
    "Strong improvement", "Good initiative", "Needs more practice",
    "Excellent consistency", "Ask better questions", "Apply concepts practically"
  ];

  useEffect(() => {
    async function load() {
      const data = await mentorService.getPendingReviews();
      setReviews(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleChipClick = (chip) => {
    setFbStrength(prev => prev ? `${prev}, ${chip}` : chip);
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High Priority') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (priority === 'Medium Priority') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  if (loading) return <div className="text-center p-8"><div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black font-display text-theme-plum">Pending Reviews</h1>
        <p className="text-slate-500">Review student submissions, provide structured feedback, and track impact.</p>
      </header>
      
      {/* Smart Review List */}
      {!selectedReview ? (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white/60 backdrop-blur p-12 rounded-2xl border border-theme-plum/10 text-center">
              <span className="text-4xl block mb-4">🎉</span>
              <h3 className="text-lg font-bold text-theme-plum">You're all caught up!</h3>
              <p className="text-slate-500">No mentoring submissions require your attention.</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-white/60 backdrop-blur p-6 rounded-2xl border border-theme-plum/10 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {review.priority === 'High Priority' && <AlertCircle className="w-6 h-6 text-rose-500" />}
                    {review.priority === 'Medium Priority' && <Clock className="w-6 h-6 text-amber-500" />}
                    {review.priority === 'Normal' && <CheckSquare className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-theme-plum text-lg">{review.studentName}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(review.priority)}`}>
                        {review.priority}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">{review.task} • {review.submissionDate}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReview(review)}
                  className="px-5 py-2.5 bg-theme-plum text-white rounded-xl text-xs font-bold hover:bg-theme-berry transition shadow-sm"
                >
                  Start Review
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Feedback Builder View */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setSelectedReview(null)} className="p-2 bg-white rounded-xl hover:bg-slate-50 text-slate-500 shadow-sm border border-slate-200">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-black font-display text-theme-plum">Reviewing {selectedReview.studentName}</h2>
                <p className="text-sm font-bold text-slate-500">{selectedReview.task}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-theme-plum/10 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-theme-plum to-theme-berry p-4">
                <h3 className="font-bold text-white flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Feedback Builder</h3>
              </div>
              <div className="p-6 space-y-8">
                
                {/* Dimensions */}
                <div className="space-y-6">
                  {[
                    { label: 'Technical Understanding', state: fbTech, setter: setFbTech },
                    { label: 'Communication', state: fbComm, setter: setFbComm },
                    { label: 'Problem Solving', state: fbProb, setter: setFbProb }
                  ].map(dim => (
                    <div key={dim.label}>
                      <span className="block text-xs font-bold text-theme-plum mb-3">{dim.label}</span>
                      <div className="flex gap-2">
                        {['Needs Work', 'Developing', 'Strong', 'Excellent'].map(lvl => (
                          <button 
                            key={lvl}
                            onClick={() => dim.setter(lvl)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${dim.state === lvl ? 'bg-theme-plum text-white border-theme-plum' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Chips */}
                <div>
                  <span className="block text-xs font-bold text-theme-plum mb-3">Quick Inserts</span>
                  <div className="flex flex-wrap gap-2">
                    {quickChips.map(chip => (
                      <button 
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="px-3 py-1.5 bg-theme-plum/5 text-theme-plum border border-theme-plum/10 rounded-full text-[10px] font-bold hover:bg-theme-plum/10 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Areas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Key Strength</label>
                    <textarea value={fbStrength} onChange={e => setFbStrength(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:border-theme-berry"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Area to Improve</label>
                    <textarea value={fbImprove} onChange={e => setFbImprove(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:border-theme-berry"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Recommended Next Step</label>
                    <textarea value={fbNext} onChange={e => setFbNext(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-20 focus:outline-none focus:border-theme-berry"></textarea>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedReview(null)}
                  className="w-full py-4 bg-theme-plum text-white font-bold rounded-xl hover:bg-theme-berry transition shadow-lg flex justify-center items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Context & Impact */}
          <div className="space-y-6 pt-16">
            
            {/* Feedback Impact Component */}
            <div className="bg-white rounded-2xl border border-theme-plum/10 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl"></div>
              <h3 className="font-display font-bold text-lg text-theme-plum mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> Feedback Impact
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Your Last Feedback</span>
                  <p className="text-sm text-theme-plum font-semibold italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{selectedReview.previousFeedback}"
                  </p>
                </div>
                
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Mentee Response</span>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs font-bold text-emerald-600"><CheckSquare className="w-4 h-4" /> Addressed feedback in code</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-4 h-4 border-2 border-slate-300 rounded flex-shrink-0" /> Optional challenge pending</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Progress since feedback</span>
                  <div className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-5 h-5" /> +18%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-theme-peach/10 rounded-2xl p-6 border border-theme-peach/20">
              <h4 className="text-xs font-bold text-theme-plum mb-2">Review Guidelines</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aim to be constructive. Use the Feedback Builder to ensure a balanced review that touches on technical execution as well as soft skills like communication.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
