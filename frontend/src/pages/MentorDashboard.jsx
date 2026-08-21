import { useState, useEffect } from 'react';
import {
  Check,
  X,
  Sparkles,
  ClipboardList,
  PlusCircle,
  TrendingUp,
  Bot,
  CheckCircle2,
  AlertCircle,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { learningService } from '../services/learningService';
import { useAuth } from '../hooks/useAuth';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('QUEUE'); // QUEUE, CREATE, REPORTS
  const [selectedSub, setSelectedSub] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [xpToAward, setXpToAward] = useState(100);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [toast, setToast] = useState(null);

  // Activity Creator State
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    reward: 100,
    type: 'project',
    classification: 'mandatory',
    dueDate: ''
  });

  const refreshSubmissions = async () => {
    try {
      const data = await learningService.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to refresh submissions', err);
    }
  };

  useEffect(() => {
    let active = true;
    learningService.getSubmissions()
      .then(data => {
        if (active) {
          setSubmissions(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load submissions', err);
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectSub = (sub) => {
    setSelectedSub(sub);
    setFeedback('');
    setXpToAward(sub.xpAwarded || 100);
  };

  const handleGenerateAiFeedback = async () => {
    setAiDrafting(true);
    try {
      const draft = await learningService.draftAiFeedback(selectedSub.id);
      setFeedback(draft);
    } catch (err) {
      console.warn('AI feedback draft failed, using fallback suggestion', err);
      setFeedback(`AI Coach Nova: Review "${selectedSub.moduleTitle}" and confirm the XP award before approving.`);
    } finally {
      setAiDrafting(false);
    }
  };

  const handleReviewSubmit = async (outcome = 'approved') => {
    if (!feedback.trim()) {
      showToast({ type: 'error', message: 'Please write review feedback before submitting.' });
      return;
    }

    try {
      await learningService.reviewSubmission(selectedSub.id, feedback, xpToAward, outcome);
      setSelectedSub(null);
      await refreshSubmissions();
      showToast({ 
        type: 'success', 
        message: `Approved ${selectedSub.userName}'s work. Awarded +${xpToAward} XP!` 
      });
    } catch (err) {
      console.error('Review submission error:', err);
      showToast({ type: 'error', message: 'Could not submit review. Please try again.' });
    }
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    if (!newQuest.title.trim()) {
      showToast({ type: 'error', message: 'Please enter a quest title.' });
      return;
    }

    try {
      await learningService.createModule(newQuest);
      setNewQuest({
        title: '',
        description: '',
        reward: 100,
        type: 'project',
        classification: 'mandatory',
        dueDate: ''
      });
      showToast({ type: 'success', message: 'New Learning Quest launched successfully!' });
      await refreshSubmissions();
    } catch (err) {
      console.error('Create quest error:', err);
      showToast({ type: 'error', message: 'Launch failed. Try again.' });
    }
  };

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => setToast(null), 4000);
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status === 'reviewed');

  if (user?.role !== 'KATALYST_MANAGEMENT') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-theme-plum">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md font-sans">
          Only program mentors can review submissions here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-xs font-bold font-sans">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-theme-berry animate-pulse" />
            <span className="text-xs font-bold font-display uppercase tracking-widest text-theme-berry">
              Coach Panel
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-theme-plum mt-1">
            Mentor Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review scholar outcomes, launch custom learning quests, and view cohort metrics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-theme-plum/5 p-1 rounded-xl shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'QUEUE' 
                ? 'bg-theme-plum text-white shadow-sm' 
                : 'text-theme-plum/70 hover:bg-white/40'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Review Queue ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('CREATE')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'CREATE' 
                ? 'bg-theme-plum text-white shadow-sm' 
                : 'text-theme-plum/70 hover:bg-white/40'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Create Quest
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
              activeTab === 'REPORTS' 
                ? 'bg-theme-plum text-white shadow-sm' 
                : 'text-theme-plum/70 hover:bg-white/40'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Cohort Reports
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-lg text-theme-plum">Submissions Awaiting Grading</h2>
          
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white/40 rounded-2xl border border-theme-plum/5">
              <div className="w-8 h-8 rounded-full border-2 border-theme-berry border-t-transparent animate-spin"></div>
              <p className="text-xs text-slate-500 font-sans">Syncing review desk...</p>
            </div>
          ) : pendingSubmissions.length === 0 ? (
            <div className="p-12 text-center bg-white/40 rounded-2xl border border-theme-plum/5">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-theme-plum font-sans">Queue fully cleared!</p>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">All scholar submissions have been graded and rewarded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingSubmissions.map((sub) => (
                <div 
                  key={sub.id} 
                  onClick={() => handleSelectSub(sub)}
                  className="glass-panel p-5 rounded-2xl hover:border-theme-berry/30 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-sans tracking-wide">
                          {sub.moduleType} · pending review
                        </span>
                        <h3 className="font-display font-bold text-sm text-theme-plum mt-0.5">
                          {sub.moduleTitle}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-theme-berry/10 text-theme-berry text-[9px] font-black uppercase">
                        Pending
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-3 bg-white/40 p-3 rounded-xl border border-theme-plum/5 font-sans leading-relaxed">
                      "{sub.contentRef}"
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-theme-plum/5 pt-3">
                    <span className="font-bold text-theme-plum flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-theme-berry/10 flex items-center justify-center text-[8px] text-theme-berry font-bold">
                        {sub.userName[0]}
                      </div>
                      {sub.userName}
                    </span>
                    <span>{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submission Review Modal */}
          {selectedSub && (
            <>
              <div 
                className="fixed inset-0 bg-theme-plum/20 backdrop-blur-xs z-50 cursor-pointer"
                onClick={() => setSelectedSub(null)}
              />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white p-6 md:p-8 rounded-3xl border border-theme-plum/10 shadow-2xl z-50 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-theme-berry uppercase tracking-widest font-sans">
                      Grade Submission
                    </span>
                    <h2 className="font-display font-black text-xl text-theme-plum leading-tight mt-0.5">
                      {selectedSub.moduleTitle}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedSub(null)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Submissions text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-theme-plum/60 tracking-wider uppercase">
                    Scholar's Outcome: {selectedSub.userName}
                  </label>
                  <div className="text-xs text-theme-plum bg-slate-50 p-4 rounded-2xl border border-theme-plum/5 font-sans leading-relaxed max-h-40 overflow-y-auto">
                    {selectedSub.contentRef}
                  </div>
                </div>

                {/* Feedback Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-theme-plum/60 tracking-wider uppercase">
                      Coach Feedback
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAiFeedback}
                      disabled={aiDrafting}
                      className="text-[10px] text-theme-berry hover:text-theme-plum font-bold font-sans flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      {aiDrafting ? 'Drafting feedback...' : 'Draft AI Feedback'}
                    </button>
                  </div>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter actionable feedback comments..."
                    className="w-full h-24 p-3 bg-white border border-theme-plum/10 rounded-xl text-xs text-theme-plum focus:outline-none focus:border-theme-berry font-sans"
                  />
                </div>

                {/* Score slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-theme-plum font-sans">
                    <span>XP Score Value</span>
                    <span className="text-theme-berry">+{xpToAward} XP</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="10"
                    value={xpToAward}
                    onChange={(e) => setXpToAward(parseInt(e.target.value))}
                    className="w-full accent-theme-berry cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-500 border border-theme-plum/10 font-bold rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReviewSubmit('approved')}
                    className="flex-1 py-3 bg-theme-plum hover:bg-theme-berry text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve and Award XP</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Already graded overview */}
          {reviewedSubmissions.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="font-display font-bold text-sm text-theme-plum">Recently Graded</h3>
              <div className="overflow-hidden border border-theme-plum/5 rounded-2xl bg-white/40">
                <table className="w-full text-left border-collapse text-xs font-sans text-theme-plum">
                  <thead>
                    <tr className="bg-theme-plum/5 font-bold border-b border-theme-plum/5">
                      <th className="py-2.5 px-4">Scholar</th>
                      <th className="py-2.5 px-4">Quest</th>
                      <th className="py-2.5 px-4">Score</th>
                      <th className="py-2.5 px-4">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-plum/5">
                    {reviewedSubmissions.map(r => (
                      <tr key={r.id}>
                        <td className="py-2.5 px-4 font-bold">{r.userName}</td>
                        <td className="py-2.5 px-4">{r.moduleTitle}</td>
                        <td className="py-2.5 px-4 text-emerald-600 font-bold">+{r.xpAwarded} XP</td>
                        <td className="py-2.5 px-4 text-slate-500 truncate max-w-[200px]">"{r.feedbackText}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'CREATE' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-theme-berry" />
            <h2 className="font-display font-black text-xl text-theme-plum">Create Learning Quest</h2>
          </div>

          <form onSubmit={handleCreateQuest} className="space-y-5 text-xs text-theme-plum font-sans">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Quest Title</label>
              <input
                type="text"
                required
                value={newQuest.title}
                onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                placeholder="e.g. AI-900 Core concepts revision module"
                className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Requirements / Brief</label>
              <textarea
                value={newQuest.description}
                onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                placeholder="Specify requirements and brief deliverables scholars need to upload..."
                className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all h-24 text-xs"
              />
            </div>

            {/* XP Value & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Quest XP Reward</label>
                <input
                  type="number"
                  required
                  value={newQuest.reward}
                  onChange={(e) => setNewQuest({ ...newQuest, reward: parseInt(e.target.value) })}
                  className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Activity Format</label>
                <select
                  value={newQuest.type}
                  onChange={(e) => setNewQuest({ ...newQuest, type: e.target.value })}
                  className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs font-semibold appearance-none"
                >
                  <option value="course">Curriculum Course Module</option>
                  <option value="project">Capstone Project Node</option>
                  <option value="mentoring">Coaching / Mentor Checkpoint</option>
                  <option value="milestone">Program Milestone Challenge</option>
                </select>
              </div>
            </div>

            {/* Classification & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Requirement Level</label>
                <select
                  value={newQuest.classification}
                  onChange={(e) => setNewQuest({ ...newQuest, classification: e.target.value })}
                  className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs font-semibold appearance-none"
                >
                  <option value="mandatory">Mandatory Quest (Due Date)</option>
                  <option value="optional">Optional / Sandbox Quest</option>
                  <option value="certificate">Certification Milestone</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase tracking-wider text-[10px] text-theme-plum/70">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newQuest.dueDate}
                  onChange={(e) => setNewQuest({ ...newQuest, dueDate: e.target.value })}
                  className="p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-theme-plum hover:bg-theme-berry text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <Layers className="w-4 h-4" />
              Launch Learning Quest
            </button>
          </form>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Scholar Completion Rate</span>
              <h3 className="font-display font-black text-2xl text-theme-plum mt-1">84.2%</h3>
              <p className="text-[9px] text-emerald-600 mt-1">▲ +3.1% vs last month</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Active Weekly Engagement</span>
              <h3 className="font-display font-black text-2xl text-theme-plum mt-1">92.6%</h3>
              <p className="text-[9px] text-emerald-600 mt-1">▲ +1.5% vs last month</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Avg. Scholar XP Score</span>
              <h3 className="font-display font-black text-2xl text-theme-plum mt-1">3,230 XP</h3>
              <p className="text-[9px] text-slate-500 mt-1">Cohort target: 3,000 XP</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center border-b border-theme-plum/5 pb-4 mb-4">
              <h3 className="font-display font-bold text-sm text-theme-plum">Platform Participation Trend</h3>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] text-emerald-700 font-bold border border-emerald-100">AI Modules (94%)</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-[10px] text-purple-700 font-bold border border-purple-100">Mentoring (76%)</span>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between pt-4 px-2">
              {[
                { label: 'Week 1', val: 68 },
                { label: 'Week 2', val: 74 },
                { label: 'Week 3', val: 82 },
                { label: 'Week 4', val: 78 },
                { label: 'Week 5', val: 89 },
                { label: 'Week 6', val: 94 }
              ].map(bar => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-8 bg-gradient-to-t from-theme-berry via-theme-peach to-theme-cream rounded-t-lg transition-all duration-500" style={{ height: `${bar.val}%` }}></div>
                  <span className="text-[9px] font-bold text-slate-400">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
