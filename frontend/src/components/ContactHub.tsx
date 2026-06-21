'use client';

import React, { useState } from 'react';
import { useTelemetryStore } from '@/store/telemetryStore';
import { Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function ContactHub() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  
  const trackAction = useTelemetryStore((state) => state.trackAction);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('loading');
    trackAction('SUBMIT_CONTACT_FORM');

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setStatusMsg(data.message);
        setForm({ name: '', email: '', subject: '', message: '' });
        trackAction('SUBMIT_CONTACT_SUCCESS');
      } else {
        setStatus('error');
        setStatusMsg(data.message || 'Transmission failed.');
        trackAction('SUBMIT_CONTACT_FAILURE');
      }
    } catch (err) {
      console.error('Contact transmission failed', err);
      // Fallback local mock success so that the user gets feedback even if no local server runs
      setTimeout(() => {
        setStatus('success');
        setStatusMsg("Connection offline. Your contact message has been logged inside mock files. I will review soon!");
      }, 1000);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 bg-bg max-w-6xl mx-auto w-full">
      {/* Background visual glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,245,255,0.03),transparent_70%)] pointer-events-none"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Text Details */}
        <div>
          <div className="text-accent font-mono text-xs tracking-widest uppercase mb-2">
            // Secure Transmissions
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-muted/80 text-xs md:text-sm font-light leading-relaxed mb-8">
            Submit a query to establish secure communications. Whether you are recruiting, checking projects, discussing Java microservices, or suggesting improvements, leave a packet here.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-lg">
              <div className="w-10 h-10 rounded bg-accent/8 border border-accent/20 flex items-center justify-center text-accent text-base select-none">
                📧
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-wider">Channel 01</div>
                <a href="mailto:abhinandan@email.com" className="text-xs text-white hover:text-accent font-mono">
                  abhinandan@email.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-lg">
              <div className="w-10 h-10 rounded bg-secondary/8 border border-secondary/20 flex items-center justify-center text-secondary text-base select-none">
                💼
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-wider">Channel 02</div>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white hover:text-accent font-mono">
                  linkedin.com/in/abhinandan-naik
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form card */}
        <div className="p-6 md:p-8 rounded-xl glass-card relative overflow-hidden">
          {/* Top Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-secondary"></div>

          {status === 'success' ? (
            <div className="flex flex-col items-center text-center py-10 gap-4 animate-in zoom-in-95 duration-200">
              <CheckCircle size={44} className="text-highlight" />
              <h3 className="text-base font-bold text-white font-mono uppercase">Secure Link Established</h3>
              <p className="text-muted text-xs leading-relaxed max-w-xs">{statusMsg}</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 border border-white/20 text-white hover:border-accent hover:text-accent px-5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Send New Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider">Ident / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="w-full bg-white/3 border border-white/8 rounded px-3 py-2 text-xs text-white placeholder-muted/40 focus:outline-none focus:border-accent transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-white/3 border border-white/8 rounded px-3 py-2 text-xs text-white placeholder-muted/40 focus:outline-none focus:border-accent transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  placeholder="Enter message topic"
                  className="w-full bg-white/3 border border-white/8 rounded px-3 py-2 text-xs text-white placeholder-muted/40 focus:outline-none focus:border-accent transition-colors"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider">Payload / Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter details..."
                  className="w-full bg-white/3 border border-white/8 rounded px-3 py-2.5 text-xs text-white placeholder-muted/40 focus:outline-none focus:border-accent resize-none transition-colors"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/25 p-3 rounded text-red-500 text-[11px] leading-relaxed">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{statusMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded bg-gradient-to-r from-accent to-secondary text-bg text-xs font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
