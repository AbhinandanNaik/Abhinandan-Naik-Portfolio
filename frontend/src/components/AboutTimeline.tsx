'use client';

import React from 'react';
import { Briefcase, GraduationCap, Code } from 'lucide-react';

interface TimelineItem {
  year: string;
  role: string;
  org: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export default function AboutTimeline() {
  const milestones: TimelineItem[] = [
    {
      year: '2024 — PRESENT',
      role: 'Backend Java Developer',
      org: 'Digit Insurance',
      desc: 'Developing and optimizing high-performance backend microservices for the core insurance division. Focused on building low-latency RESTful APIs, security validation, and query performance audits under heavy transaction loads.',
      icon: <Briefcase size={16} />,
      color: '#00F5FF',
    },
    {
      year: '2020 — 2024',
      role: 'BE (Hons.) Information Science & Engineering',
      org: 'Engineering College',
      desc: 'Graduated with deep theoretical foundations in Computer Science. Studied Core Java, Database Management Systems, Data Structures & Algorithms, Operating Systems, and Distributed Computing systems.',
      icon: <GraduationCap size={16} />,
      color: '#8B5CF6',
    },
    {
      year: 'JOURNEY & DEVELOPMENT',
      role: 'Independent Software Craftsmanship',
      org: 'Open Source Projects',
      desc: 'Created and deployed modular systems: TrackWise (an asset tracking product) and IoT waste monitors. Implemented complete pipelines using Docker, GitHub Actions, and RESTful architectures.',
      icon: <Code size={16} />,
      color: '#22C55E',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Cinematic Story */}
        <div>
          <div className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
            // About Me
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight leading-none text-white">
            Engineer by Craft, <br />
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Builder by Nature
            </span>
          </h2>
          <p className="text-muted/80 font-light leading-relaxed text-sm md:text-base mb-12">
            I specialize in designing and engineering high-availability, secure server architectures. Using Java 21, Spring Boot, and robust databases, I build the core structures that power web applications.
          </p>

          {/* Timeline Cards */}
          <div className="relative pl-6 border-l border-border/20 flex flex-col gap-10">
            {milestones.map((item, index) => (
              <div key={index} className="relative group">
                {/* Timeline Dot Indicator */}
                <div 
                  className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border bg-bg transition-colors duration-300"
                  style={{ 
                    borderColor: item.color,
                    boxShadow: `0 0 10px ${item.color}50`,
                    color: item.color 
                  }}
                >
                  {item.icon}
                </div>

                <div className="text-[10px] font-mono tracking-widest uppercase mb-1" style={{ color: item.color }}>
                  {item.year}
                </div>
                <h4 className="text-base font-bold text-white mb-0.5">
                  {item.role}
                </h4>
                <div className="text-xs font-mono text-secondary mb-3">
                  {item.org}
                </div>
                <p className="text-muted text-xs md:text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Dashboard-like Profile Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md p-8 rounded-xl glass-card relative overflow-hidden flex flex-col gap-6">
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-secondary to-transparent"></div>

            {/* Avatar Ring */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-r from-accent to-secondary mb-4 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-bg flex items-center justify-center font-bold text-2xl tracking-wider text-accent border border-white/5">
                  AN
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Abhinandan Naik</h3>
              <p className="text-xs font-mono text-accent mt-0.5">Backend Java Engineer</p>
              <p className="text-[10px] text-muted font-mono mt-1">📍 India · UTC+5:30</p>
            </div>

            {/* Languages and details */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['English', 'Hindi', 'Kannada'].map((l) => (
                <span key={l} className="text-[9px] font-mono bg-highlight/10 border border-highlight/20 text-highlight px-3 py-1 rounded">
                  {l}
                </span>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="p-4 bg-white/3 border border-white/5 rounded text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">2+</div>
                <div className="text-[9px] font-mono text-muted uppercase tracking-wider mt-1">Years Experience</div>
              </div>
              <div className="p-4 bg-white/3 border border-white/5 rounded text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">15+</div>
                <div className="text-[9px] font-mono text-muted uppercase tracking-wider mt-1">Technologies</div>
              </div>
              <div className="p-4 bg-white/3 border border-white/5 rounded text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">6+</div>
                <div className="text-[9px] font-mono text-muted uppercase tracking-wider mt-1">Core Modules</div>
              </div>
              <div className="p-4 bg-white/3 border border-white/5 rounded text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">100%</div>
                <div className="text-[9px] font-mono text-muted uppercase tracking-wider mt-1">Committed</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
