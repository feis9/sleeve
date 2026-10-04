import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontSize, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';

export function Stat({ value, label }: { value: string | number; label: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    stat: {
      flex: 1,
      alignItems: 'center',
    },
    value: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
    },
    label: {
      color: colors.muted,
      fontSize: fontSize.xs,
    },
  });
