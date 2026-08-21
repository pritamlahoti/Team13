import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Rocket, Target, Clock3, Users, Play, Check, Send, X, Sparkles, Video } from 'lucide-react';
import { learningService } from '../services/learningService';

const DEFAULT_CHALLENGES = [
  {
    id: "ai-bootcamp-3",
    title: "Module 3: Neural Networks Sandbox",
    category: "bootcamp",
    description: "Build a single layer neuron simulation to classify logical AND/OR operations.",
    reward: "120 XP",
    rewardXP: 120,
    duration: "45 mins",
    difficulty: "Intermediate",
    icon: Code,
    badge: "Sandbox",
    progress: 40
  },
  {
    id: "project-canvas",
    title: "Katalyst Canvas Scope Brief",
    category: "projects",
    description: "Produce a visual diagram map showing how your proposed AI agents communicate.",
    reward: "200 XP",
    rewardXP: 200,
    duration: "90 mins",
    difficulty: "Advanced",
    icon: Rocket,
    badge: "Project",
    progress: 0
  },
  {
    id: "mentoring-question",
    title: "Mentor Session: Scope Alignment",
    category: "mentoring",
    description: "Submit 2 prepared scope constraints to discuss with your mentor this Thursday.",
    reward: "80 XP",
    rewardXP: 80,
    duration: "20 mins",
    difficulty: "Beginner",
    icon: Users,
    badge: "Q&A Setup",
    progress: 100
  },
  {
    id: "ai-bootcamp-4",
    title: "Module 4: Transformer Architecture",
    category: "bootcamp",
    description: "Explore the self-attention mechanism and write attention weights calculation.",
    reward: "150 XP",
    rewardXP: 150,
    duration: "60 mins",
    difficulty: "Advanced",
    icon: Code,
    badge: "Sandbox",
    progress: 0
  }
];

