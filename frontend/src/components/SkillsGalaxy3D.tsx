'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useThemeStore } from '@/store/themeStore';
import { Sparkles, Milestone, Award, X } from 'lucide-react';

// ─── TYPES ──────────────────────────────────────────────────

interface SkillCategory {
  id: string;
  name: string;
  experience: string;
  color: string;
  radius: number;
  speed: number;
  technologies: string[];
  projects: string[];
  icon: string;
  moons: string[]; // Sub-skills represented as orbiting moons
}

// ─── GALAXY DATA ────────────────────────────────────────────

const categories: SkillCategory[] = [
  {
    id: 'backend',
    name: 'Backend / Core',
    experience: '2+ Years',
    color: '#00F5FF',
    radius: 2.5,
    speed: 0.22,
    technologies: ['Java 21', 'Spring Boot 3.5', 'Spring Security', 'Hibernate/JPA', 'JWT Auth', 'Maven'],
    projects: ['TrackWise Asset System', 'Digit core integrations'],
    icon: '☕',
    moons: ['Java', 'Boot', 'JPA'],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    experience: '1 Year',
    color: '#8B5CF6',
    radius: 3.8,
    speed: 0.16,
    technologies: ['React 19', 'Next.js 15', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Zustand'],
    projects: ['TrackWise Dashboard', 'Personal 3D HQ'],
    icon: '⚛️',
    moons: ['Next', 'TS', 'Motion'],
  },
  {
    id: 'databases',
    name: 'Databases',
    experience: '2 Years',
    color: '#22C55E',
    radius: 5.0,
    speed: 0.11,
    technologies: ['PostgreSQL', 'MySQL', 'Redis', 'Flyway migrations', 'SQL query optimizations'],
    projects: ['TrackWise DB Schema', 'Digit DB audits'],
    icon: '🗄️',
    moons: ['PG', 'Redis', 'SQL'],
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    experience: '1 Year',
    color: '#FBB324',
    radius: 6.2,
    speed: 0.08,
    technologies: ['AWS EC2', 'AWS S3', 'CloudFront CDN', 'Route 53', 'Nginx proxying'],
    projects: ['AWS platform orchestration', 'Nginx proxy setups'],
    icon: '☁️',
    moons: ['EC2', 'S3', 'Nginx'],
  },
  {
    id: 'devops',
    name: 'DevOps & Tools',
    experience: '2 Years',
    color: '#EF4444',
    radius: 7.4,
    speed: 0.06,
    technologies: ['Docker', 'Docker Compose', 'GitHub Actions CI/CD', 'Git/GitHub', 'Prometheus', 'Grafana'],
    projects: ['Automated CI/CD pipelines', 'Telemetry scraper containers'],
    icon: '🔧',
    moons: ['Docker', 'CI/CD', 'Git'],
  },
  {
    id: 'architecture',
    name: 'Architecture',
    experience: '2 Years',
    color: '#6366F1',
    radius: 8.6,
    speed: 0.04,
    technologies: ['Microservices', 'API Gateway patterns', 'Distributed Caching', 'System Design'],
    projects: ['Smart Bin waste monitoring', 'TrackWise decoupled gateway'],
    icon: '🏗️',
    moons: ['System', 'Gateway', 'Caching'],
  },
];

// ─── CAMERA LERP AND FOCUS CONTROLLER ───────────────────────

interface CameraControllerProps {
  selectedPlanet: SkillCategory | null;
}

function CameraController({ selectedPlanet }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 7, 9));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (selectedPlanet) {
      // Set target position relative to the selected planet's current orbit position
      targetLookAt.current.set(0, 0, 0); // we will approximate looking toward center/planet
    } else {
      targetPos.current.set(0, 9, 12);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [selectedPlanet]);

  useFrame((state) => {
    if (selectedPlanet) {
      // Find the selected planet group by name
      const planetGroup = state.scene.getObjectByName(selectedPlanet.id);
      if (planetGroup) {
        const worldPos = new THREE.Vector3();
        planetGroup.getWorldPosition(worldPos);

        // Position camera slightly offset from the planet for a cinematic view
        targetPos.current.set(
          worldPos.x + 1.2,
          worldPos.y + 1.0,
          worldPos.z + 2.0
        );
        targetLookAt.current.copy(worldPos);
      }
    }

    // Smoothly interpolate (lerp) camera position and lookAt direction
    camera.position.lerp(targetPos.current, 0.04);
    
    // Create a dummy lookAt vector to lerp the lookAt target
    const currentLookAt = new THREE.Vector3(0, 0, -3);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// ─── 3D ORBIT NODES WITH MOONS & RINGS ──────────────────────

interface PlanetNodeProps {
  cat: SkillCategory;
  onSelect: (cat: SkillCategory) => void;
  activeId: string | null;
}

function PlanetNode({ cat, onSelect, activeId }: PlanetNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const moonsRef = useRef<THREE.Group[]>([]);
  const [hovered, setHovered] = useState(false);
  const active = activeId === cat.id;

  // Track pointers to moons to animate them
  const setMoonRef = (el: THREE.Group | null, idx: number) => {
    if (el) moonsRef.current[idx] = el;
  };

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Orbiter coordinates
      const angle = elapsed * cat.speed;
      groupRef.current.position.x = Math.cos(angle) * cat.radius;
      groupRef.current.position.z = Math.sin(angle) * cat.radius;
      
      // Auto rotate the planet body itself
      const planetMesh = groupRef.current.children[0];
      if (planetMesh) {
        planetMesh.rotation.y += 0.008;
      }
    }

    // Animate sub-skill moons orbiting their parent planet
    moonsRef.current.forEach((moon, idx) => {
      if (moon) {
        const moonSpeed = 1.5 + idx * 0.5;
        const moonRadius = 0.45 + idx * 0.12;
        const moonAngle = elapsed * moonSpeed;
        moon.position.x = Math.cos(moonAngle) * moonRadius;
        moon.position.z = Math.sin(moonAngle) * moonRadius;
      }
    });
  });

  return (
    <group 
      ref={groupRef}
      name={cat.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(cat);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* 1. solid Planet Core Sphere */}
      <mesh>
        <sphereGeometry args={[hovered || active ? 0.35 : 0.24, 20, 20]} />
        <meshBasicMaterial 
          color={cat.color} 
          wireframe={hovered}
        />
      </mesh>

      {/* 2. Saturn-like Wireframe Ring System */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshBasicMaterial 
          color={cat.color} 
          transparent 
          opacity={hovered || active ? 0.45 : 0.18} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* 3. Orbiting Sub-skill Moons */}
      {(hovered || active) && cat.moons.map((moonName, i) => (
        <group key={i} ref={(el) => setMoonRef(el, i)}>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={cat.color} />
          </mesh>
          <Html distanceFactor={4} position={[0, 0.15, 0]} center>
            <div className="text-[6px] font-mono text-white/90 bg-bg/80 border border-white/10 px-1 py-0.2 rounded select-none pointer-events-none">
              {moonName}
            </div>
          </Html>
        </group>
      ))}

      {/* 4. Category Label Billboard */}
      <Html distanceFactor={8} position={[0, 0.6, 0]} center>
        <div 
          className="whitespace-nowrap px-3 py-1 rounded bg-[#06060F]/95 border text-[10px] font-mono select-none transition-all duration-300 flex items-center gap-1.5"
          style={{ 
            borderColor: hovered || active ? cat.color : 'rgba(var(--accent-rgb),0.08)',
            color: hovered || active ? '#FFFFFF' : '#94A3B8',
            boxShadow: hovered || active ? `0 0 15px ${cat.color}40` : 'none'
          }}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </div>
      </Html>
    </group>
  );
}

