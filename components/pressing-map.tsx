import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CountryMap } from '@/components/country-map';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useAppSettings } from '@/context/settings';
import { getCountry } from '@/data/countries';
import type { Release } from '@/types';

// Mapa con el país de UNA edición. Se usa en el detalle, sin importar desde dónde se llegó
// (escaneo, colección, colección ajena o búsqueda). En la versión final el país sale de la Discogs API.
export function PressingMap({ release }: { release: Release }) {
  const { colors, language, texts } = useAppSettings();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const country = getCountry(release.country);

  if (!country) {
    return (
      <View style={[styles.card, styles.unknown]}>
        <Ionicons name="earth-outline" size={28} color={colors.muted} />
        <View style={styles.unknownText}>
          <Text style={styles.name}>{texts.map.unknownTitle}</Text>
          <Text style={styles.muted}>{texts.map.unknownText}</Text>
        </View>
      </View>
    );
  }

  const name = language === 'EN' ? country.nameEn : country.nameEs;
  // Al tocar el marcador: "🇫🇷 Francia" / "Rolling Stones Records · 2020 · LP, Album…"
  const description = `${release.label} · ${release.year} · ${release.format}`;

  return (
    <View style={styles.card}>
      <CountryMap country={country} title={`${country.flag} ${name}`} description={description} />

      <View style={styles.caption}>
        <Text style={styles.flag}>{country.flag}</Text>
        <View style={styles.captionText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.muted}>
            {release.label} · {release.year}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      overflow: 'hidden',
    },
    caption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    captionText: {
      flex: 1,
    },
    flag: {
      fontSize: 32,
    },
    name: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '600',
    },
    muted: {
      color: colors.muted,
      fontSize: fontSize.sm,
    },
    unknown: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
    },
    unknownText: {
      flex: 1,
    },
  });
