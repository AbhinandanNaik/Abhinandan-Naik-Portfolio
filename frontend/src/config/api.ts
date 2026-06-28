/**
 * Centralized API Base URL configuration for the portfolio.
 * 
 * NEXT_PUBLIC_API_URL is evaluated at build-time. If undefined, we dynamically
 * fall back to matching hostname configurations at client runtime.
 */
const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Local dev fallback
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    // Production deployments (defaults to serving on relative proxy endpoint)
    return '/api';
  }
  return 'http://localhost:8080/api';
};

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || getApiBase();
