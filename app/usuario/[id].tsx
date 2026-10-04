import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ProfileView } from '@/components/profile-view';
import { type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';

export default function UsuarioScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.screen}>
      <ProfileView userId={id} />
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
  });
