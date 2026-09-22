import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
};

export function PrimaryButton({ label, onPress, variant = 'solid', icon }: Props) {
  const solid = variant === 'solid';
  const textColor = solid ? colors.onAccent : colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        solid ? styles.solid : styles.outline,
        pressed && styles.pressed,
      ]}>
      {icon && <Ionicons name={icon} size={20} color={textColor} />}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  solid: {
    backgroundColor: colors.accent,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '700',
  },
});
