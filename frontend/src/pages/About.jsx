<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> origin/mohit
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Heart, 
  Users, 
  Award, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Layout and Background Elements
import Navbar from '../components/layout/Navbar';
import Scene from '../components/home/Scene';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <>
      {/* Dynamic 3D Scene in the fixed background for brand continuity */}
      <Scene showPencil={false} />

      {/* Reusable Navbar Navigation */}
      <Navbar activeSection="about" />

      {/* Main Page Container */}
      <main className="relative z-10 min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24">
        
        {/* Glow meshes layered in HTML for visual depth */}
        <div className="bg-mesh bg-gradient-to-tr from-theme-berry to-theme-plum top-[10%] left-[-200px]"></div>
        <div className="bg-mesh bg-gradient-to-tr from-theme-peach to-theme-cream top-[50%] right-[-250px]"></div>
        <div className="bg-mesh bg-gradient-to-tr from-theme-plum to-theme-berry top-[80%] left-[-200px]"></div>

        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <motion.section 
            className="text-center space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-theme-berry text-sm font-semibold w-fit">
              <Sparkles className="w-4 h-4 text-theme-peach animate-pulse" />
              <span className="font-display">पढ़AI Katalyst Team</span>
            </div>
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight text-theme-plum tracking-tight">
              We make learning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-glow-berry">
                an Adventure.
              </span>
            </h1>
            <p className="text-lg text-slate-700 font-sans leading-relaxed">
              पढ़AI Katalyst is a registered 501(c)(3) educational charity organization. We redesign the classroom experience by combining academic rigor with the interactive design patterns of gaming.
            </p>
          </motion.section>

          {/* Mission & Vision Row */}
          <motion.section 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Card 1: Our Mission */}
            <motion.div 
              className="glass-panel p-8 rounded-3xl border border-white/20 shadow-xl space-y-4 hover:scale-[1.01] transition-transform duration-300"
              variants={itemVariants}
            >
              <div className="p-3.5 bg-theme-berry/10 rounded-2xl w-fit border border-theme-berry/20">
                <Target className="w-6 h-6 text-theme-berry" />
              </div>
              <h2 className="font-display font-bold text-2xl text-theme-plum">Our Mission</h2>
              <p className="text-slate-600 font-sans leading-relaxed text-sm">
                To eliminate disengagement in schools by providing educators with gamified tools that spark intrinsic motivation, helping students of all backgrounds unlock their true academic potential.
              </p>
            </motion.div>

            {/* Card 2: Our Impact Vision */}
            <motion.div 
              className="glass-panel p-8 rounded-3xl border border-white/20 shadow-xl space-y-4 hover:scale-[1.01] transition-transform duration-300"
              variants={itemVariants}
            >
              <div className="p-3.5 bg-theme-peach/10 rounded-2xl w-fit border border-theme-peach/20">
                <Heart className="w-6 h-6 text-theme-peach" />
              </div>
              <h2 className="font-display font-bold text-2xl text-theme-plum">Our Vision</h2>
              <p className="text-slate-600 font-sans leading-relaxed text-sm">
                A world where educational equity is achieved through play. We envision classrooms where students do not fear mistakes, but embrace them as steps toward mastering their quests.
              </p>
            </motion.div>
          </motion.section>

          {/* Core Values Section */}
          <section className="space-y-12">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h2 className="font-display font-black text-4xl text-theme-plum">Our Core Values</h2>
              <p className="text-slate-600 font-sans text-sm">
                The principles driving our technology, designs, and NGO programs forward.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {[
                { 
                  icon: BookOpen, 
                  title: 'Academic Rigor', 
                  desc: 'We do not compromise on curriculum quality. We align our learning paths with national educational standards.' 
                },
                { 
                  icon: Award, 
                  title: 'Intrinsic Rewards', 
                  desc: 'We replace high-pressure marks with unlockable credentials, progress trackers, and confetti celebrations.' 
                },
                { 
                  icon: Users, 
                  title: 'Social Dynamics', 
                  desc: 'Learning is collaborative. We build spaces where peers share resources, review work, and complete team challenges.' 
                },
                { 
                  icon: TrendingUp, 
                  title: 'Continuous Mastery', 
                  desc: 'Failure is a temporary state. Students can repeat lessons and quizzes until they achieve complete subject mastery.' 
                },
                { 
                  icon: ShieldCheck, 
                  title: 'Classroom Safety', 
                  desc: 'Ad-free, non-commercial, and COPPA compliant. We design tools that prioritize pupil data security and privacy.' 
                },
                { 
                  icon: Sparkles, 
                  title: 'Creative Play', 
                  desc: 'We design experiences that capture the imagination of learners, utilizing stories and interactive 3D assets.' 
                }
              ].map((value, idx) => (
                <motion.div 
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-theme-berry/30 hover:scale-[1.01] transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="p-2.5 bg-theme-plum/5 rounded-xl w-fit">
                    <value.icon className="w-5 h-5 text-theme-plum" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-theme-plum">{value.title}</h3>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Team Section */}
          <section className="space-y-12">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h2 className="font-display font-black text-4xl text-theme-plum">Meet the Creators</h2>
              <p className="text-slate-600 font-sans text-sm">
                The designers, educators, and software builders behind पढ़AI Katalyst.
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {[
                { 
                  name: 'Dr. Evelyn Carter', 
                  role: 'Executive Director & Educator', 
                  desc: 'Former educational researcher at Stanford with 12+ years experience redesigning curriculum for primary education.',
                  avatar: 'EC'
                },
                { 
                  name: 'Marcus Thorne', 
                  role: 'Lead Game Designer', 
                  desc: 'Veteran game developer who left the AAA industry to apply engagement mechanics to global social impact causes.',
                  avatar: 'MT'
                },
                { 
                  name: 'Zack Chen', 
                  role: 'CTO & EdTech Architect', 
                  desc: 'Full-stack engineer and open-source enthusiast focused on low-bandwidth, highly responsive offline web systems.',
                  avatar: 'ZC'
                }
              ].map((member, idx) => (
                <motion.div 
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-center hover:scale-[1.01] transition-transform duration-300"
                  variants={itemVariants}
                >
                  <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-theme-berry via-theme-peach to-theme-plum flex items-center justify-center border-2 border-white shadow-md">
                    <span className="font-display font-black text-xl text-white tracking-wider">{member.avatar}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-theme-plum">{member.name}</h3>
                    <p className="text-theme-berry font-display font-semibold text-xs">{member.role}</p>
                  </div>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed max-w-xs mx-auto">{member.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action Section */}
          <motion.section 
            className="glass-panel p-12 rounded-3xl border border-white/20 shadow-2xl text-center space-y-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display font-black text-4xl text-theme-plum leading-tight">
              Ready to support the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-berry via-theme-peach to-theme-plum text-glow-berry">
                  पढ़AI Katalyst mission?
              </span>
            </h2>
            <p className="text-slate-700 font-sans text-sm max-w-xl mx-auto">
              Help us expand access to modern, interactive curriculum materials in schools that need them the most. Join us, volunteer, or request an invite for your classroom.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-theme-berry to-theme-peach text-white font-bold rounded-xl shadow-lg hover:shadow-berry/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Link>
              <Link 
                to="/#join" 
                className="w-full sm:w-auto px-8 py-4 bg-theme-plum/5 hover:bg-theme-plum/10 text-theme-plum font-semibold rounded-xl border border-theme-plum/10 hover:border-theme-plum/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Classroom Access</span>
              </Link>
            </div>
          </motion.section>

        </div>
      </main>
    </>
  );
}
