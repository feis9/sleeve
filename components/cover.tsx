import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { radius, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';
import type { Release } from '@/types';

type Props = {
  release: Release;
  size?: number;
  showTitle?: boolean;
};

// Tapa original de Discogs. Si el disco no tiene imagen o no carga (por ejemplo, sin internet),
// se dibuja el placeholder: un vinilo sobre fondo neutro, con el título si se pidió.
export function Cover({ release, size, showTitle = false }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Guardamos qué URL falló y no un booleano: si el mismo componente pasa a mostrar otro disco, se vuelve a intentar.
  const [urlFallida, setUrlFallida] = useState<string | null>(null);

  // Sin tipo explícito: sirve tanto para el View del placeholder como para el Image.
  const dimensions = size ? { width: size, height: size } : { width: '100%' as const, aspectRatio: 1 };
  const url = release.coverUrl;

  if (url && url !== urlFallida) {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.cover, dimensions]}
        resizeMode="cover"
        onError={() => setUrlFallida(url)}
        accessibilityLabel={`${release.title} · ${release.artist}`}
      />
    );
  }

  return (
    <View style={[styles.cover, styles.placeholder, dimensions]}>
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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    cover: {
      borderRadius: radius.sm,
      overflow: 'hidden',
      backgroundColor: colors.surfaceAlt,
    },
    placeholder: {
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
      backgroundColor: colors.primary,
      opacity: 0.85,
    },
    title: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
  });
