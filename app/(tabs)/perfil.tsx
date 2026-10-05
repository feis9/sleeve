import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileView } from '@/components/profile-view';
import { spacing, type Palette } from '@/constants/theme';
import { useTexts, useTheme } from '@/context/settings';
import { useCurrentUser } from '@/context/auth';

export default function PerfilScreen() {
  const { colors } = useTheme();
  const texts = useTexts();
  const me = useCurrentUser();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push('/ajustes')} hitSlop={12} accessibilityLabel={texts.settingsTitle}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </Pressable>
      </View>
      <ProfileView userId={me.id} />
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
  });
