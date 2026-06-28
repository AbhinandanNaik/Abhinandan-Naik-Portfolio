'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface HeatmapRow {
  label: string;
  intensity: number[];
}

interface DBSkill {
  id: number;
  name: string;
  category: string;
  proficiencyLevel: number;
}

import { API_BASE } from '@/config/api';

const fallbackSkills: DBSkill[] = [
  { id: 1, name: 'Java', category: 'Backend', proficiencyLevel: 9 },
  { id: 2, name: 'Spring Boot', category: 'Backend', proficiencyLevel: 9 },
  { id: 3, name: 'PostgreSQL', category: 'Database', proficiencyLevel: 8 },
  { id: 4, name: 'Docker', category: 'Cloud', proficiencyLevel: 8 },
  { id: 5, name: 'Spring Security', category: 'Backend', proficiencyLevel: 8 },
  { id: 6, name: 'System Design', category: 'Architecture', proficiencyLevel: 8 },
  { id: 7, name: 'REST APIs', category: 'Backend', proficiencyLevel: 9 },
  { id: 8, name: 'CI/CD', category: 'Tools', proficiencyLevel: 7 },
];

const getIntensity = (level: number, skillName: string) => {
  const seed = skillName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: 16 }, (_, idx) => {
    const offset = ((seed + idx * 7) % 3) - 1; // deterministically returns -1, 0, or 1
    return Math.min(10, Math.max(1, level + offset));
  });
};

export default function SkillsHeatmap() {
  const { data: dbSkills = fallbackSkills } = useQuery<DBSkill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/skills`);
      if (!response.ok) throw new Error('API fetch failed');
      return response.json();
    },
  });

  const data: HeatmapRow[] = dbSkills.map((s) => ({
    label: s.name,
    intensity: getIntensity(s.proficiencyLevel, s.name),
  }));


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
