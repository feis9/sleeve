import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { colors } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IconName) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

function ScanTabIcon() {
  return (
    <View style={styles.scanButton}>
      <Ionicons name="barcode-outline" size={26} color={colors.onAccent} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar', tabBarIcon: tabIcon('search') }} />
      <Tabs.Screen
        name="escanear-tab"
        options={{ title: '', tabBarIcon: ScanTabIcon }}
        listeners={{
          // No es una pantalla: abre el scanner como modal a pantalla completa.
          tabPress: (e) => {
            e.preventDefault();
            router.push('/escanear');
          },
        }}
      />
      <Tabs.Screen name="coleccion" options={{ title: 'Colección', tabBarIcon: tabIcon('albums') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
