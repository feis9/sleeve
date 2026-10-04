import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { type Palette } from '@/constants/theme';
import { useTexts, useTheme } from '@/context/settings';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

function ScanTabIcon() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.scanButton}>
      <Ionicons name="barcode-outline" size={26} color={colors.onPrimary} />
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const texts = useTexts();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="index" options={{ title: texts.tabs.home, tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="buscar" options={{ title: texts.tabs.search, tabBarIcon: tabIcon('search') }} />
      <Tabs.Screen
        name="escanear-tab"
        options={{ title: '', tabBarIcon: () => <ScanTabIcon /> }}
        listeners={{
          // No es una pantalla: abre el scanner como modal a pantalla completa.
          tabPress: (e) => {
            e.preventDefault();
            router.push('/escanear');
          },
        }}
      />
      <Tabs.Screen name="coleccion" options={{ title: texts.tabs.collection, tabBarIcon: tabIcon('albums') }} />
      <Tabs.Screen name="perfil" options={{ title: texts.tabs.profile, tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    scanButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
  });
