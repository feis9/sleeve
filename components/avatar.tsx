import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';
import type { User } from '@/types';

export function Avatar({ user, size = 40 }: { user: User; size?: number }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: user.avatarColor },
      ]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    avatar: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: colors.onAccent,
      fontWeight: '700',
    },
  });