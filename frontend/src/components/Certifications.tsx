'use client';

import React from 'react';
import { ShieldCheck, Link2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface DBCertification {
  id: number;
  name: string;
  organization: string;
  issueDate: string;
  verificationUrl?: string;
  skillsGained?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const fallbackCerts: DBCertification[] = [
  {
    id: 1,
    name: 'AWS Cloud Practitioner',
    organization: 'Amazon Web Services',
    issueDate: 'Issued 2024',
    verificationUrl: 'https://aws.amazon.com/verification',
    skillsGained: 'Cloud Infrastructure · EC2 · S3 · CloudFront',
  },
  {
    id: 2,
    name: 'Spring Boot Microservices',
    organization: 'Udemy / Spring.io',
    issueDate: 'Issued 2024',
    verificationUrl: 'https://www.credly.com/org/udemy/badge/spring-boot-microservices',
    skillsGained: 'Spring Security · Caching · Configuration Profiles',
  },
  {
    id: 3,
    name: 'Docker & Kubernetes',
    organization: 'DevOps Track',
    issueDate: 'Issued 2023',
    verificationUrl: 'https://www.credly.com/org/docker/badge/docker-kubernetes',
    skillsGained: 'Containers · Images · Orchestration · Volumes',
  },
];

const getCertIcon = (name: string, org: string) => {
  const normalized = (name + ' ' + org).toLowerCase();
  if (normalized.includes('aws') || normalized.includes('cloud')) return '☁️';
  if (normalized.includes('spring') || normalized.includes('java') || normalized.includes('hibernate') || normalized.includes('jpa')) return '☕';
  if (normalized.includes('docker') || normalized.includes('kubernetes') || normalized.includes('devops') || normalized.includes('containers')) return '🐳';
  if (normalized.includes('ai') || normalized.includes('generative') || normalized.includes('llm') || normalized.includes('google')) return '🤖';
  if (normalized.includes('algorithm') || normalized.includes('leetcode') || normalized.includes('problem solving')) return '🔢';
  return '🏅';
};

export default function Certifications() {
  const { data: dbCerts = fallbackCerts } = useQuery<DBCertification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/certifications`);
      if (!response.ok) throw new Error('API fetch failed');
      return response.json();
    },
  });

  const certs = dbCerts.map((c) => ({
    id: c.id,
    name: c.name,
    org: c.organization,
    date: c.issueDate.startsWith('Issued') || c.issueDate.includes('202') ? c.issueDate : `Issued ${c.issueDate}`,
    url: c.verificationUrl,
    skills: c.skillsGained || '',
    icon: getCertIcon(c.name, c.organization),
  }));

  return (
    <section id="certifications" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      <div className="text-secondary font-mono text-xs tracking-widest uppercase mb-2">
        // Verified Accreditations
      </div>
      <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-12">
        Certifications
      </h2>

      {/* Grid of Certs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-xl glass-card relative overflow-hidden flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-350"
          >
            {/* Top Indicator Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary to-accent opacity-70 group-hover:opacity-100 transition-opacity"></div>

            {/* Icon & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-3xl select-none">{c.icon}</span>
              <span className="text-[9px] font-mono font-bold text-highlight border border-highlight/20 bg-highlight/5 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck size={10} />
                VERIFIED
              </span>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-sm font-bold text-white font-mono group-hover:text-accent transition-colors duration-250">
                {c.name}
              </h3>
              <div className="text-xs text-secondary font-mono mt-0.5">{c.org}</div>
              <div className="text-[10px] text-muted font-mono mt-1">{c.date}</div>
            </div>

            {/* Skills learned */}
            <p className="text-[11px] text-muted/80 leading-relaxed font-light mt-2 border-t border-white/5 pt-3">
              {c.skills}
            </p>

            {/* Action Verify Link */}
            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1 mt-2 cursor-pointer self-start"
              >
                <Link2 size={12} />
                Verify Credential
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