export default function Challenges() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [challenges, setChallenges] = useState(DEFAULT_CHALLENGES);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedModules, submissions] = await Promise.all([
          learningService.getQuests(),
          learningService.getSubmissions()
        ]);

        const completedSet = new Set(
          (submissions || [])
            .filter(s => s.status === 'scored' || s.status === 'reviewed' || s.status === 'completed' || s.status === 'pending')
            .map(s => s.moduleId)
        );

        if (fetchedModules && fetchedModules.length > 0) {
          const apiChallenges = fetchedModules.map(m => ({
            id: m.id,
            title: m.title,
            category: m.type || m.classification || 'bootcamp',
            description: m.description || 'Complete this learning quest to gain XP.',
            reward: `${m.reward || 100} XP`,
            rewardXP: m.reward || 100,
            duration: m.dueDate ? `Due ${new Date(m.dueDate).toLocaleDateString()}` : '30 mins',
            difficulty: m.classification || 'Intermediate',
            icon: m.type === 'project' ? Rocket : Code,
            badge: m.type ? m.type.toUpperCase() : 'QUEST',
            progress: completedSet.has(m.id) ? 100 : 0
          }));
          setChallenges(apiChallenges);
        } else {
          // Merge completed status onto defaults
          setChallenges(prev => prev.map(c => ({
            ...c,
            progress: completedSet.has(c.id) ? 100 : c.progress
          })));
        }
      } catch (err) {
        console.warn('[Challenges] Error syncing with backend API', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStartSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChallenge || !submissionContent.trim()) return;

    setSubmitting(true);
    try {
      // 1. Enroll if needed
      await learningService.enrollInModule(selectedChallenge.id);
      // 2. Submit solution work to POST /submissions
      await learningService.submitWork(selectedChallenge.id, submissionContent.trim());

      // Update local state
      setChallenges(prev => prev.map(c =>
        c.id === selectedChallenge.id ? { ...c, progress: 100 } : c
      ));

      setToast({
        title: 'Submission Sent!',
        body: `Your work for "${selectedChallenge.title}" was submitted to your mentor for review!`
      });
      setSelectedChallenge(null);
      setSubmissionContent('');
    } catch (err) {
      console.error('[Challenges] Submit error', err);
      setToast({
        title: 'Submission Error',
        body: 'Failed to submit work. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredChallenges = activeCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category.toLowerCase() === activeCategory);

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white border border-theme-plum/10 shadow-2xl flex items-center gap-3 max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-theme-plum font-sans">{toast.title}</p>
              <p className="text-[11px] text-slate-500 font-sans">{toast.body}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-plum/80">
          <Target className="w-4 h-4 text-theme-berry" />
          <span>CHALLENGES HUB</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-theme-peach/10 border border-theme-peach/30 text-theme-plum text-[10px] font-bold">
          Active Challenge Loop
        </div>
      </header>

      {/* Banner */}
      <section className="p-6 rounded-2xl bg-white/50 border border-theme-plum/5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-theme-berry uppercase tracking-widest font-sans">Quest Library</span>
          <h2 className="font-display font-black text-lg text-theme-plum">Select your next milestone</h2>
          <p className="text-[11px] text-slate-500 font-sans">Filter by bootcamp modules, cohort projects, or mentor assignments.</p>
        </div>

        {/* Filter categories */}
        <div className="flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {['all', 'bootcamp', 'projects', 'mentoring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold font-sans rounded-xl border cursor-pointer transition-all ${
                activeCategory === cat 
                  ? 'bg-theme-plum text-white border-theme-plum shadow-xs' 
                  : 'bg-white/60 text-slate-500 border-theme-plum/10 hover:bg-white hover:text-theme-plum'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Grid List */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-theme-berry border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-sans">Loading challenges from backend server...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => {
            const Icon = challenge.icon || Code;
            const isComplete = challenge.progress === 100;

            return (
              <motion.article
                key={challenge.id}
                className={`p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs flex flex-col justify-between min-h-[200px] hover:shadow-lg transition-all duration-300 relative group overflow-hidden ${
                  isComplete ? 'bg-slate-50/50 opacity-80' : ''
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-theme-peach/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-theme-plum/5 text-theme-berry flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-theme-berry uppercase tracking-widest font-sans block">{challenge.badge}</span>
                        <h3 className={`font-display font-bold text-sm text-theme-plum ${isComplete ? 'line-through text-slate-400' : ''}`}>{challenge.title}</h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-tr from-theme-berry/5 to-theme-peach/5 border border-theme-berry/15 text-theme-berry text-[10px] font-bold">
                      {challenge.reward}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {challenge.description}
                  </p>
                </div>

                {/* Progress and start action */}
                <div className="space-y-3 pt-4 border-t border-theme-plum/5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 font-sans">
                    <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5 text-theme-berry" /> {challenge.duration}</span>
                    <span>{challenge.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-theme-berry" style={{ width: `${challenge.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-theme-plum shrink-0">{challenge.progress}%</span>
                  </div>

                  {isComplete ? (
                    <div className="w-full py-2 bg-green-50 rounded-xl border border-green-200 text-green-600 font-sans text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Task Submitted & Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedChallenge(challenge)}
                      className="w-full py-2 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-theme-berry cursor-pointer transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Submit Solution / Work</span>
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-theme-plum/10 space-y-5 relative"
            >
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-black text-theme-berry uppercase tracking-widest font-sans">
                  Challenge Submission
                </span>
                <h2 className="font-display font-black text-xl text-theme-plum mt-0.5">
                  {selectedChallenge.title}
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  {selectedChallenge.description}
                </p>
              </div>

              <form onSubmit={handleStartSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-theme-plum mb-1.5 font-sans">
                    Solution Notes, GitHub URL, or Artifact Link
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Paste your code snippet, GitHub link, project summary, or video submission URL..."
                    className="w-full p-3 rounded-xl border border-theme-plum/15 text-xs text-theme-plum placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-theme-berry/30 font-sans"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-sans text-slate-500">
                  <span className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-theme-berry" /> Video token integrated
                  </span>
                  <span className="font-bold text-theme-berry">+{selectedChallenge.reward}</span>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChallenge(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-theme-plum text-white hover:bg-theme-berry transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Work to Mentor</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
