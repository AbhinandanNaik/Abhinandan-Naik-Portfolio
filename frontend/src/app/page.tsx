import React from 'react';
import Navbar from '@/components/Navbar';
import Hero3D from '@/components/Hero3D';
import AboutTimeline from '@/components/AboutTimeline';
import SkillsGalaxy3D from '@/components/SkillsGalaxy3D';
import ExperienceDashboard from '@/components/ExperienceDashboard';
import ProjectShowcaseRoom from '@/components/ProjectShowcaseRoom';
import ArchitectureShowcase from '@/components/ArchitectureShowcase';
import SkillsHeatmap from '@/components/SkillsHeatmap';
import Certifications from '@/components/Certifications';
import InteractiveTerminal from '@/components/InteractiveTerminal';
import ContactHub from '@/components/ContactHub';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
  return (
    <main className="relative flex flex-col w-full bg-bg z-10">
      <Navbar />
      <Hero3D />
      <AboutTimeline />
      <ExperienceDashboard />
      <SkillsGalaxy3D />
      <ProjectShowcaseRoom />
      <ArchitectureShowcase />
      <SkillsHeatmap />
      <Certifications />
      <InteractiveTerminal />
      <ContactHub />
      <AIAssistant />

      {/* Futuristic footer */}
      <footer className="relative py-12 px-6 md:px-12 bg-bg border-t border-border/20 text-center font-mono select-none">
        <div className="text-xl font-bold tracking-widest text-accent mb-2">
          &lt;AN /&gt;
        </div>
        <p className="text-muted text-[10px] uppercase tracking-wider mb-6">
          Architecting Resilient Distributed Systems
        </p>

        {/* Channels */}
        <div className="flex items-center justify-center gap-6 mb-8 text-muted text-xs">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">LinkedIn</a>
          <a href="mailto:abhinandan@email.com" className="hover:text-accent transition-colors">Email</a>
        </div>

        <p className="text-[10px] text-muted/40">
          © 2026 Abhinandan Naik · Built with Next.js 15, Spring Boot 3.5 & Three.js
        </p>
      </footer>
    </main>
  );
}
