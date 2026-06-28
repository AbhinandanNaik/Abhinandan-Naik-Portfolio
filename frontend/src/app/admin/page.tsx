'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useThemeStore } from '@/store/themeStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KeyRound, ShieldAlert, BarChart3, Mail, LogOut, CheckCircle, Cpu, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

import { API_BASE } from '@/config/api';

export default function AdminPage() {
  const { token, isAuthenticated, login, logout } = useAuthStore();
  const trackAction = useTelemetryStore((state) => state.trackAction);
  const queryClient = useQueryClient();
  const accentColor = useThemeStore((state) => state.accentColor);

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    trackAction('VIEW_ADMIN_PAGE');
  }, [trackAction]);

  // Fetch Analytics & Messages
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized or network issue');
      return res.json();
    },
    enabled: isAuthenticated && !!token,
  });

  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['adminMessages'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    enabled: isAuthenticated && !!token,
  });

  // Read message mutation
  const readMessageMutation = useMutation({
    mutationFn: async (msgId: number) => {
      const res = await fetch(`${API_BASE}/admin/messages/${msgId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to update message status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
  });

  // Cache clear mutation
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/admin/cache/clear`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to flush caches');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      alert('All backend caches flushed successfully!');
    },
    onError: () => {
      alert('Failed to flush backend cache. Make sure the server is online.');
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return;

    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      if (!res.ok) {
        setLoginError('Invalid administrator credentials.');
        setLoginLoading(false);
        return;
      }

      const data = await res.json();
      login(data);
    } catch (err) {
      // Local demo login fallback if backend isn't actively running
      if (usernameInput === 'admin' && passwordInput === 'admin123') {
        login({
          accessToken: 'mock_jwt_token_for_dashboard_demo',
          refreshToken: 'mock_refresh_token_for_dashboard_demo',
          username: 'admin',
          role: 'ADMIN',
        });
      } else {
        setLoginError('Authentication server offline.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleToggleRead = (id: number) => {
    readMessageMutation.mutate(id);
  };

  // Reset analytics fallback data to zero / empty
  const localAnalyticsFallback = {
    totalVisits: 0,
    uniqueVisitors: 0,
    resumeDownloads: 0,
    projectViews: 0,
    deviceBreakdown: [],
    countryBreakdown: [],
    pageViews: [],
  };

  const activeMetrics = metrics || localAnalyticsFallback;

  // ─── LOGIN PANEL ──────────────────────────────────────────

  if (!isAuthenticated) {
    return (
      <main className="w-full min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="w-full max-w-sm p-8 rounded-xl glass-card relative overflow-hidden flex flex-col gap-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-secondary"></div>
          
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-accent/8 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <KeyRound size={20} />
            </div>
            <h1 className="text-xl font-bold font-mono text-white tracking-wider uppercase">HQ Administrator</h1>
            <p className="text-[10px] text-muted font-mono mt-1 uppercase tracking-widest">// SECURE ENTRY ROUTINE</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-muted uppercase tracking-wider">Ident / Username</label>
              <input
                type="text"
                required
                className="bg-white/3 border border-white/8 rounded px-3 py-2 text-xs text-white placeholder-muted/30 focus:outline-none focus:border-accent"
                placeholder="admin"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-mono text-muted uppercase tracking-wider">Passphrase / Password</label>
              <input
                type="password"
                required
                className="bg-white/3 border border-white/8 rounded px-3 py-2 text-xs text-white placeholder-muted/30 focus:outline-none focus:border-accent"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-1.5 bg-red-500/10 border border-red-500/20 p-2.5 rounded text-red-500 text-[10px]">
                <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded bg-accent hover:opacity-85 text-bg font-bold font-mono text-xs uppercase tracking-wider transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loginLoading ? <RefreshCw size={12} className="animate-spin" /> : 'Decrypt & Enter'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ─── DASHBOARD CONSOLE ────────────────────────────────────

  return (
    <main className="w-full min-h-screen bg-bg p-6 md:p-12 flex flex-col gap-8 select-text">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white uppercase tracking-wider">Operations Dashboard</h1>
          <div className="text-[10px] text-accent font-mono tracking-widest uppercase mt-0.5">// Welcome back, System Admin</div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => clearCacheMutation.mutate()}
            disabled={clearCacheMutation.isPending}
            className="border border-accent/30 text-accent hover:bg-accent hover:text-bg px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            style={{ borderColor: accentColor + '40', color: accentColor }}
          >
            <RefreshCw size={12} className={clearCacheMutation.isPending ? 'animate-spin' : ''} />
            Flush System Cache
          </button>

          <button
            onClick={logout}
            className="border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </div>

      {/* Analytics KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Page Hits', val: activeMetrics.totalVisits, desc: 'Visitor clicks' },
          { label: 'Unique Visitors', val: activeMetrics.uniqueVisitors, desc: 'Distinct session keys' },
          { label: 'Resume Downloads', val: activeMetrics.resumeDownloads, desc: 'PDF CV transfers' },
          { label: 'Featured System Views', val: activeMetrics.projectViews, desc: 'Project showcase hits' }
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded bg-white/2 border border-white/5 flex flex-col gap-1 hover:border-accent/30 transition-colors">
            <span className="text-[9px] font-mono text-muted uppercase tracking-wider">{kpi.label}</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{kpi.val}</div>
            <span className="text-[8px] font-mono text-secondary uppercase tracking-widest mt-0.5">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Metrics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Device Breakdown */}
        <div className="p-6 rounded-xl border border-white/5 bg-white/2 flex flex-col gap-4">
          <h3 className="text-xs font-bold font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 size={14} />
            Traffic Distribution (By Device)
          </h3>
          <div className="h-64 font-mono text-[10px] relative flex items-center justify-center border border-white/5 rounded-lg bg-[#07070B]">
            {activeMetrics.deviceBreakdown && activeMetrics.deviceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeMetrics.deviceBreakdown}>
                  <XAxis dataKey="device" stroke="#94A3B8" fontSize={9} />
                  <YAxis stroke="#94A3B8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#0A0A16', borderColor: 'rgba(0, 245, 255, 0.15)', fontSize: '10px' }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-muted/40 uppercase tracking-widest text-[9px] font-mono">// No device telemetry registered</span>
            )}
          </div>
        </div>

        {/* Page Views metrics */}
        <div className="p-6 rounded-xl border border-white/5 bg-white/2 flex flex-col gap-4">
          <h3 className="text-xs font-bold font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 size={14} />
            Page Views Allocation
          </h3>
          <div className="h-64 font-mono text-[10px] relative flex items-center justify-center border border-white/5 rounded-lg bg-[#07070B]">
            {activeMetrics.pageViews && activeMetrics.pageViews.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeMetrics.pageViews}>
                  <XAxis dataKey="page" stroke="#94A3B8" fontSize={9} />
                  <YAxis stroke="#94A3B8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#0A0A16', borderColor: `${accentColor}26`, fontSize: '10px' }} />
                  <Bar dataKey="views" fill={accentColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-muted/40 uppercase tracking-widest text-[9px] font-mono">// No resource hits mapped</span>
            )}
          </div>
        </div>

      </div>

      {/* Inbox Contact Messages */}
      <div className="p-6 rounded-xl border border-white/5 bg-white/2 flex flex-col gap-4">
        <h3 className="text-xs font-bold font-mono text-accent uppercase tracking-wider flex items-center gap-1.5">
          <Mail size={14} />
          Inbound Contacts Inbox ({messages.length} total)
        </h3>

        {messagesLoading ? (
          <div className="text-center font-mono text-xs text-muted py-8">Loading communications logs...</div>
        ) : messages.length === 0 ? (
          <div className="text-center font-mono text-xs text-muted py-8 bg-[#07070B] border border-white/5 rounded">
            No secure messages currently in inbox logs.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg: any) => (
              <div 
                key={msg.id}
                className={`p-4 rounded border flex flex-col md:flex-row items-start justify-between gap-4 transition-colors ${
                  msg.isRead 
                    ? 'border-white/5 bg-[#07070B] opacity-75' 
                    : 'border-accent/20 bg-accent/2'
                }`}
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-xs font-mono">{msg.name}</span>
                    <span className="text-[10px] text-muted font-mono">&lt;{msg.email}&gt;</span>
                    {msg.subject && (
                      <span className="text-[10px] bg-secondary/15 border border-secondary/20 text-secondary px-2 py-0.5 rounded font-mono">
                        {msg.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-xs font-light leading-relaxed">{msg.message}</p>
                  <div className="text-[8px] text-muted/50 font-mono mt-1">Transmitted: {new Date(msg.createdAt).toLocaleString()}</div>
                </div>

                {!msg.isRead && (
                  <button
                    onClick={() => handleToggleRead(msg.id)}
                    className="border border-highlight/30 text-highlight hover:bg-highlight hover:text-bg px-3 py-1 rounded font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
