import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { User } from '@/types';

export function Avatar({ user, size = 40 }: { user: User; size?: number }) {
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

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.onAccent,
    fontWeight: '700',
  },
});