'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldAlert, Cpu, Database, Server, RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

interface MetricItem {
  name: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface LoggingLine {
  time: string;
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';
  msg: string;
}

export default function ExperienceDashboard() {
  const [logs, setLogs] = useState<LoggingLine[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const accentColor = useThemeStore((state) => state.accentColor);

  const metrics: MetricItem[] = [
    { name: 'APIs', value: '1.2M/day', label: 'Throughput Handled', icon: <Cpu size={16} />, color: accentColor },
    { name: 'DBs', value: '-42%', label: 'Response Latency', icon: <Database size={16} />, color: '#22C55E' },
    { name: 'Uptime', value: '99.98%', label: 'Service SLA', icon: <Server size={16} />, color: '#8B5CF6' },
    { name: 'Security', value: '0 Audits', label: 'CVE Violations', icon: <ShieldAlert size={16} />, color: '#EF4444' }
  ];

  const highlights = [
    { title: '🔌 API Development', desc: 'Designed and deployed RESTful APIs using Spring Boot, handling high-volume policy purchase and claim workflows.' },
    { title: '🗄️ Database Optimization', desc: 'Audited slow PostgreSQL statements, writing indexing policies and schema tuning to drop response delays.' },
    { title: '🔒 Security Engineering', desc: 'Structured spring-security filters applying JWT validations and role constraints across admin operations.' },
    { title: '🐳 Containerization', desc: 'Dockerized microservice artifacts, creating GitHub Actions recipes for building and staging image releases.' }
  ];

  // Live log lines simulation
  useEffect(() => {
    const initLogs: LoggingLine[] = [
      { time: '22:04:10', level: 'INFO', msg: 'Initializing Digit Gateway Service...' },
      { time: '22:04:11', level: 'INFO', msg: 'HikariPool-1 - Connection established to PostgreSQL' },
      { time: '22:04:12', level: 'DEBUG', msg: 'Security token filter initialized successfully' },
      { time: '22:04:15', level: 'INFO', msg: 'Actuator prometheus scraper listening on port 8080' }
    ];
    setLogs(initLogs);

    const logMessages = [
      'GET /api/policies/POL-8902 200 OK - 14ms',
      'POST /api/claims/verify - JWT verified successfully',
      'Redis cache HIT for key: rate_limit_127.0.0.1',
      'Database query: SELECT * FROM claims WHERE status = PENDING (5ms)',
      'Telemetry trace pushed to Prometheus Collector',
      'Flyway DB migration schema status: up-to-date',
      'POST /api/contact/submit - Message validation passed',
      'Actuator health check status: UP (Disk: 82%, Memory: 41%)',
      'GET /api/analytics/summary - Cache bypass triggered by request headers',
      'Refreshed JWT AccessToken for sub: admin - expiry 15m'
    ];

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' = Math.random() > 0.85 ? 'WARN' : (Math.random() > 0.95 ? 'ERROR' : 'INFO');
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      
      setLogs((prev) => {
        const updated = [...prev, { time, level, msg: randomMsg }];
        if (updated.length > 50) updated.shift();
        return updated;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Keep log panel scrolled down
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section id="experience" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      <div className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
        // Professional Console
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-12">
        Command Center
      </h2>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Company overview & KPIs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 rounded-xl glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-secondary"></div>
            
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-mono">Backend Java Developer</h3>
                <div className="text-xs text-accent font-mono mt-0.5">Digit Insurance · Core Division</div>
              </div>
              <span className="text-[10px] font-mono bg-secondary/15 border border-secondary/30 text-secondary px-3 py-1 rounded">
                2024 — PRESENT
              </span>
            </div>

            <p className="text-muted text-xs md:text-sm leading-relaxed font-light mb-6">
              Engineering high-availability backend solutions that handle insurance transactions. Responsible for design, database migration scripts, API gateway security layers, and service dockerization templates.
            </p>

            {/* highlights grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="p-4 rounded bg-white/3 border border-white/5 flex flex-col gap-1.5 hover:border-accent/30 transition-all duration-300">
                  <h4 className="text-xs font-bold text-white font-mono">{h.title}</h4>
                  <p className="text-[11px] text-muted leading-relaxed font-light">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Telemetry Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="p-4 rounded bg-white/3 border border-white/5 flex flex-col items-center text-center hover:border-border/30 transition-all duration-300">
                <div 
                  className="w-8 h-8 rounded-full mb-3 flex items-center justify-center border"
                  style={{ borderColor: m.color + '40', color: m.color, background: m.color + '0c' }}
                >
                  {m.icon}
                </div>
                <div className="text-lg font-black text-white">{m.value}</div>
                <div className="text-[9px] font-mono text-muted uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Simulated Microservices Shell Output */}
        <div className="flex flex-col h-full min-h-[300px]">
          <div className="flex-1 rounded-xl border border-accent/20 bg-[#0A0A0F] overflow-hidden flex flex-col font-mono text-[10px]">
            {/* Console Header */}
            <div className="bg-white/5 px-4 py-2.5 border-b border-white/5 flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
                <span className="text-muted ml-2 text-[9px] tracking-wider uppercase">digit-service.log</span>
              </div>
              <Activity size={12} className="text-accent animate-pulse" />
            </div>

            {/* Scrollable logs */}
            <div 
              ref={logContainerRef}
              className="flex-1 p-4 overflow-y-auto flex flex-col gap-1.5 scroll-smooth"
              style={{ maxHeight: '340px' }}
            >
              {logs.map((log, index) => (
                <div key={index} className="flex gap-2 leading-relaxed">
                  <span className="text-[#5f637e] shrink-0">[{log.time}]</span>
                  <span 
                    className="font-bold shrink-0" 
                    style={{ 
                      color: log.level === 'ERROR' ? '#EF4444' : (log.level === 'WARN' ? '#FBB324' : accentColor) 
                    }}
                  >
                    {log.level}
                  </span>
                  <span className="text-muted/90 select-text">{log.msg}</span>
                </div>
              ))}
            </div>

            {/* Console Status Footer */}
            <div className="bg-white/3 px-4 py-2 border-t border-white/5 text-[9px] text-muted flex items-center justify-between">
              <span>PROD_REPLICA_NODE_1: ACTIVE</span>
              <span className="text-highlight">● ONLINE</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
