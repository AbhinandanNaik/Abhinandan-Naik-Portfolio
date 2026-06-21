import { create } from 'zustand';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (data: { accessToken: string; refreshToken: string; username: string; role: string }) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Access localStorage safely in Next.js SSR
  const getInitialState = () => {
    if (typeof window === 'undefined') {
      return { token: null, refreshToken: null, username: null, role: null, isAuthenticated: false };
    }
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('auth_refresh_token');
    const username = localStorage.getItem('auth_username');
    const role = localStorage.getItem('auth_role');
    return {
      token,
      refreshToken,
      username,
      role,
      isAuthenticated: !!token,
    };
  };

  return {
    ...getInitialState(),
    login: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.accessToken);
        localStorage.setItem('auth_refresh_token', data.refreshToken);
        localStorage.setItem('auth_username', data.username);
        localStorage.setItem('auth_role', data.role);
      }
      set({
        token: data.accessToken,
        refreshToken: data.refreshToken,
        username: data.username,
        role: data.role,
        isAuthenticated: true,
      });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_username');
        localStorage.removeItem('auth_role');
      }
      set({
        token: null,
        refreshToken: null,
        username: null,
        role: null,
        isAuthenticated: false,
      });
    },
    setToken: (token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      set({ token });
    },
  };
});
