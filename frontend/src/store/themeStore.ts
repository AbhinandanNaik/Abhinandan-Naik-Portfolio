import { create } from 'zustand';

interface ThemeState {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  return {
    accentColor: '#00F5FF',
    setAccentColor: (color: string) => {
      applyColor(color);
      set({ accentColor: color });
    },
  };
});

function applyColor(color: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme_accent_color', color);
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--border', color);
  
  // Calculate RGB and update `--accent-rgb`
  const rgb = hexToRgb(color);
  document.documentElement.style.setProperty('--accent-rgb', rgb);
}

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 245, 255';
}
