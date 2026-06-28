'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTelemetryStore } from '@/store/telemetryStore';
import { ExternalLink, Activity, Info, Award } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  techStack: string;
  liveUrl?: string;
  githubUrl?: string;
  features: string;
  challenges: string;
  impact: string;
  metrics: string;
}

const fallbackProjects: Project[] = [
  {
    id: 1,
    name: 'TrackWise',
    subtitle: 'Enterprise Asset Tracking System',
    description: 'Enterprise Asset Tracking System — A full-stack application for managing organizational assets with maintenance scheduling, warranty tracking, real-time notifications, and comprehensive analytics dashboard.',
    techStack: 'Java, Spring Boot, PostgreSQL, Flyway, JWT, Docker, React',
    liveUrl: 'https://trackwise-demo.abhinandannaik.com',
    githubUrl: 'https://github.com/abhinandan-naik/trackwise',
    features: 'Asset Management|Maintenance Tracking|Smart Notifications|Warranty Management|Analytics & Reports|Role-Based Access',
    challenges: 'Handling transaction rollback across multi-step maintenance jobs and optimizing deep-join reports.',
    impact: 'Improved asset lifecycle visibility and reduced machinery downtime by 24% across testing sites.',
    metrics: 'API Design:REST,Auth Security:JWT,Containerized:Docker,OpenAPI Docs:v3',
  },
  {
    id: 2,
    name: 'Smart Bin Management System',
    subtitle: 'IoT Waste Monitoring & Optimization',
    description: 'IoT-powered intelligent waste management system using ESP8266 microcontrollers with real-time fill level detection, smart monitoring, route optimization algorithms, and live dashboard visualization for smart cities.',
    techStack: 'ESP8266, Blynk IoT, Route Optimization, C++',
    githubUrl: 'https://github.com/abhinandan-naik/smart-bin',
    features: 'Fill Level Detection|Smart Monitoring|Route Optimization|Real-time Tracking|Dashboard Viz|IoT Integration',
    challenges: 'Ensuring reliable sensor readouts under extreme temperature variations and battery power management.',
    impact: 'Reduced waste collector fuel usage by 18% through dynamic routing optimization.',
    metrics: 'Hardware:IoT,Monitoring:Real-time,Routing:Smart,Connected:Cloud',
  },
];

import { API_BASE } from '@/config/api';

export default function ProjectShowcaseRoom() {
  const trackAction = useTelemetryStore((state) => state.trackAction);

  // Fetch projects from Spring Boot backend with React Query
  const { data: projects = fallbackProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) throw new Error('API fetch failed');
      return response.json();
    },
    // Graceful fallback if API fails
    meta: {
      errorHandler: () => {
        console.warn('Backend API unavailable. Displaying local projects fallback.');
      }
    }
  });

  const handleLinkClick = (projectName: string, linkType: 'github' | 'live') => {
    trackAction(`CLICK_PROJECT_${linkType.toUpperCase()}`, projectName);
  };

  return (
    <section id="projects" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      <div className="text-secondary font-mono text-xs tracking-widest uppercase mb-2">
        // Showcase Room
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-12">
        Featured Projects
      </h2>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj) => {
          const featureList = proj.features.split('|');
          const metricPairs = proj.metrics.split(',').map((pair) => {
            const [k, v] = pair.split(':');
            return { key: k, val: v };
          });

          return (
            <div 
              key={proj.id} 
              className="p-6 md:p-8 rounded-xl glass-card relative overflow-hidden flex flex-col gap-6 group hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Header: Project Badge & Repository Actions */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-accent tracking-widest border border-accent/20 bg-accent/5 px-2.5 py-1 rounded">
                  PROJECT_00{proj.id}
                </span>

                <div className="flex items-center gap-3">
                  {proj.githubUrl && (
                    <a 
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(proj.name, 'github')}
                      className="text-muted hover:text-white transition-colors cursor-pointer"
                      title="GitHub Repository"
                    >
                      <svg className="w-4 h-4 fill-current hover:text-accent transition-colors" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a 
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(proj.name, 'live')}
                      className="text-muted hover:text-white transition-colors cursor-pointer"
                      title="Live Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold text-white font-mono group-hover:text-accent transition-colors duration-250">
                  {proj.name}
                </h3>
                <div className="text-xs text-secondary font-mono mt-0.5 mb-3">{proj.subtitle}</div>
                <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                  {proj.description}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.techStack.split(',').map((tech) => (
                  <span 
                    key={tech} 
                    className="text-[9px] font-mono px-2 py-0.5 bg-secondary/10 border border-secondary/20 text-secondary rounded"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>

              {/* Key Features Bullet List */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-3">Key Architectures</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                  {featureList.map((f, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="text-highlight text-[8px]">◆</span>
                      <span className="font-light">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra Sections: Challenge & Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded bg-white/3 border border-white/5 text-[11px] leading-relaxed">
                <div>
                  <div className="flex items-center gap-1 text-white font-bold mb-1">
                    <Info size={12} className="text-accent" />
                    <span>Challenge</span>
                  </div>
                  <p className="text-muted font-light">{proj.challenges}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-white font-bold mb-1">
                    <Award size={12} className="text-highlight" />
                    <span>Impact</span>
                  </div>
                  <p className="text-muted font-light">{proj.impact}</p>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5 text-center">
                {metricPairs.map((m, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-[10px] font-bold text-accent font-mono">{m.val}</span>
                    <span className="text-[8px] font-mono text-muted uppercase tracking-wider mt-0.5">{m.key}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
