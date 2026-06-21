'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '@/store/telemetryStore';
import { Network, Server, Cpu, Database, KeyRound, Zap, ShieldCheck } from 'lucide-react';

interface ArchNode {
  id: string;
  name: string;
  tech: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  flow: string;
  connections: string[]; // Node IDs that this node connects to
}

const archNodes: ArchNode[] = [
  {
    id: 'client',
    name: 'Client Layer',
    tech: 'React / Next.js',
    icon: <Cpu size={20} />,
    color: '#8B5CF6',
    title: 'Client Layer — React / Next.js 15',
    desc: 'Single-page application pre-rendered using static rendering and optimized using React 19. It serves static layout elements instantly and handles dynamic data fetching asynchronously via React Query.',
    flow: 'User Action ➔ Next.js client intercepts ➔ Fires AJAX request to API Gateway',
    connections: ['gateway'],
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    tech: 'Nginx Proxy',
    icon: <Network size={20} />,
    color: '#00F5FF',
    title: 'API Gateway — Nginx Reverse Proxy',
    desc: 'The single entry checkpoint for all web requests. Offloads SSL handshakes, strips CORS headers, and routes `/api/**` traffic directly to Spring Boot backend services.',
    flow: 'HTTPS Request ➔ SSL Decryption ➔ Header Sanitization ➔ Proxy Forward to Port 8888',
    connections: ['auth', 'services'],
  },
  {
    id: 'auth',
    name: 'Auth Security',
    tech: 'Spring Security / JWT',
    icon: <KeyRound size={20} />,
    color: '#EF4444',
    title: 'Authentication Service — Security Context Filter',
    desc: 'Stateless access authorization filter. Validates signature claims on incoming JWT tokens, handles admin credential matches via BCrypt, and injects user profiles into the Spring security context.',
    flow: 'Filter checks authorization header ➔ Verifies RS256 JWT key claims ➔ Sets security session',
    connections: ['services'],
  },
  {
    id: 'services',
    name: 'Core Services',
    tech: 'Spring Boot 3.5',
    icon: <Server size={20} />,
    color: '#6366F1',
    title: 'Core Services — Spring Boot Business Logic',
    desc: 'Processes business models and operations. Serves projects datasets, updates blog entries, captures analytical telemetries, and handles automated rate-limiting checks.',
    flow: 'Processes logic ➔ Queries Redis Cache (Read-heavy) ➔ Queries Postgres (Write/Transactional)',
    connections: ['cache', 'database'],
  },
  {
    id: 'cache',
    name: 'Cache Layer',
    tech: 'Redis Memory Cache',
    icon: <Zap size={20} />,
    color: '#FBB324',
    title: 'Cache Layer — Redis Memory Storage',
    desc: 'High-speed key-value cache. Stores frequently loaded assets and rate limit session trackers, reducing SQL fetch demands by up to 60%.',
    flow: 'Check cache ➔ HIT: return cached JSON ➔ MISS: fetch DB ➔ write to cache ➔ return',
    connections: [],
  },
  {
    id: 'database',
    name: 'Database',
    tech: 'PostgreSQL DB',
    icon: <Database size={20} />,
    color: '#22C55E',
    title: 'Database — PostgreSQL Storage',
    desc: 'Persistent transactional database managed with Flyway schema versioning. Configured with optimized index tables on query slugs and composite timestamp logs.',
    flow: 'Spring Boot JPA leases connection ➔ Runs parameterized queries ➔ Commits transaction',
    connections: [],
  },
];