// Fixed orbit lines for alignment
function OrbitRings() {
  const accentColor = useThemeStore((state) => state.accentColor);
  return (
    <group>
      {categories.map((cat, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[cat.radius - 0.015, cat.radius + 0.015, 64]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Pulsing star particles at the galaxy center
function GalacticCoreParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const accentColor = useThemeStore((state) => state.accentColor);
  const count = 300;

  const positions = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      p[i * 3] = Math.cos(angle) * radius;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.45;
      p[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={accentColor}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ─── MAIN SKILLS SECTION ────────────────────────────────────

export default function SkillsGalaxy3D() {
  const [selectedCat, setSelectedCat] = useState<SkillCategory | null>(null);
  const [mounted, setMounted] = useState(false);
  const trackAction = useTelemetryStore((state) => state.trackAction);
  const accentColor = useThemeStore((state) => state.accentColor);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeCategories = React.useMemo(() => {
    return categories.map(cat => cat.id === 'backend' ? { ...cat, color: accentColor } : cat);
  }, [accentColor]);

  const activeSelectedCat = React.useMemo(() => {
    if (!selectedCat) return null;
    return selectedCat.id === 'backend' ? { ...selectedCat, color: accentColor } : selectedCat;
  }, [selectedCat, accentColor]);

  const handleSelectPlanet = (cat: SkillCategory) => {
    trackAction('SELECT_SKILL_PLANET', cat.name);
    setSelectedCat(cat);
  };

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center mb-12 text-center">
        <div className="text-secondary font-mono text-xs tracking-widest uppercase mb-2">
          // Constellation System
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
          3D Skill Galaxy
        </h2>
        <p className="text-muted text-xs md:text-sm font-light max-w-lg mt-2">
          Click any orbiting planet in the interactive canvas to zoom the camera, reveal its orbiting moons (sub-skills), and review technology blueprints.
        </p>
      </div>

      {/* Main Container */}
      <div className="relative border border-border/10 rounded-xl bg-white/2 overflow-hidden h-[520px] flex items-center justify-center">
        
        {/* R3F Canvas Viewport */}
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Canvas camera={{ position: [0, 9, 12], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[0, 0, 0]} intensity={3} color={accentColor} />
              
              {/* Glowing Sun Center */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshBasicMaterial color={accentColor} />
              </mesh>

              <GalacticCoreParticles />
              <OrbitRings />
              <CameraController selectedPlanet={activeSelectedCat} />
              
              {activeCategories.map((cat) => (
                <PlanetNode 
                  key={cat.id} 
                  cat={cat} 
                  onSelect={handleSelectPlanet}
                  activeId={selectedCat ? selectedCat.id : null}
                />
              ))}
            </Canvas>
          )}
        </div>

        {/* Floating Reset Camera View Button */}
        {selectedCat && (
          <button
            onClick={() => setSelectedCat(null)}
            className="absolute bottom-6 left-6 z-10 px-4 py-2 border border-accent/20 bg-bg/95 text-accent font-mono text-[10px] uppercase tracking-wider rounded hover:bg-accent hover:text-bg transition-all cursor-pointer shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]"
            style={{ boxShadow: `0 0 15px ${accentColor}30`, borderColor: `${accentColor}30`, color: accentColor }}
          >
            ⟲ Reset Camera
          </button>
        )}

        {/* Floating Galaxy Legend */}
        <div className="absolute top-4 left-4 z-10 p-4 rounded bg-bg/90 backdrop-blur-md border border-white/5 font-mono text-[9px] text-muted flex flex-col gap-2 pointer-events-none select-none">
          <div className="text-accent uppercase font-bold border-b border-white/5 pb-1 mb-1" style={{ color: accentColor }}>Interactive Legend</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></span> Backend / Core</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span> Frontend</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#22C55E]"></span> Databases</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FBB324]"></span> Cloud & Infra</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Tools & DevOps</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#6366F1]"></span> Architecture</div>
        </div>

        {/* Details Side Drawer (Overlay) */}
        {activeSelectedCat && (
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[370px] bg-[#05050D]/95 backdrop-blur-md border-l border-border/30 z-20 p-8 flex flex-col gap-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCat(null)}
              className="absolute top-4 right-4 text-muted hover:text-accent cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeSelectedCat.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{activeSelectedCat.name}</h3>
                  <div className="text-[10px] font-mono mt-0.5 uppercase tracking-wider" style={{ color: activeSelectedCat.color }}>
                    Experience: {activeSelectedCat.experience}
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles size={12} style={{ color: activeSelectedCat.color }} />
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeSelectedCat.technologies.map((t) => (
                  <span 
                    key={t} 
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/3 border border-white/5 text-muted hover:text-white hover:border-white/10 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Associated Projects */}
            <div>
              <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Milestone size={12} style={{ color: activeSelectedCat.color }} />
                Featured Systems
              </h4>
              <ul className="flex flex-col gap-2 pl-0">
                {activeSelectedCat.projects.map((p, index) => (
                  <li 
                    key={index}
                    className="text-xs text-muted flex items-start gap-2 bg-white/2 border border-white/5 p-3 rounded"
                  >
                    <Award size={14} className="mt-0.5 shrink-0" style={{ color: activeSelectedCat.color }} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        )}
        
      </div>
    </section>
  );
}
