import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Bot, ShieldAlert, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { gamificationService } from '../../services/gamificationService';

export default function AICoachDrawer({ isOpen, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressSummary, setProgressSummary] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      // Load AI progress update once when opened
      gamificationService.getAIProgressUpdate(user.id)
        .then(summary => {
          setProgressSummary(summary);
          setMessages([
            {
              id: 'init-1',
              from: 'coach',
              text: `Hello ${user.name}! I'm Nova, your پڑھAI Katalyst Coach.`
            },
            {
              id: 'init-2',
              from: 'coach',
              text: summary || `I've analyzed your dashboard. You are doing great! Try focusing on the AI Fundamentals Bootcamp module next.`
            }
          ]);
        })
        .catch(() => {
          setMessages([
            {
              id: 'init-1',
              from: 'coach',
              text: `Hello ${user.name || 'Explorer'}! I'm Nova, your AI Coach.`
            },
            {
              id: 'init-2',
              from: 'coach',
              text: "I can help you select your next small learning win, explain core AI concepts, or help shape your project's scope. What's on your mind?"
            }
          ]);
        });
    }
  }, [isOpen, user]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    "How can I reach Level 5?",
    "Review my project scope idea",
    "Explain key AI agents simply",
  ];

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now().toString(), from: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let botText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("level 5") || lower.includes("reach level")) {
        botText = "To reach Level 5, you need to earn 2,000 total XP. You can achieve this by completing quests on the Quest Board (each awards 100-150 XP) and playing the Daily Challenge rounds (which award 25 XP per round). Keep coding and learning!";
      } else if (lower.includes("project scope") || lower.includes("review my project")) {
        botText = "I'd love to help! Tell me about the core problem you're addressing, who the users are, and the basic solution. Let's aim to write a concise one-page scope document together.";
      } else if (lower.includes("ai agent") || lower.includes("agents")) {
        botText = "An AI agent is an autonomous software entity that uses large language models (like Gemini) to read input, make plans, select appropriate tools, and act. In reading your progress, I assist as a specialized learning agent!";
      } else {
        botText = "That is a fascinating question. Let's break this goal down: what is one tiny coding step or conceptual topic you can focus on in the next 15 minutes? Completing your active Bootcamp quest would be an excellent choice.";
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), from: 'coach', text: botText }]);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Scrim */}
          <motion.div 
            className="fixed inset-0 bg-theme-plum/10 backdrop-blur-xs z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Sidebar */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-theme-plum/10 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-theme-plum/5 bg-gradient-to-r from-theme-berry/5 via-theme-peach/5 to-theme-cream/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-theme-berry via-theme-peach to-theme-cream flex items-center justify-center text-white relative">
                  <Bot className="w-5 h-5 text-theme-plum" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-display font-black text-sm text-theme-plum leading-tight">Nova</h2>
                  <p className="text-[10px] font-semibold text-theme-berry/80 font-sans uppercase tracking-wider">AI LEARNING COACH</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-theme-plum/5 text-slate-500 hover:text-theme-plum transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spark banner */}
            <div className="p-4 bg-gradient-to-r from-theme-peach/10 to-theme-cream/10 border-b border-theme-plum/5 flex items-start gap-2.5 text-xs text-theme-plum/80 leading-normal font-sans">
              <Sparkles className="w-4 h-4 text-theme-berry flex-shrink-0 mt-0.5" />
              <p>Ask me how to hit your next milestones, debug your quest code, or optimize your learning path.</p>
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.from === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    msg.from === 'user' 
                      ? 'bg-theme-plum' 
                      : 'bg-gradient-to-tr from-theme-berry to-theme-peach text-theme-plum'
                  }`}>
                    {msg.from === 'user' ? <User className="w-4 h-4 text-white" /> : 'N'}
                  </div>

                  {/* Bubble */}
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed font-sans shadow-xs ${
                    msg.from === 'user'
                      ? 'bg-theme-plum text-white rounded-tr-none'
                      : 'bg-white border border-theme-plum/5 text-theme-plum rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-theme-berry to-theme-peach flex items-center justify-center text-xs text-theme-plum font-bold shrink-0">
                    N
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-theme-plum/5 rounded-tl-none shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-theme-berry rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-theme-berry rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-theme-berry rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Quick replies suggestions */}
            <div className="p-4 bg-white border-t border-theme-plum/5 flex gap-2 overflow-x-auto select-none no-scrollbar">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-1.5 rounded-full bg-theme-plum/5 hover:bg-theme-plum/10 text-theme-plum text-xs font-semibold font-sans transition-all shrink-0 cursor-pointer border border-theme-plum/5"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Send Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-theme-plum/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nova anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-theme-plum/10 text-theme-plum placeholder-slate-400 focus:outline-none focus:border-theme-berry focus:ring-1 focus:ring-theme-berry font-sans text-sm"
              />
              <button
                type="submit"
                className="p-3 bg-theme-plum text-white hover:bg-theme-berry rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
