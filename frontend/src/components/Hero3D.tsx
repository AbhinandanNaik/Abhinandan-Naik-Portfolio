'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useThemeStore } from '@/store/themeStore';
import { ArrowRight, Download, Mail } from 'lucide-react';

// ─── 3D SCENE SUB-COMPONENTS ────────────────────────────────

// Grid representing the city floor
function CityFloor() {
  const accentColor = useThemeStore((state) => state.accentColor);
  return (
    <group position={[0, -2, 0]}>
      {/* Primary Cyberpunk Cyan Grid */}
      <gridHelper 
        args={[120, 60, accentColor, '#11152a']} 
        position={[0, 0, 0]} 
      />
      {/* Secondary Violet Grid offset for density */}
      <gridHelper 
        args={[120, 30, '#8B5CF6', 'transparent']} 
        position={[0, 0.01, 0]} 
      />
    </group>
  );
}

// Cyberpunk buildings rendered as detailed architectural models
interface BuildingProps {
  pos: [number, number, number];
  args: [number, number, number];
  color: string;
}

function Skyscraper({ pos, args, color }: BuildingProps) {
  const [w, h, d] = args;
  
  return (
    <group position={pos}>
      {/* 1. Inner solid column representing core structure */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w * 0.95, h, d * 0.95]} />
        <meshBasicMaterial 
          color="#060814" 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* 2. Outer glowing wireframe shell */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshBasicMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.16} 
        />
      </mesh>

      {/* 3. Horizontal floor indicator bands */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[w * 1.01, h * 0.05, d * 1.01]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* 4. Top glowing antenna spool */}
      <mesh position={[0, h / 2 + 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, h / 2 + 0.8, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  );
}

function Buildings() {
  const accentColor = useThemeStore((state) => state.accentColor);
  const buildingData = [
    { pos: [-8, 2, -15] as [number, number, number], args: [2, 8, 2] as [number, number, number], color: '#8B5CF6' },
    { pos: [-4, 1, -20] as [number, number, number], args: [3, 6, 3] as [number, number, number], color: accentColor },
    { pos: [5, 3, -12] as [number, number, number], args: [2.5, 10, 2.5] as [number, number, number], color: accentColor },
    { pos: [9, 1.5, -18] as [number, number, number], args: [4, 7, 4] as [number, number, number], color: '#8B5CF6' },
    { pos: [-13, 0.5, -10] as [number, number, number], args: [2, 5, 2] as [number, number, number], color: '#22C55E' },
    { pos: [13, 1, -14] as [number, number, number], args: [3, 6, 3] as [number, number, number], color: '#22C55E' },
    { pos: [0, 2.5, -25] as [number, number, number], args: [5, 9, 5] as [number, number, number], color: '#8B5CF6' },
  ];

  return (
    <group>
      {buildingData.map((b, i) => (
        <Skyscraper key={i} pos={b.pos} args={b.args} color={b.color} />
      ))}
    </group>
  );
}

// Sweeping spotlight beams
function Spotlights() {
  const accentColor = useThemeStore((state) => state.accentColor);
  const beamRef1 = useRef<THREE.Mesh>(null);
  const beamRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (beamRef1.current) {
      beamRef1.current.rotation.z = Math.sin(elapsed * 0.4) * 0.25;
      beamRef1.current.rotation.x = Math.cos(elapsed * 0.3) * 0.15;
    }
    if (beamRef2.current) {
      beamRef2.current.rotation.z = Math.cos(elapsed * 0.35) * 0.25;
      beamRef2.current.rotation.x = Math.sin(elapsed * 0.4) * 0.15;
    }
  });

  return (
    <group>
      {/* Left Light Beam */}
      <mesh ref={beamRef1} position={[-6, -2, -14]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 1.8, 18, 16]} />
        <meshBasicMaterial 
          color={accentColor} 
          transparent 
          opacity={0.06} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Right Light Beam */}
      <mesh ref={beamRef2} position={[7, -2, -11]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 2.2, 20, 16]} />
        <meshBasicMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={0.05} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Floating tech stack nodes (Holograms)
