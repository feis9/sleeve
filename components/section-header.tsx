import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontSize, spacing, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
    },
    action: {
      color: colors.primary,
      fontSize: fontSize.sm,
      fontWeight: '600',
    },
  });