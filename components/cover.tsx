import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, radius } from '@/constants/theme';
import type { Release } from '@/types';

type Props = {
  release: Release;
  size?: number;
  showTitle?: boolean;
};

// Tapa placeholder: color del disco + un vinilo dibujado. Después se reemplaza por la imagen de Discogs.
export function Cover({ release, size, showTitle = false }: Props) {
  const dimensions: ViewStyle = size ? { width: size, height: size } : { width: '100%', aspectRatio: 1 };

  return (
    <View style={[styles.cover, dimensions, { backgroundColor: release.coverColor }]}>
      <View style={styles.disc}>
        <View style={styles.label} />
      </View>
      {showTitle && (
        <Text style={styles.title} numberOfLines={2}>
          {release.title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {
    width: '62%',
    aspectRatio: 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    width: '34%',
    aspectRatio: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    opacity: 0.85,
  },
  title: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});