export default function ArchitectureShowcase() {
  const [activeId, setActiveId] = useState<string>('client');
  const trackAction = useTelemetryStore((state) => state.trackAction);

  const activeNode = archNodes.find((n) => n.id === activeId) || archNodes[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<HTMLDivElement>(null);
  const databaseRef = useRef<HTMLDivElement>(null);

  const [paths, setPaths] = useState({
    clientToGateway: '',
    gatewayToAuth: '',
    gatewayToServices: '',
    authToServices: '',
    servicesToCache: '',
    servicesToDatabase: '',
  });

  const updatePaths = () => {
    if (
      !containerRef.current ||
      !clientRef.current ||
      !gatewayRef.current ||
      !authRef.current ||
      !servicesRef.current ||
      !cacheRef.current ||
      !databaseRef.current
    ) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const getCoords = (el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        width: rect.width,
        height: rect.height,
        centerX: rect.left - containerRect.left + rect.width / 2,
        centerY: rect.top - containerRect.top + rect.height / 2,
      };
    };

    const client = getCoords(clientRef.current);
    const gateway = getCoords(gatewayRef.current);
    const auth = getCoords(authRef.current);
    const services = getCoords(servicesRef.current);
    const cache = getCoords(cacheRef.current);
    const database = getCoords(databaseRef.current);

    const getCurvePath = (
      from: any,
      to: any,
      fromDir: 'right' | 'bottom' | 'top' | 'left',
      toDir: 'right' | 'bottom' | 'top' | 'left'
    ) => {
      let startX = 0, startY = 0, endX = 0, endY = 0;

      if (fromDir === 'right') { startX = from.right; startY = from.centerY; }
      else if (fromDir === 'bottom') { startX = from.centerX; startY = from.bottom; }
      else if (fromDir === 'left') { startX = from.left; startY = from.centerY; }
      else if (fromDir === 'top') { startX = from.centerX; startY = from.top; }

      if (toDir === 'right') { endX = to.right; endY = to.centerY; }
      else if (toDir === 'bottom') { endX = to.centerX; endY = to.bottom; }
      else if (toDir === 'left') { endX = to.left; endY = to.centerY; }
      else if (toDir === 'top') { endX = to.centerX; endY = to.top; }

      const dx = Math.abs(endX - startX);
      const dy = Math.abs(endY - startY);
      
      let cp1X = startX;
      let cp1Y = startY;
      let cp2X = endX;
      let cp2Y = endY;

      if (fromDir === 'right') cp1X += dx * 0.45;
      else if (fromDir === 'left') cp1X -= dx * 0.45;
      else if (fromDir === 'bottom') cp1Y += dy * 0.45;
      else if (fromDir === 'top') cp1Y -= dy * 0.45;

      if (toDir === 'right') cp2X += dx * 0.45;
      else if (toDir === 'left') cp2X -= dx * 0.45;
      else if (toDir === 'bottom') cp2Y += dy * 0.45;
      else if (toDir === 'top') cp2Y -= dy * 0.45;

      return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    };

    // Determine layout mode: if gateway is above auth vertically, we are in vertical/stacked mobile mode
    const isMobile = gateway.bottom < auth.top;

    if (isMobile) {
      setPaths({
        clientToGateway: getCurvePath(client, gateway, 'bottom', 'top'),
        gatewayToAuth: getCurvePath(gateway, auth, 'bottom', 'top'),
        gatewayToServices: getCurvePath(gateway, services, 'bottom', 'top'),
        authToServices: getCurvePath(auth, services, 'bottom', 'top'),
        servicesToCache: getCurvePath(services, cache, 'bottom', 'top'),
        servicesToDatabase: getCurvePath(services, database, 'bottom', 'top'),
      });
    } else {
      setPaths({
        clientToGateway: getCurvePath(client, gateway, 'right', 'left'),
        gatewayToAuth: getCurvePath(gateway, auth, 'top', 'bottom'),
        gatewayToServices: getCurvePath(gateway, services, 'right', 'left'),
        authToServices: getCurvePath(auth, services, 'bottom', 'top'),
        servicesToCache: getCurvePath(services, cache, 'right', 'left'),
        servicesToDatabase: getCurvePath(services, database, 'bottom', 'top'),
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePaths();
    }, 150);

    if (typeof window !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(() => {
        updatePaths();
      });
      observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }
    return () => clearTimeout(timer);
  }, []);

  const handleSelectNode = (id: string, name: string) => {
    trackAction('SELECT_ARCH_NODE', name);
    setActiveId(id);
  };

  const isPathActive = (from: string, to: string) => {
    if (activeId === 'client') return from === 'client' && to === 'gateway';
    if (activeId === 'gateway') return (from === 'client' && to === 'gateway') || (from === 'gateway' && (to === 'auth' || to === 'services'));
    if (activeId === 'auth') return (from === 'client' && to === 'gateway') || (from === 'gateway' && to === 'auth') || (from === 'auth' && to === 'services');
    if (activeId === 'services') return (from === 'client' && to === 'gateway') || (from === 'gateway' && to === 'services') || (from === 'auth' && to === 'services') || (from === 'services' && (to === 'cache' || to === 'database'));
    if (activeId === 'cache') return (from === 'client' && to === 'gateway') || (from === 'gateway' && to === 'services') || (from === 'auth' && to === 'services') || (from === 'services' && to === 'cache');
    if (activeId === 'database') return (from === 'client' && to === 'gateway') || (from === 'gateway' && to === 'services') || (from === 'auth' && to === 'services') || (from === 'services' && to === 'database');
    return false;
  };

  return (
    <section id="architecture" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      {/* Visual background grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.02),transparent_70%)] pointer-events-none"></div>

      <div className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
        // System Blueprint
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
        Interactive Architecture
      </h2>
      <p className="text-muted text-xs md:text-sm font-light max-w-xl mb-12">
        Click any node in the microservices pipeline to highlight the request route, view backend parameters, and inspect the sequence flow.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle: Connection network mapping (Interactive Nodes + SVG connections) */}
        <div 
          ref={containerRef}
          className="lg:col-span-2 p-4 md:p-8 rounded-xl border border-border/10 bg-white/2 relative min-h-[380px] lg:min-h-[420px] flex items-center justify-center overflow-hidden"
        >
          
          {/* Animated SVG Path connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="gradient-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#00F5FF" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Client -> Gateway Path */}
            <path 
              d={paths.clientToGateway} 
              stroke={isPathActive('client', 'gateway') ? '#8B5CF6' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('client', 'gateway') ? 2.5 : 1}
              strokeDasharray={isPathActive('client', 'gateway') ? '5,5' : 'none'}
              className={isPathActive('client', 'gateway') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />

            {/* Gateway -> Auth Path */}
            <path 
              d={paths.gatewayToAuth} 
              stroke={isPathActive('gateway', 'auth') ? '#EF4444' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('gateway', 'auth') ? 2.5 : 1}
              strokeDasharray={isPathActive('gateway', 'auth') ? '5,5' : 'none'}
              className={isPathActive('gateway', 'auth') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />

            {/* Gateway -> Services Path */}
            <path 
              d={paths.gatewayToServices} 
              stroke={isPathActive('gateway', 'services') ? '#6366F1' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('gateway', 'services') ? 2.5 : 1}
              strokeDasharray={isPathActive('gateway', 'services') ? '5,5' : 'none'}
              className={isPathActive('gateway', 'services') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />

            {/* Auth -> Services Path */}
            <path 
              d={paths.authToServices} 
              stroke={isPathActive('auth', 'services') ? '#6366F1' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('auth', 'services') ? 2.5 : 1}
              strokeDasharray={isPathActive('auth', 'services') ? '5,5' : 'none'}
              className={isPathActive('auth', 'services') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />

            {/* Services -> Cache Path */}
            <path 
              d={paths.servicesToCache} 
              stroke={isPathActive('services', 'cache') ? '#FBB324' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('services', 'cache') ? 2.5 : 1}
              strokeDasharray={isPathActive('services', 'cache') ? '5,5' : 'none'}
              className={isPathActive('services', 'cache') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />

            {/* Services -> DB Path */}
            <path 
              d={paths.servicesToDatabase} 
              stroke={isPathActive('services', 'database') ? '#22C55E' : 'rgba(255,255,255,0.03)'} 
              strokeWidth={isPathActive('services', 'database') ? 2.5 : 1}
              strokeDasharray={isPathActive('services', 'database') ? '5,5' : 'none'}
              className={isPathActive('services', 'database') ? 'animate-[dash_1.5s_linear_infinite]' : ''}
              fill="none" 
            />
          </svg>

          {/* HTML Nodes Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 h-auto lg:h-[350px] w-full z-10 relative py-6 lg:py-0">
            {/* NextJS Client */}
            <div 
              ref={clientRef}
              onClick={() => handleSelectNode('client', 'Client Layer')}
              className={`row-start-1 lg:row-start-2 col-start-1 lg:col-start-1 col-span-2 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 ${
                activeId === 'client' 
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/8 shadow-[0_0_15px_rgba(139,92,246,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#8B5CF6]">{archNodes[0].icon}</span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">NextJS Client</span>
            </div>

            {/* API Gateway */}
            <div 
              ref={gatewayRef}
              onClick={() => handleSelectNode('gateway', 'API Gateway')}
              className={`row-start-2 lg:row-start-2 col-start-1 lg:col-start-2 col-span-2 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 ${
                activeId === 'gateway' 
                  ? 'border-[#00F5FF] bg-[#00F5FF]/8 shadow-[0_0_15px_rgba(0,245,255,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#00F5FF]">{archNodes[1].icon}</span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">API Gateway</span>
            </div>

            {/* Auth Context */}
            <div 
              ref={authRef}
              onClick={() => handleSelectNode('auth', 'Auth Security')}
              className={`row-start-3 lg:row-start-1 col-start-1 lg:col-start-3 col-span-1 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 lg:-mt-6 ${
                activeId === 'auth' 
                  ? 'border-[#EF4444] bg-[#EF4444]/8 shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#EF4444]"><ShieldCheck size={18} /></span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">Auth Context</span>
            </div>

            {/* Spring Service */}
            <div 
              ref={servicesRef}
              onClick={() => handleSelectNode('services', 'Core Services')}
              className={`row-start-3 lg:row-start-2 col-start-2 lg:col-start-4 col-span-1 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 ${
                activeId === 'services' 
                  ? 'border-[#6366F1] bg-[#6366F1]/8 shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#6366F1]">{archNodes[3].icon}</span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">Spring Service</span>
            </div>

            {/* Redis Cache */}
            <div 
              ref={cacheRef}
              onClick={() => handleSelectNode('cache', 'Cache Layer')}
              className={`row-start-4 lg:row-start-2 col-start-1 lg:col-start-5 col-span-1 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 ${
                activeId === 'cache' 
                  ? 'border-[#FBB324] bg-[#FBB324]/8 shadow-[0_0_15px_rgba(251,191,36,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#FBB324]">{archNodes[4].icon}</span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">Redis Cache</span>
            </div>

            {/* Postgres DB */}
            <div 
              ref={databaseRef}
              onClick={() => handleSelectNode('database', 'Database')}
              className={`row-start-4 lg:row-start-3 col-start-2 lg:col-start-4 col-span-1 lg:col-span-1 p-3 rounded-lg border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 self-center mx-auto w-28 h-20 lg:-mb-6 ${
                activeId === 'database' 
                  ? 'border-[#22C55E] bg-[#22C55E]/8 shadow-[0_0_15px_rgba(34,197,94,0.25)]' 
                  : 'border-white/5 bg-white/3 hover:border-white/20'
              }`}
            >
              <span className="text-[#22C55E]">{archNodes[5].icon}</span>
              <span className="text-[10px] font-mono font-bold text-white leading-tight">Postgres DB</span>
            </div>
          </div>
        </div>

        {/* Right: Component Detail Card */}
        <div className="p-6 md:p-8 rounded-xl glass-card relative overflow-hidden flex flex-col gap-6">
          {/* Accent Line */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 transition-colors duration-300"
            style={{ backgroundColor: activeNode.color }}
          ></div>

          <div>
            <h3 className="text-base font-bold font-mono mb-2 text-white">
              {activeNode.title}
            </h3>
            <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
              {activeNode.desc}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5">
            <h4 className="text-[10px] font-mono text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Network size={12} style={{ color: activeNode.color }} />
              Request Flow Sequence
            </h4>
            <div className="bg-[#05050C] p-4 rounded border border-white/5 font-mono text-[9.5px] text-muted leading-relaxed select-text">
              {activeNode.flow}
            </div>
          </div>
        </div>

      </div>

      {/* Connection path animations */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </section>
  );
}
