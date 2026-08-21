import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Flame, 
  Gamepad2, 
  Check, 
  ChevronRight, 
  Trophy, 
  Clock3, 
  Target, 
  X, 
  Bot, 
  ArrowUpRight, 
  CalendarDays,
  Bell,
  ArrowRight,
  Award,
  Rocket
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { learningService } from '../services/learningService';
import { gamificationService } from '../services/gamificationService';
import ProfileCard from '../components/profile/ProfileCard';

const HERO_IMAGE = "/manus-storage/katalyst-hero-campus_fa6d5ff3.jpg";
const COACH_IMAGE = "/manus-storage/katalyst-coach-orbit_efa784b0.png";
const SPARK_IMAGE = "/manus-storage/katalyst-achievement-spark_a9c0935e.png";

const QUIZ_QUESTIONS = [
  { q: "What does AI stand for?", options: ["Artificial Intelligence", "Automated Interface", "Applied Informatics", "Algorithmic Input"], answer: 0 },
  { q: "Which of these is a popular machine learning framework?", options: ["React", "TensorFlow", "Django", "Bootstrap"], answer: 1 },
  { q: "What is 'training data' used for in AI?", options: ["Styling the UI", "Teaching a model patterns", "Storing user passwords", "Compiling code"], answer: 1 },
  { q: "Which term describes AI generating human-like text?", options: ["Natural Language Processing", "Network Latency", "Neural Load Prediction", "Node Layer Parsing"], answer: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { onOpenCoach } = useOutletContext();

  const [quests, setQuests] = useState([]);
  const [xp, setXp] = useState(1380);
  const [streak, setStreak] = useState(5);
  const [loading, setLoading] = useState(true);
  
  // Interactive mini-game challenge state
  const [challengeStep, setChallengeStep] = useState(1);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Selected Quest modal & celebration states
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [celebrationReward, setCelebrationReward] = useState(null);

  // Quiz gate shown before a quest can be marked complete
  const [quizQuest, setQuizQuest] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(Array(QUIZ_QUESTIONS.length).fill(null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.id) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const token = localStorage.getItem('token');

        // Fetch student dashboard, XP, and modules in parallel
        const [dashRes, fetchedXp, fetchedQuests] = await Promise.allSettled([
          fetch(`${API_URL}/dashboard/student/${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(r => r.ok ? r.json() : null),
          gamificationService.getXp(user.id),
          learningService.getModules(),
        ]);

        // Apply real dashboard data (streak, XP) if backend responded
        const dashData = dashRes.status === 'fulfilled' ? dashRes.value : null;
        if (dashData) {
          // Backend returns totalXp and enrollments; derive streak from submissions
          setXp(dashData.totalXp ?? fetchedXp.value ?? 1380);
          // Streak = number of distinct days in the last N days with a submission
          const submittedDates = (dashData.recentSubmissions ?? [])
            .map(s => new Date(s.submittedAt).toDateString());
          const uniqueDays = new Set(submittedDates);
          setStreak(uniqueDays.size || 0);
        } else {
          // Fallback: use gamificationService XP (has its own mock)
          setXp(fetchedXp.status === 'fulfilled' ? (fetchedXp.value || 1380) : 1380);
          // Keep streak at last known value (default 5 for demo)
        }

        // Apply quests/modules
        const modules = fetchedQuests.status === 'fulfilled' ? fetchedQuests.value : null;
        if (modules && modules.length > 0) {
          setQuests(modules.map(q => ({
            ...q,
            progress: q.progress ?? 0,
            tint: q.tint || 'cyan',
            done: q.status === 'completed',
          })));
        } else {
          setQuests([
            { id: "ai-bootcamp", title: "AI Fundamentals Bootcamp", description: "Finish module 3 and connect the core concepts.", reward: 100, progress: 72, category: "Core skill", tint: "cyan", due: "Due today", done: false },
            { id: "project-scope", title: "Shape your project scope", description: "Turn your idea into a concise one-page brief.", reward: 150, progress: 0, category: "Project", tint: "coral", due: "Due Fri, 5 PM", done: false },
            { id: "mentor-session", title: "Mentor checkpoint", description: "Prepare one question for your coaching session.", reward: 75, progress: 50, category: "Mentoring", tint: "violet", due: "Tomorrow", done: false },
          ]);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  // Game Math: 500 XP per level
  const xpPerLevel = 500;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const nextLevelXp = level * xpPerLevel;
  const xpToNextLevel = nextLevelXp - xp;

  // Daily quest progress calculation
  const totalWeight = quests.length * 100;
  const completedWeight = quests.reduce((acc, q) => acc + (q.done ? 100 : q.progress), 0);
  const questProgress = Math.round((completedWeight / (totalWeight || 1)) * 100);

  // Complete a quest locally and backend-side
  const handleCompleteQuest = async (quest) => {
    setSelectedQuest(null);
    try {
      // Opt optimistically updates
      setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, done: true, progress: 100 } : q));
      setXp(prev => prev + quest.reward);
      setCelebrationReward(quest);

      // Trigger backend API submission
      await learningService.submitWork(quest.id, `Completed ${quest.title} quest outcome.`);
    } catch (err) {
      console.warn("Could not save completion to backend, local state remains", err);
    }
  };

  const QUIZ_PASS_RATIO = 0.8;
  const quizCorrectCount = quizAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].answer).length;
  const quizPassed = quizCorrectCount / QUIZ_QUESTIONS.length >= QUIZ_PASS_RATIO;

  const handleQuizCheck = () => setQuizSubmitted(true);

  const handleQuizRetry = () => {
    setQuizAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setQuizSubmitted(false);
  };

  const handleQuizClaim = () => {
    if (!quizPassed) return;
    setToast({ title: "Quiz Complete", body: `You got ${quizCorrectCount}/${QUIZ_QUESTIONS.length} right.` });
    handleCompleteQuest(quizQuest);
    setQuizQuest(null);
    setQuizAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setQuizSubmitted(false);
  };

  const handleClaimChallenge = () => {
    setXp(prev => prev + 50);
    setStreak(prev => prev + 1);
    setChallengeStep(1); // Reset
    setToast({
      title: "Daily Challenge Claimed!",
      body: "Earned +50 XP and secured your momentum spark streak!"
    });
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Top Banner Signals bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-theme-berry" />
          <span className="font-sans text-xs font-bold text-theme-plum/80">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-white/50 border border-theme-plum/5 text-theme-plum hover:bg-white transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-theme-berry rounded-full"></span>
          </button>
          
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div 
                className="absolute right-0 top-12 w-64 p-4 rounded-2xl bg-white border border-theme-plum/10 shadow-xl z-20 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <p className="text-[10px] font-black text-theme-plum/60 tracking-wider uppercase">New Signals</p>
                <div className="text-xs space-y-2.5">
                  <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-1.5"></span>
                    <p className="text-slate-600"><strong className="text-theme-plum font-bold">Feedback ready</strong><br/>Your project pitch got new guidance.</p>
                  </div>
                  <div className="flex gap-2 border-t border-theme-plum/5 pt-2">
                    <span className="w-1.5 h-1.5 bg-theme-berry rounded-full shrink-0 mt-1.5"></span>
                    <p className="text-slate-600"><strong className="text-theme-plum font-bold">Streak secured</strong><br/>Next daily challenge is live.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Profile Card — click to open dropdown */}
          <ProfileCard compact />
        </div>
      </header>

      {/* Hero Welcome Landscape */}
      <section className="relative overflow-hidden rounded-3xl border border-white/20 shadow-xl min-h-[220px] p-6 md:p-8 flex items-center">
        {/* Visual asset layer */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-80" 
            src={HERO_IMAGE} 
            alt="Luminous campus landscape" 
            onError={(e) => {
              // Fallback if proxy doesn't run locally
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f5] via-[#fdf8f5]/85 to-[#fdf8f5]/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
          <div className="space-y-3.5 max-w-xl">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-theme-berry/10 text-theme-berry text-xs font-bold font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR KATALYST PROFILE</span>
            </div>
            <h1 className="font-display font-black text-3xl md:text-4xl text-theme-plum leading-tight">
              Good morning, {user?.name || 'Explorer'}.<br />
              <em className="text-theme-berry font-normal not-italic">Let's make progress visible.</em>
            </h1>
            <p className="text-xs text-slate-600 font-sans">
              You are <strong className="text-theme-plum">{xpToNextLevel} XP</strong> away from Level {level + 1}. Your next quest is waiting on the route.
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => document.getElementById("quests-section")?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-2.5 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:scale-[1.01] cursor-pointer shadow-md shadow-theme-plum/10 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Continue quest</span>
              </button>
              <button 
                onClick={onOpenCoach}
                className="px-5 py-2.5 bg-white/60 text-theme-plum border border-theme-plum/10 font-semibold rounded-xl text-xs hover:bg-white flex items-center gap-2 hover:scale-[1.01] cursor-pointer transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Coach</span>
              </button>
            </div>
          </div>

          {/* Floating Streak Card */}
          <div className="p-4 rounded-2xl bg-white/80 border border-theme-peach/20 shadow-md flex items-center gap-3.5 min-w-[200px] hover:translate-y-[-2px] transition-transform duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-theme-berry to-theme-peach flex items-center justify-center text-white shadow-sm shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Momentum Spark</p>
              <h3 className="font-display font-black text-lg text-theme-plum">{streak} Day Streak</h3>
              <p className="text-[9px] text-theme-berry font-semibold">One quest keeps it alive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Pulse meter & Daily challenge */}
      <section className="p-6 rounded-2xl bg-white/50 border border-theme-plum/5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="space-y-1 md:max-w-xs shrink-0">
          <span className="text-[10px] font-bold text-theme-berry uppercase tracking-widest font-sans">Today's Pulse</span>
          <h2 className="font-display font-black text-lg text-theme-plum">
            {questProgress === 100 ? "All wins claimed." : "Every action moves your route."}
          </h2>
          <p className="text-[11px] text-slate-500 font-sans">{questProgress}% of today's questline complete</p>
        </div>

        {/* Progress Line */}
        <div className="flex-1 space-y-2 px-0 md:px-4">
          <div className="flex justify-between text-xs text-theme-plum/80 font-bold font-sans">
            <span>Daily Goal</span>
            <span>{questProgress} / 100</span>
          </div>
          <div className="w-full h-3 bg-theme-plum/5 rounded-full overflow-hidden p-[1px] border border-theme-plum/5">
            <div 
              className="h-full bg-gradient-to-r from-theme-berry via-theme-peach to-theme-cream rounded-full transition-all duration-1000"
              style={{ width: `${questProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Mini Challenge interactive trigger */}
        <div className="shrink-0 flex items-center">
          {challengeStep === 3 ? (
            <button 
              onClick={handleClaimChallenge}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-theme-berry to-theme-peach text-white font-bold flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all shadow-md shadow-theme-berry/15"
            >
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-left font-sans text-xs">
                  <small className="block text-[8px] font-bold uppercase text-white/80">Daily Challenge</small>
                  <strong>Ready to Claim!</strong>
                </span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => setChallengeStep(prev => prev + 1)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-white/60 border border-theme-plum/10 text-theme-plum hover:bg-white flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-theme-berry" />
                <span className="text-left font-sans text-xs">
                  <small className="block text-[8px] font-bold uppercase text-slate-500">Daily Challenge</small>
                  <strong>Round {challengeStep} of 3</strong>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </section>

      {/* Main Grid: Left Quest board, Right Leaders widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="quests-section">
        {/* Quest Stack Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">Quest Board</span>
              <h2 className="font-display font-black text-xl text-theme-plum">Today's learning quests</h2>
            </div>
            <button 
              onClick={() => setToast({ title: "Quest Archive", body: "Your full activity library is ready in the Challenges tab." })}
              className="text-xs text-theme-berry hover:text-theme-plum font-bold font-sans flex items-center gap-0.5"
            >
              <span>See all quests</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="h-28 rounded-2xl bg-white/40 border border-theme-plum/5 animate-pulse"></div>
                ))}
              </div>
            ) : (
              quests.map((quest, index) => (
                <article 
                  key={quest.id}
                  className={`p-5 rounded-2xl bg-white border border-theme-plum/5 hover:border-theme-berry/30 hover:shadow-lg transition-all duration-300 relative group flex gap-4 ${
                    quest.done ? 'bg-slate-50/50 opacity-80' : ''
                  }`}
                >
                  <div className="text-[28px] font-display font-black text-theme-plum/10 shrink-0 leading-none">
                    0{index + 1}
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                          <span>{quest.category}</span>
                          <span>•</span>
                          <span className="text-theme-berry font-semibold">{quest.due}</span>
                        </div>
                        <h3 className={`font-display font-bold text-sm text-theme-plum ${quest.done ? 'line-through text-slate-400' : ''}`}>
                          {quest.title}
                        </h3>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-gradient-to-tr from-theme-berry/5 to-theme-peach/5 border border-theme-berry/15 text-theme-berry text-[10px] font-bold tracking-wide">
                        +{quest.reward} XP
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-md font-sans">
                      {quest.description}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-theme-plum/5 rounded-full overflow-hidden p-[1px] border border-theme-plum/5">
                        <div 
                          className="h-full bg-gradient-to-r from-theme-berry via-theme-peach to-theme-cream rounded-full transition-all duration-500" 
                          style={{ width: `${quest.done ? 100 : quest.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-theme-plum shrink-0">
                        {quest.done ? 'Completed' : `${quest.progress}%`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (quest.done) {
                        setToast({ title: "Already Completed", body: "This quest reward is already factored in." });
                      } else {
                        setSelectedQuest(quest);
                      }
                    }}
                    className={`self-center p-2 rounded-xl border border-theme-plum/10 text-theme-plum shrink-0 hover:bg-theme-plum hover:text-white transition-all cursor-pointer ${
                      quest.done ? 'bg-green-500 border-green-500 text-white' : ''
                    }`}
                  >
                    {quest.done ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </article>
              ))
            )}
          </div>

          {/* Coach CTA signal banner */}
          <div className="p-6 rounded-2xl bg-theme-plum text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-md shadow-theme-plum/10">
            {/* Ambient orbits */}
            <div className="absolute right-0 bottom-0 w-36 h-36 bg-theme-berry/20 rounded-full blur-2xl"></div>
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <img className="w-10 h-10 object-contain rounded-full" src={COACH_IMAGE} alt="AI Coach" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-theme-peach uppercase tracking-widest font-sans">Coach Signal</span>
                <h3 className="font-display font-bold text-sm">Unsure where to start?</h3>
                <p className="text-[11px] text-white/70 leading-relaxed font-sans">Ask a question, get a tiny plan, and move forward with intent.</p>
              </div>
            </div>
            <button 
              onClick={onOpenCoach}
              className="px-5 py-2.5 bg-white text-theme-plum font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 hover:scale-[1.01] cursor-pointer hover:bg-theme-cream transition-all shadow-sm"
            >
              <span>Talk to Coach</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-theme-berry" />
            </button>
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="space-y-8">
          {/* Top Learners List */}
          <section className="p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-theme-plum/5 pb-3">
              <div>
                <span className="text-[9px] font-black text-theme-berry uppercase tracking-widest font-sans">Community Pulse</span>
                <h2 className="font-display font-black text-base text-theme-plum">Top Learners</h2>
              </div>
              <Trophy className="w-5 h-5 text-theme-peach" />
            </div>

            <div className="space-y-3">
              {[
                { position: 1, name: "Ananya Rao", level: 10, initials: "AR", color: "from-green-400 to-emerald-500" },
                { position: 2, name: "Kabir Shah", level: 9, initials: "KS", color: "from-amber-400 to-orange-500" },
                { position: 3, name: user?.name || "Shriya Mehta", level: level, initials: user ? user.name.split(' ').map(n=>n[0]).join('') : "SM", color: "from-theme-berry to-theme-peach", mine: true },
                { position: 4, name: "Vihaan Gupta", level: 7, initials: "VG", color: "from-rose-400 to-pink-500" },
              ].map((learner) => (
                <div 
                  key={learner.name}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    learner.mine 
                      ? 'bg-theme-plum/5 border-theme-berry/20 font-bold' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-black text-slate-400 text-center">{learner.position}</span>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${learner.color} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
                      {learner.initials}
                    </div>
                    <span className="text-xs text-theme-plum truncate max-w-[110px]">{learner.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-sans">Lv. {learner.level}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-theme-plum/5 flex items-center gap-2 text-[10px] font-semibold text-slate-500 font-sans">
              <Trophy className="w-3.5 h-3.5 text-theme-berry shrink-0" />
              <span>Up 2 places this week</span>
            </div>
          </section>

          {/* Next Reward Badge card */}
          <section className="p-6 rounded-2xl bg-white border border-theme-plum/5 shadow-xs flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-theme-peach/10 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
              <img 
                className="w-14 h-14 object-contain" 
                src={SPARK_IMAGE} 
                alt="Badge Spark"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Award className="absolute w-8 h-8 text-theme-berry" style={{ display: 'none' }} id="badge-fallback-icon" />
            </div>
            <div className="flex-1 space-y-1.5">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-sans">Next Reward</span>
              <h3 className="font-display font-bold text-sm text-theme-plum">Curious Builder</h3>
              <p className="text-[10px] text-slate-500 font-sans leading-normal">Complete one AI activity to unlock.</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                  <span>2 / 3 tasks</span>
                  <span>67%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-peach rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Quest Detail Modal Dialog */}
      <AnimatePresence>
        {selectedQuest && (
          <>
            <motion.div 
              className="fixed inset-0 bg-theme-plum/20 backdrop-blur-xs z-50 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuest(null)}
            />
            <motion.section 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl border border-theme-plum/10 shadow-2xl z-50 space-y-6"
              initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-theme-plum/5 flex items-center justify-center text-theme-berry shadow-inner shrink-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setSelectedQuest(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-theme-berry uppercase tracking-widest font-sans">{selectedQuest.category}</span>
                <h2 className="font-display font-black text-xl text-theme-plum leading-tight">{selectedQuest.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{selectedQuest.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 font-sans border-y border-theme-plum/5 py-3">
                <span className="flex items-center gap-1.5"><Clock3 className="w-4 h-4 text-theme-berry" /> 25 mins</span>
                <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-theme-peach" /> {selectedQuest.progress}% complete</span>
                <span className="px-2 py-0.5 bg-theme-plum/5 text-theme-plum rounded-full border border-theme-plum/10 ml-auto">+{selectedQuest.reward} XP</span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-theme-plum/60 tracking-wider uppercase">What You'll Do</p>
                <div className="space-y-2 text-xs text-slate-600 font-sans">
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Review the clear outcome for this activity.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Take the focused next step without distractions.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Return to claim your visible progress and secure badges.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedQuest(null);
                    onOpenCoach();
                  }}
                  className="flex-1 py-3 bg-white hover:bg-slate-50 text-theme-plum border border-theme-plum/10 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Bot className="w-4 h-4 text-theme-berry" />
                  <span>Ask Coach Helper</span>
                </button>
                <button
                  onClick={() => {
                    setQuizQuest(selectedQuest);
                    setSelectedQuest(null);
                  }}
                  className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer hover:bg-theme-berry transition-all shadow-md shadow-theme-plum/10"
                >
                  <span>Complete quest</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* Quick AI Quiz Gate: must answer before quest is marked complete */}
      <AnimatePresence>
        {quizQuest && (
          <motion.div
            className="fixed inset-0 bg-theme-plum/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="w-full max-w-lg bg-white rounded-3xl border border-theme-plum/10 shadow-2xl z-50 max-h-[88vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-theme-plum to-theme-berry px-6 md:px-8 py-6 rounded-t-3xl text-white space-y-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Quick AI Quiz</span>
                  <h2 className="font-display font-black text-xl leading-tight">Answer 4 questions to claim "{quizQuest.title}"</h2>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${quizAnswers[i] !== null ? 'bg-white' : 'bg-white/25'}`} />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {QUIZ_QUESTIONS.map((question, qi) => (
                  <div key={qi} className="space-y-2.5">
                    <p className="text-sm font-bold text-theme-plum flex items-start gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-theme-plum/10 text-theme-plum text-[10px] font-black flex items-center justify-center mt-0.5">{qi + 1}</span>
                      <span>{question.q}</span>
                    </p>
                    <div className="grid grid-cols-1 gap-2 pl-7">
                      {question.options.map((opt, oi) => {
                        const selected = quizAnswers[qi] === oi;
                        const isCorrectOption = oi === question.answer;
                        let style = 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100';
                        if (quizSubmitted) {
                          if (isCorrectOption) style = 'bg-green-50 text-green-700 border-green-300';
                          else if (selected) style = 'bg-red-50 text-red-700 border-red-300';
                          else style = 'bg-slate-50 text-slate-400 border-transparent opacity-60';
                        } else if (selected) {
                          style = 'bg-theme-plum text-white border-theme-plum shadow-md shadow-theme-plum/20';
                        }
                        return (
                          <button
                            key={oi}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers(prev => prev.map((a, i) => i === qi ? oi : a))}
                            className={`text-left text-xs px-3 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'} ${style}`}
                          >
                            <span className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                              selected && !quizSubmitted ? 'bg-white/20 text-white' : 'bg-white text-theme-plum/50 border border-theme-plum/10'
                            }`}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span className="font-semibold flex-1">{opt}</span>
                            {quizSubmitted && isCorrectOption && <Check className="w-4 h-4 text-green-600 shrink-0" />}
                            {quizSubmitted && selected && !isCorrectOption && <X className="w-4 h-4 text-red-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {quizSubmitted && (
                  <div className={`rounded-xl border px-4 py-3 text-xs font-bold text-center ${
                    quizPassed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    You scored {quizCorrectCount}/{QUIZ_QUESTIONS.length} correct
                    {quizPassed
                      ? ' — nice, reward unlocked!'
                      : ` — need at least ${Math.ceil(QUIZ_QUESTIONS.length * QUIZ_PASS_RATIO)}/${QUIZ_QUESTIONS.length} (80%) to claim XP.`}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setQuizQuest(null);
                      setQuizAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
                      setQuizSubmitted(false);
                    }}
                    className="flex-1 py-3 bg-white hover:bg-slate-50 text-theme-plum border border-theme-plum/10 font-bold rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  {quizSubmitted && !quizPassed ? (
                    <button
                      onClick={handleQuizRetry}
                      className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-theme-berry cursor-pointer transition-all shadow-md shadow-theme-plum/10"
                    >
                      <span>Retake quiz</span>
                    </button>
                  ) : quizSubmitted ? (
                    <button
                      onClick={handleQuizClaim}
                      className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-theme-berry cursor-pointer transition-all shadow-md shadow-theme-plum/10"
                    >
                      <span>Claim quest reward</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled={quizAnswers.some(a => a === null)}
                      onClick={handleQuizCheck}
                      className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-theme-berry cursor-pointer transition-all shadow-md shadow-theme-plum/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Check answers</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest Claim Celebration Overlay Screen */}
      <AnimatePresence>
        {celebrationReward && (
          <motion.div 
            className="fixed inset-0 bg-theme-plum/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCelebrationReward(null)}
          >
            <motion.section 
              className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-2xl border border-white/20 text-center relative space-y-6 overflow-hidden"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setCelebrationReward(null)}
                className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
                <img 
                  className="w-full h-full object-contain animate-bounce" 
                  src={SPARK_IMAGE} 
                  alt="Spark Badge" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-theme-berry uppercase tracking-widest font-sans">Quest Complete</span>
                <h2 className="font-display font-black text-2xl text-theme-plum">You moved the route!</h2>
                <p className="text-xs text-slate-500 font-sans">
                  <strong className="text-theme-berry font-bold text-sm">+{celebrationReward.reward} XP</strong> has been added to your Katalyst total.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-theme-plum/5">
                <div className="flex flex-col items-center gap-1">
                  <Flame className="w-5 h-5 text-theme-berry fill-theme-berry" />
                  <span className="text-[10px] text-slate-500">Streak Status</span>
                  <span className="text-xs font-black text-theme-plum">{streak} Days Spark</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-theme-plum/5">
                  <Sparkles className="w-5 h-5 text-theme-peach" />
                  <span className="text-[10px] text-slate-500">Current Level</span>
                  <span className="text-xs font-black text-theme-plum">Level {level} Progress</span>
                </div>
              </div>

              <button 
                onClick={() => setCelebrationReward(null)}
                className="w-full py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-theme-berry cursor-pointer transition-all shadow-md shadow-theme-plum/10"
              >
                <span>Claim the win</span>
                <Check className="w-4 h-4" />
              </button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-white border border-theme-berry/20 shadow-2xl flex items-center gap-3 max-w-sm"
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.9 }}
          >
            <Sparkles className="w-6 h-6 text-theme-berry shrink-0" />
            <div className="text-left font-sans">
              <strong className="text-xs font-bold text-theme-plum block">{toast.title}</strong>
              <span className="text-[10px] text-slate-500">{toast.body}</span>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 shrink-0 cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
