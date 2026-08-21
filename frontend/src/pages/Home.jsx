import React, { useState, useEffect } from 'react';

// Reusable Layout Components
import Navbar from '../components/layout/Navbar';

// Modular Components
import Scene from '../components/home/Scene';
import Hero from '../components/home/Hero';
import Problem from '../components/home/Problem';
import Idea from '../components/home/Idea';
import Impact from '../components/home/Impact';
import CTA from '../components/home/CTA';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');

  // Handle hash scrolling on page load / redirect
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      // Slight delay to ensure elements are rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, []);

  // Track active section on scroll to update navigation active state
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'problem', 'idea', 'impact', 'join'];
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      {/* 3D Scene in the fixed background */}
      <Scene />

      {/* Sticky Header Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Layered Content Container */}
      <main className="relative z-10">
        
        {/* Glow meshes layered in HTML for visual depth */}
        <div className="bg-mesh bg-gradient-to-tr from-theme-berry to-theme-plum top-[15%] left-[-200px]"></div>
        <div className="bg-mesh bg-gradient-to-tr from-theme-peach to-theme-cream top-[45%] right-[-250px]"></div>
        <div className="bg-mesh bg-gradient-to-tr from-theme-plum to-theme-berry top-[75%] left-[-200px]"></div>
        {/* Sections */}
        <Hero />
        <Problem />
        <Idea />
        <Impact />
        <CTA />

      </main>
    </>
  );
}
