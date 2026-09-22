import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';

import { Cover } from '@/components/cover';
import { colors, fontSize, spacing } from '@/constants/theme';
import type { Release } from '@/types';

export const GRID_COLUMNS = 3;
export const GRID_GAP = spacing.sm;
export const GRID_PADDING = spacing.lg;

// Ancho de cada celda para que entren 3 columnas exactas con padding y gap.
export function useGridItemSize() {
  const { width } = useWindowDimensions();
  return (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
}

export function GridCover({ release, size }: { release: Release; size: number }) {
  return (
    <Pressable
      style={{ width: size }}
      onPress={() => router.push({ pathname: '/release/[id]', params: { id: release.id } })}>
      <Cover release={release} size={size} />
      <Text style={styles.title} numberOfLines={1}>
        {release.title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {release.artist}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  artist: {
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