function TechHolograms() {
  const accentColor = useThemeStore((state) => state.accentColor);
  const techs = [
    { text: 'Java 21', pos: [-4.2, 2.6, -5], color: '#E76F51' },
    { text: 'Spring Boot', pos: [3.8, 3.4, -6], color: '#22C55E' },
    { text: 'PostgreSQL', pos: [-5.2, 0.8, -8], color: accentColor },
    { text: 'Docker', pos: [5.2, 1.4, -4], color: '#2496ED' },
    { text: 'AWS Cloud', pos: [-1.8, 3.9, -7], color: '#FF9900' },
    { text: 'Microservices', pos: [1.8, -0.4, -5], color: '#8B5CF6' }
  ];

  return (
    <group>
      {techs.map((t, i) => (
        <Float key={i} speed={2.5} rotationIntensity={0.3} floatIntensity={1.2}>
          {/* Connector stem line to ground */}
          <mesh position={[t.pos[0], t.pos[1] - 1.5, t.pos[2]]}>
            <cylinderGeometry args={[0.005, 0.005, 3, 4]} />
            <meshBasicMaterial color={t.color} transparent opacity={0.15} />
          </mesh>
          {/* Floating glowing anchor sphere */}
          <mesh position={[t.pos[0], t.pos[1] - 0.2, t.pos[2]]}>
            <octahedronGeometry args={[0.06]} />
            <meshBasicMaterial color={t.color} wireframe />
          </mesh>
          <Text
            position={t.pos as [number, number, number]}
            fontSize={0.38}
            font="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.19/files/jetbrains-mono-latin-400-normal.woff"
            color={t.color}
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.9}
          >
            {t.text}
          </Text>
        </Float>
      ))}
    </group>
  );
}

// Custom particle storm (drifting starfields)
function ParticleStorm() {
  const count = 500;
  const meshRef = useRef<THREE.Points>(null);
  const accentColor = useThemeStore((state) => state.accentColor);

  const points = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 18;
      p[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color={accentColor}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Camera responsive mouse-pan controller
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.8;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const baseZ = 6.2 + Math.sin(elapsed * 0.08) * 0.6;
    
    camera.position.x += (mouse.current.x - camera.position.x) * 0.025;
    camera.position.y += (mouse.current.y - camera.position.y) * 0.025;
    camera.position.z += (baseZ - camera.position.z) * 0.015;
    
    camera.lookAt(0, 1.3, -3.2);
  });

  return null;
}

// ─── MAIN HERO VIEWPORT ─────────────────────────────────────

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const trackAction = useTelemetryStore((state) => state.trackAction);
  const accentColor = useThemeStore((state) => state.accentColor);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleActionClick = (action: string, targetId: string) => {
    trackAction(action);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    trackAction('DOWNLOAD_RESUME');
    const link = document.createElement('a');
    link.href = '/Abhinandan_Naik_Resume.pdf';
    link.download = 'Abhinandan_Naik_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="relative w-full min-h-screen bg-bg overflow-hidden flex items-center justify-center py-20 px-6">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {mounted && (
          <Canvas
            camera={{ position: [0, 1.2, 6.5], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl, scene }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              scene.fog = new THREE.FogExp2('#050816', 0.075);
            }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 15, 10]} intensity={1.8} color={accentColor} />
            <pointLight position={[-10, 8, -5]} intensity={1.0} color="#8B5CF6" />
            
            <Stars radius={100} depth={50} count={2500} factor={4.5} saturation={0.6} fade speed={1.2} />
            <ParticleStorm />
            <CityFloor />
            <Buildings />
            <Spotlights />
            <TechHolograms />
            <CameraController />
          </Canvas>
        )}
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl text-center select-text">
        <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 px-4 py-1.5 rounded-full mb-6 text-[10px] md:text-xs text-accent font-mono tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-highlight animate-ping"></span>
          Available for Opportunities
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 uppercase leading-none select-none text-white">
          Abhinandan <br className="md:hidden" />
          <span className="bg-gradient-to-r from-accent via-secondary to-[#FBB324] bg-clip-text text-transparent">
            Naik
          </span>
        </h1>

        <p className="text-xs md:text-sm font-light text-muted uppercase tracking-widest mb-6">
          Backend Java Engineer & Systems Architect
        </p>

        <p className="max-w-xl mx-auto text-sm md:text-base text-muted/80 leading-relaxed font-light mb-12">
          Engineering scalable, high-throughput distributed architectures using Java, Spring Boot, SQL databases, and modern cloud deployment patterns. Currently engineering backend systems at <span className="text-secondary font-medium">Digit Insurance</span>.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleActionClick('EXPLORE_PORTFOLIO', 'projects')}
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-gradient-to-r from-accent to-blue-500 text-bg text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Explore Projects
            <ArrowRight size={14} />
          </button>
          
          <button
            onClick={handleResumeDownload}
            className="w-full sm:w-auto px-8 py-3.5 rounded border border-white/20 text-white text-xs font-medium uppercase tracking-wider hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Download CV
            <Download size={14} />
          </button>

          <button
            onClick={() => handleActionClick('CLICK_CONTACT_HERO', 'contact')}
            className="w-full sm:w-auto px-8 py-3.5 rounded border border-white/20 text-white text-xs font-medium uppercase tracking-wider hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Contact Me
            <Mail size={14} />
          </button>
        </div>
      </div>

      {/* Decorative Cyberpunk Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
    </section>
  );
}
