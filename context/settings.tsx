import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getColors, type ColorMode, type Palette } from '@/constants/theme';

export type Language = 'ES' | 'EN';
// 'SYSTEM' sigue el tema del teléfono (useColorScheme); 'LIGHT' y 'DARK' lo fijan.
export type ThemePreference = 'SYSTEM' | ColorMode;

type AppSettingsContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  colorMode: ColorMode;
  colors: Palette;
  isHydrated: boolean;
};

const STORAGE_KEY = 'sleeve-app-settings';

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [language, setLanguage] = useState<Language>('ES');
  const [themePreference, setThemePreference] = useState<ThemePreference>('SYSTEM');
  const [isHydrated, setIsHydrated] = useState(false);

  // Al montar, leemos lo último guardado. Si falla, seguimos con los valores por defecto.
  useEffect(() => {
    async function loadPersistedSettings() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<{ language: Language; themePreference: ThemePreference }>;
          if (saved.language) setLanguage(saved.language);
          if (saved.themePreference) setThemePreference(saved.themePreference);
        }
      } catch {
        // Lectura best-effort.
      } finally {
        setIsHydrated(true);
      }
    }
    loadPersistedSettings();
  }, []);

  // Guardamos cada cambio. El guard de isHydrated evita pisar lo guardado con los valores iniciales.
  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ language, themePreference })).catch(() => {
      // Guardado best-effort: si falla, el estado sigue funcionando en memoria.
    });
  }, [language, themePreference, isHydrated]);

  // colorMode y colors no son estado: se derivan de la preferencia y del tema del sistema.
  const colorMode: ColorMode =
    themePreference === 'SYSTEM' ? (systemScheme === 'dark' ? 'DARK' : 'LIGHT') : themePreference;
  const colors = useMemo(() => getColors(colorMode), [colorMode]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({ language, setLanguage, themePreference, setThemePreference, colorMode, colors, isHydrated }),
    [language, themePreference, colorMode, colors, isHydrated],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings(): AppSettingsContextValue {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings debe usarse dentro de <AppSettingsProvider>');
  }
  return context;
}

// Atajo para los componentes que solo necesitan la paleta.
export function useTheme() {
  const { colors, colorMode } = useAppSettings();
  return { colors, colorMode };
}
