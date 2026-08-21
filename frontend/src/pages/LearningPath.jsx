<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> origin/mohit
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Lock, 
  Map, 
  BookOpen, 
  Rocket, 
  Sparkles, 
  Users, 
  Trophy, 
<<<<<<< HEAD
  X, 
  Bot, 
  Compass, 
=======
  ChevronRight, 
  X, 
  Bot, 
  Compass, 
  Play, 
  Award,
>>>>>>> origin/mohit
  Calendar
} from 'lucide-react';
import { learningService } from '../services/learningService';

const MAP_IMAGE = "/manus-storage/katalyst-map-orb_8d821af1.png";

export default function LearningPath() {
  const { onOpenCoach } = useOutletContext();
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinnedNodeId, setPinnedNodeId] = useState(null);

  useEffect(() => {
    async function loadJourney() {
      try {
        const fetchedNodes = await learningService.getJourneyNodes();
        
        // Enrich nodes with icons
        const iconMap = {
          foundation: BookOpen,
          "first-quest": Rocket,
          "skill-builder": Sparkles,
          "mentor-challenge": Users,
          milestone: Trophy
        };

        const enriched = fetchedNodes.map((node) => ({
          ...node,
          icon: iconMap[node.id] || Compass
        }));

        setNodes(enriched);
      } catch (err) {
        console.error("Could not fetch journey nodes", err);
      } finally {
        setLoading(false);
      }
    }
    loadJourney();
  }, []);

  const handlePinNode = (node) => {
    setPinnedNodeId(node.id);
    setSelectedNode(null);
  };

  return (
    <div className="space-y-8 select-none max-w-6xl mx-auto pb-16">
      {/* Header bar */}
      <header className="flex justify-between items-center bg-white/40 border border-theme-plum/5 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-plum/80">
          <Compass className="w-4 h-4 text-theme-berry" />
          <span>YEAR 1 ROADMAP</span>
        </div>
        {pinnedNodeId && (
          <div className="px-3 py-1 rounded-full bg-theme-peach/10 border border-theme-peach/30 text-theme-plum text-[10px] font-bold">
            Pinned Route: {nodes.find(n => n.id === pinnedNodeId)?.title}
          </div>
        )}
      </header>

      {/* Hero Visual Map Section */}
      <section className="relative p-6 md:p-8 rounded-3xl border border-white/20 bg-gradient-to-br from-theme-plum via-[#532e3b]/95 to-slate-900 text-white overflow-hidden shadow-xl min-h-[160px] flex items-center">
        {/* Right side background visual image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-0 opacity-40 md:opacity-75">
          <img 
            className="w-36 h-36 md:w-44 md:h-44 object-contain translate-x-4" 
            src={MAP_IMAGE} 
            alt="Illustrated Katalyst Journey Path Map" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Compass className="absolute w-20 h-20 text-theme-peach/20" style={{ display: 'none' }} id="map-fallback-compass" />
        </div>

        <div className="relative z-10 space-y-2.5 max-w-xl">
          <span className="text-[10px] font-black text-theme-peach uppercase tracking-widest font-sans">Year 1 • The Launchpad</span>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-tight leading-tight">
            Your learning route is taking shape.
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-md">
            Move step-by-step through each learning node to turn fundamental theories into certified real-world capabilities.
          </p>
        </div>
      </section>

      {/* Journey Map Road Canvas */}
      <section className="p-8 rounded-3xl bg-white/50 border border-theme-plum/5 shadow-xs relative overflow-hidden">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Dashed Connector Route Line */}
            <div className="absolute top-[26px] left-[5%] right-[5%] h-1 z-0 hidden md:block">
              <div className="w-full h-full border-t border-dashed border-theme-plum/20"></div>
              {/* Active Completed Trail fill */}
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-theme-berry to-theme-peach" style={{ width: '38%' }}></div>
            </div>

            {/* Nodes Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {nodes.map((node, index) => {
                const Icon = node.icon;
                const isComplete = node.state === 'complete';
                const isCurrent = node.state === 'current';
                const isLocked = node.state === 'locked';

                let nodeStyle = "bg-white border-theme-plum/15 text-theme-plum hover:border-theme-berry/30 hover:shadow-md";
                if (isComplete) nodeStyle = "bg-green-500 border-green-400 text-white shadow-sm hover:scale-105";
                if (isCurrent) nodeStyle = "bg-theme-plum border-theme-berry text-white scale-105 shadow-md animate-pulse ring-4 ring-theme-peach/20 hover:scale-110";
                if (isLocked) nodeStyle = "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70";

                return (
                  <button 
                    key={node.id}
                    disabled={isLocked}
                    onClick={() => setSelectedNode(node)}
                    className="flex flex-col items-center md:items-start text-center md:text-left gap-3.5 group cursor-pointer transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    {/* Circle Node Dot Wrapper */}
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${nodeStyle}`}>
                      {isComplete ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Copy Meta */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 font-sans tracking-wide">NODE 0{index + 1}</span>
                      <h3 className="font-display font-bold text-sm text-theme-plum group-hover:text-theme-berry transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-sans leading-normal leading-snug min-h-[32px] max-w-[140px] mx-auto md:mx-0">
                        {node.note}
                      </p>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide mt-1.5 ${
                        isLocked 
                          ? 'bg-slate-200/50 text-slate-400' 
                          : 'bg-gradient-to-tr from-theme-berry/5 to-theme-peach/5 text-theme-berry border border-theme-berry/15'
                      }`}>
                        +{node.reward} XP
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Node Detail Modal */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div 
              className="fixed inset-0 bg-theme-plum/20 backdrop-blur-xs z-50 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
            />
            <motion.section 
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-6 md:p-8 rounded-3xl border border-theme-plum/10 shadow-2xl z-50 space-y-6"
              initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-theme-plum/5 flex items-center justify-center text-theme-berry shrink-0">
                  <Map className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-theme-berry uppercase tracking-widest font-sans">JOURNEY CHECKPOINT</span>
                <h2 className="font-display font-black text-xl text-theme-plum leading-tight">{selectedNode.title}</h2>
                <p className="text-xs text-slate-500 font-sans">{selectedNode.note}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 font-sans border-y border-theme-plum/5 py-3">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-theme-berry" /> Est. 2 hours</span>
                <span className="px-2 py-0.5 bg-theme-plum/5 text-theme-plum rounded-full border border-theme-plum/10 ml-auto">+{selectedNode.reward} XP</span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-theme-plum/60 tracking-wider uppercase">INCLUDED EXERCISES</p>
                <div className="space-y-2.5 text-xs text-slate-600 font-sans">
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-theme-plum/5">
                    <span>1. Foundations Lecture & Sandbox</span>
                    <span className="text-[9px] font-bold text-green-600">Complete</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-theme-plum/5">
                    <span>2. Core Objective Code Quiz</span>
                    <span className={selectedNode.state === 'complete' ? "text-[9px] font-bold text-green-600" : "text-[9px] font-bold text-theme-berry"}>
                      {selectedNode.state === 'complete' ? 'Complete' : 'Start Next'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-theme-plum/5">
                    <span>3. AI Review Submission Project</span>
                    <span className="text-[9px] font-bold text-slate-400">Locked</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onOpenCoach();
                  }}
                  className="flex-1 py-3 bg-white hover:bg-slate-50 text-theme-plum border border-theme-plum/10 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Bot className="w-4 h-4 text-theme-berry" />
                  <span>Ask Coach</span>
                </button>
                <button
                  onClick={() => handlePinNode(selectedNode)}
                  className="flex-1 py-3 bg-theme-plum text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer hover:bg-theme-berry transition-all shadow-md shadow-theme-plum/10"
                >
                  <span>Pin to my route</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
