'use client';

import React from 'react';

interface HeatmapRow {
  label: string;
  intensity: number[];
}

export default function SkillsHeatmap() {
  const data: HeatmapRow[] = [
    { label: 'Java', intensity: [9, 8, 9, 9, 8, 9, 10, 9, 8, 9, 10, 9, 8, 9, 9, 8] },
    { label: 'Spring Boot', intensity: [8, 9, 8, 9, 9, 8, 9, 10, 9, 8, 9, 8, 9, 9, 8, 9] },
    { label: 'PostgreSQL', intensity: [7, 8, 7, 8, 8, 9, 8, 8, 7, 9, 8, 7, 8, 9, 8, 7] },
    { label: 'Docker', intensity: [6, 7, 6, 7, 8, 7, 7, 8, 7, 6, 8, 7, 6, 8, 7, 8] },
    { label: 'Spring Security', intensity: [8, 7, 8, 8, 7, 8, 9, 8, 8, 7, 8, 9, 8, 7, 8, 8] },
    { label: 'System Design', intensity: [6, 7, 7, 8, 7, 8, 7, 8, 8, 9, 8, 7, 9, 8, 8, 9] },
    { label: 'REST APIs', intensity: [9, 9, 8, 9, 9, 9, 10, 9, 9, 8, 9, 10, 9, 9, 8, 9] },
    { label: 'CI/CD', intensity: [5, 6, 6, 7, 6, 7, 7, 7, 8, 7, 7, 8, 7, 8, 8, 8] },
  ];

  return (
    <section id="heatmap" className="relative py-16 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      <div className="text-highlight font-mono text-xs tracking-widest uppercase mb-2">
        // Intensity Matrix
      </div>
      <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-8">
        Proficiency Heatmap
      </h2>

      {/* Grid Container */}
      <div className="p-6 rounded-xl border border-white/5 bg-white/2 overflow-x-auto flex flex-col gap-3 scrollbar-thin">
        <div className="min-w-[600px] flex flex-col gap-3 font-mono">
          {data.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              {/* Row Label */}
              <div className="w-32 text-right text-xs text-muted font-mono pr-2 border-r border-white/5 shrink-0">
                {row.label}
              </div>

              {/* Intensity Cells */}
              <div className="flex gap-1.5">
                {row.intensity.map((val, idx) => {
                  const alpha = val / 10;
                  return (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-sm transition-all duration-200 cursor-pointer hover:scale-130"
                      style={{
                        background: `rgba(var(--accent-rgb), ${alpha * 0.95})`,
                        border: `1px solid rgba(var(--accent-rgb), ${alpha * 0.3})`,
                        boxShadow: val >= 9 ? '0 0 8px rgba(var(--accent-rgb), 0.2)' : 'none',
                      }}
                      title={`${row.label} Proficiency: ${val}/10`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-4 mt-6 border-t border-white/5 pt-4 text-[10px] font-mono text-muted">
          <span>Low Proficiency</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <div
                key={v}
                className="w-4.5 h-4.5 rounded-sm"
                style={{
                  background: `rgba(var(--accent-rgb), ${(v / 10) * 0.9})`,
                  border: `1px solid rgba(var(--accent-rgb), ${(v / 10) * 0.3})`,
                }}
              />
            ))}
          </div>
          <span>Expert Core</span>
        </div>
      </div>
    </section>
  );
}
