import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { LoginScreen } from '@/components/login-screen';
import { AuthProvider, useAuth } from '@/context/auth';
import { CollectionProvider } from '@/context/collection';
import { ReviewsProvider } from '@/context/reviews';
import { AppSettingsProvider, useAppSettings } from '@/context/settings';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <CollectionProvider>
          <ReviewsProvider>
            <ThemedStack />
          </ReviewsProvider>
        </CollectionProvider>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

function ThemedStack() {
  const { colors, colorMode, isHydrated } = useAppSettings();
  const { user, isHydrated: authHydrated } = useAuth();

  // El tema de React Navigation (fondos de pantalla, headers, tab bar) sale de la misma paleta.
  const navigationTheme = useMemo(() => {
    const base = colorMode === 'DARK' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.bg,
        card: colors.bg,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
      },
    };
  }, [colorMode, colors]);

  // Hasta leer las preferencias y la sesión guardadas no dibujamos nada: evita parpadeos.
  if (!isHydrated || !authHydrated) return null;

  // Sin sesión se muestra el login; con sesión, la app. Al cerrar sesión se vuelve acá solo.
  if (!user) {
    return (
      <>
        <LoginScreen />
        <StatusBar style={colorMode === 'DARK' ? 'light' : 'dark'} />
      </>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="escanear" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="release/[id]" options={{ title: '' }} />
        <Stack.Screen name="usuario/[id]" options={{ title: '' }} />
        <Stack.Screen name="ajustes" options={{ title: 'Ajustes' }} />
      </Stack>
      <StatusBar style={colorMode === 'DARK' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
