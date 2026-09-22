import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize } from '@/constants/theme';

export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
