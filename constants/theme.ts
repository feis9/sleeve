// Paleta "Etiqueta Roja": el papel crema de la funda, el rojo de la etiqueta central
// y el azul de los sellos clásicos. Mismos HEX que el branding y el mockup.
// Contraste verificado (WCAG): text/bg 16.6:1 en claro y 16.4:1 en oscuro;
// muted, primary y onPrimary superan 4.5:1 sobre bg y surface en ambos modos.
export type ColorMode = 'LIGHT' | 'DARK';

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  // El acento (ámbar) va solo como relleno con onAccent encima: como texto sobre bg claro no contrasta.
  accent: string;
  onAccent: string;
};

const light: Palette = {
  bg: '#FAF6EF',
  surface: '#FFFFFF',
  surfaceAlt: '#F1EBE1',
  border: '#DDD3C5',
  text: '#1A1714',
  muted: '#6B6259',
  primary: '#B3261E',
  onPrimary: '#FFFFFF',
  secondary: '#1F2A44',
  accent: '#F2B33D',
  onAccent: '#1A1714',
};

const dark: Palette = {
  bg: '#121010',
  surface: '#1E1A18',
  surfaceAlt: '#2A2421',
  border: '#3A322E',
  text: '#F3EEE6',
  muted: '#A39A92',
  primary: '#E5534B',
  onPrimary: '#121010',
  secondary: '#8FA3C7',
  accent: '#F2B33D',
  onAccent: '#121010',
};

export function getColors(mode: ColorMode): Palette {
  return mode === 'DARK' ? dark : light;
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10, lg: 16, pill: 999 };

export const fontSize = { xs: 11, sm: 13, base: 15, md: 17, lg: 20, xl: 28 };
