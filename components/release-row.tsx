import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cover } from '@/components/cover';
import { colors, fontSize, spacing } from '@/constants/theme';
import type { Release } from '@/types';

export function ReleaseRow({ release }: { release: Release }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/release/[id]', params: { id: release.id } })}>
      <Cover release={release} size={56} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {release.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {release.artist}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {release.year} · {release.country} · {release.label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  artist: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  meta: {
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
