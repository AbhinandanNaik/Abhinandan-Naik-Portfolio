import { create } from 'zustand';

interface TelemetryState {
  sessionId: string | null;
  initialize: () => void;
  trackPageVisit: (page: string) => Promise<void>;
  trackAction: (action: string, metadata?: string) => Promise<void>;
}

import { API_BASE } from '@/config/api';

export const useTelemetryStore = create<TelemetryState>((set, get) => {
  const getBrowserName = () => {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'Desktop';
    const width = window.innerWidth;
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
  };

  return {
    sessionId: null,
    initialize: () => {
      if (typeof window === 'undefined' || get().sessionId) return;
      let session = sessionStorage.getItem('session_id');
      if (!session) {
        session = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        sessionStorage.setItem('session_id', session);
      }
      set({ sessionId: session });
    },
    trackPageVisit: async (page) => {
      const { sessionId, initialize } = get();
      if (!sessionId) {
        initialize();
      }
      const activeSession = get().sessionId;
      try {
        await fetch(`${API_BASE}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: activeSession,
            pageVisited: page,
            deviceType: getDeviceType(),
            browser: getBrowserName(),
            duration: 0,
          }),
        });
      } catch (e) {
        console.warn('Telemetry check-in failed', e);
      }
    },
    trackAction: async (action, metadata) => {
      const { sessionId, initialize } = get();
      if (!sessionId) {
        initialize();
      }
      const activeSession = get().sessionId;
      try {
        await fetch(`${API_BASE}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: activeSession,
            pageVisited: typeof window !== 'undefined' ? window.location.pathname : '/',
            deviceType: getDeviceType(),
            browser: getBrowserName(),
            actionPerformed: action,
            duration: 0,
          }),
        });
      } catch (e) {
        console.warn('Telemetry action tracker failed', e);
      }
    },
  };
});
