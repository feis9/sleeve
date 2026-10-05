import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/chip';
import { PrimaryButton } from '@/components/primary-button';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useAppSettings, type Language, type ThemePreference } from '@/context/settings';

const TEMAS: ThemePreference[] = ['LIGHT', 'DARK', 'SYSTEM'];
// Cada idioma se muestra en su propio idioma, así se reconoce aunque la app esté en el otro.
const IDIOMAS: { key: Language; label: string }[] = [
  { key: 'ES', label: 'Español' },
  { key: 'EN', label: 'English' },
];

export default function AjustesScreen() {
  const { colors, texts, language, setLanguage, themePreference, setThemePreference } = useAppSettings();
  const temaLabel: Record<ThemePreference, string> = {
    LIGHT: texts.settings.light,
    DARK: texts.settings.dark,
    SYSTEM: texts.settings.system,
  };
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Solo cerramos la sesión: el layout raíz desmonta el Stack y muestra el login. No navegamos antes
  // (router.dismissAll encola la acción y, cuando se procesa, el Stack ya no existe: POP_TO_TOP sin navegador).
  const { user, logout } = useAuth();


  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>{texts.settings.language}</Text>
        <Text style={styles.help}>{texts.settings.languageHelp}</Text>
        <View style={styles.chips}>
          {IDIOMAS.map((i) => (
            <Chip key={i.key} label={i.label} active={language === i.key} onPress={() => setLanguage(i.key)} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{texts.settings.theme}</Text>
        <Text style={styles.help}>{texts.settings.themeHelp}</Text>
        <View style={styles.chips}>
          {TEMAS.map((t) => (
            <Chip
              key={t}
              label={temaLabel[t]}
              active={themePreference === t}
              onPress={() => setThemePreference(t)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{texts.settings.account}</Text>
        <Text style={styles.help}>{texts.settings.loggedInAs(user?.username ?? '')}</Text>
        <PrimaryButton label={texts.settings.logout} icon="log-out-outline" variant="outline" onPress={logout} />
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
