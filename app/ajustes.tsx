import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useAppSettings, type ThemePreference } from '@/context/settings';

const TEMAS: { key: ThemePreference; label: string }[] = [
  { key: 'LIGHT', label: 'Claro' },
  { key: 'DARK', label: 'Oscuro' },
  { key: 'SYSTEM', label: 'Sistema' },
];

export default function AjustesScreen() {
  const { colors, themePreference, setThemePreference } = useAppSettings();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Tema</Text>
        <Text style={styles.help}>“Sistema” sigue el modo claro u oscuro del teléfono.</Text>
        <View style={styles.chips}>
          {TEMAS.map((t) => (
            <Chip
              key={t.key}
              label={t.label}
              active={themePreference === t.key}
              onPress={() => setThemePreference(t.key)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    label: {
      color: colors.text,
      fontSize: fontSize.md,
      fontWeight: '700',
    },
    help: {
      color: colors.muted,
      fontSize: fontSize.sm,
    },
    chips: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
  });
