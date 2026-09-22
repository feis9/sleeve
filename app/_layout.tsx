import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';
import { CollectionProvider } from '@/context/collection';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function RootLayout() {
  return (
    <CollectionProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="escanear"
            options={{ presentation: 'fullScreenModal', headerShown: false }}
          />
          <Stack.Screen name="release/[id]" options={{ title: '' }} />
          <Stack.Screen name="usuario/[id]" options={{ title: '' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </CollectionProvider>
  );
}
