import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Chip({ label, active = false, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
    },
    active: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.text,
      fontSize: fontSize.sm,
    },
    activeText: {
      color: colors.onPrimary,
      fontWeight: '600',
    },
  });