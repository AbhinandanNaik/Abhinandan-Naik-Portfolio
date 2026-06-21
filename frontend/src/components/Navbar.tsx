'use client';

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '@/store/telemetryStore';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const trackAction = useTelemetryStore((state) => state.trackAction);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    trackAction('NAVIGATE_SECTION', section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 ${
        scrolled
          ? 'bg-bg/85 backdrop-blur-md border-b border-border/40 py-3'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between relative">
        {/* Logo */}
        <div 
          className="font-mono text-lg font-bold text-accent tracking-widest cursor-pointer select-none"
          onClick={() => handleNavClick('home')}
        >
          &lt;AN /&gt;
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {['about', 'experience', 'skills', 'projects', 'architecture', 'certifications', 'contact'].map((item) => (
            <li key={item} className="m-0 p-0">
              <button
                onClick={() => handleNavClick(item)}
                className="text-muted font-medium text-xs tracking-wider uppercase hover:text-accent transition-colors duration-250 cursor-pointer bg-transparent border-none p-0"
              >
                {item === 'architecture' ? 'Arch' : item}
              </button>
            </li>
          ))}
        </ul>

        {/* Action Button / Hire Me */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNavClick('contact')}
            className="border border-accent text-accent px-5 py-1.5 rounded font-mono text-xs tracking-wider hover:bg-accent hover:text-bg transition-all duration-300 cursor-pointer bg-transparent"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-accent cursor-pointer bg-transparent border-none p-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-bg border border-border/40 flex flex-col p-6 gap-6 md:hidden glass-card rounded-b-lg">
            {['about', 'experience', 'skills', 'projects', 'architecture', 'certifications', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-muted hover:text-accent font-medium text-sm tracking-wider uppercase text-left py-2 border-b border-white/5 bg-transparent border-none cursor-pointer"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('contact')}
              className="border border-accent text-accent py-2.5 rounded font-mono text-sm tracking-wider text-center hover:bg-accent hover:text-bg transition-all duration-300 cursor-pointer bg-transparent"
            >
              Hire Me
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
