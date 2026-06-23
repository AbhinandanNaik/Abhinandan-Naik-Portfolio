'use client';

import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useTelemetryStore } from '@/store/telemetryStore';
import { Palette, X } from 'lucide-react';

const presets = [
  { name: 'Neon Blue', value: '#00F5FF' },
  { name: 'Neon Purple', value: '#8B5CF6' },
  { name: 'Neon Green', value: '#22C55E' },
  { name: 'Neon Pink', value: '#FF007F' },
  { name: 'Solar Orange', value: '#FF5722' },
  { name: 'Amber Gold', value: '#FBB324' },
];

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const accentColor = useThemeStore((state) => state.accentColor);
  const setAccentColor = useThemeStore((state) => state.setAccentColor);
  const trackAction = useTelemetryStore((state) => state.trackAction);

  const handleSelectColor = (color: string) => {
    trackAction('CHANGE_ACCENT_COLOR', color);
    setAccentColor(color);
  };

  return (
    <>
      {/* Floating Control Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-12 h-12 rounded-full border border-white/10 bg-[#0A0A16]/80 text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-accent hover:scale-105 transition-all duration-300 z-40 cursor-pointer"
        title="Customize Color Theme"
        style={{ borderColor: isOpen ? accentColor : undefined }}
      >
        <Palette size={20} style={{ color: accentColor }} />
      </button>

      {/* Glassmorphic Selector Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 p-5 w-64 rounded-xl border border-accent/20 bg-[#0A0A16]/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">// System Spectrum</span>
              <p className="text-[8px] text-muted font-mono uppercase tracking-widest mt-0.5">Customize Accent Lines</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-6 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleSelectColor(preset.value)}
                className={`w-7 h-7 rounded-full transition-transform hover:scale-115 cursor-pointer relative border ${
                  accentColor.toLowerCase() === preset.value.toLowerCase()
                    ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                    : 'border-white/10'
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">Custom Hex</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/60">{accentColor.toUpperCase()}</span>
              <label className="w-6 h-6 rounded border border-white/10 cursor-pointer overflow-hidden relative flex items-center justify-center hover:border-white/30 transition-colors">
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={accentColor}
                  onChange={(e) => handleSelectColor(e.target.value)}
                />
                <div className="w-4 h-4 rounded-sm border border-white/10" style={{ backgroundColor: accentColor }} />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
