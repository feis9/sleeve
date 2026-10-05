import { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTexts, useTheme } from '@/context/settings';
import { useCurrentUser } from '@/context/auth';
import type { User } from '@/types';

type Props = {
  position: number;
  user: User;
  count: number;
};

export function RankingRow({ position, user, count }: Props) {
  const { colors } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const me = useCurrentUser();
  const isMe = user.id === me.id;

  function abrirPerfil() {
    if (isMe) router.navigate('/perfil');
    else router.push({ pathname: '/usuario/[id]', params: { id: user.id } });
  }

  return (
    <Pressable style={[styles.row, isMe && styles.me]} onPress={abrirPerfil}>
      <Text style={[styles.position, position <= 3 && styles.podium]}>{position}</Text>
      <Avatar user={user} size={36} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {isMe ? texts.profile.you : user.name}
        </Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      <Text style={styles.count}>{texts.profile.recordsCount(count)}</Text>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
    },
    me: {
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    position: {
      width: 20,
      color: colors.muted,
      fontSize: fontSize.md,
      fontWeight: '700',
      textAlign: 'center',
    },
    podium: {
      color: colors.primary,
    },
    info: {
      flex: 1,
    },
    name: {
      color: colors.text,
      fontSize: fontSize.base,
      fontWeight: '600',
    },
    username: {
      color: colors.muted,
      fontSize: fontSize.xs,
    },
    count: {
      color: colors.text,
      fontSize: fontSize.sm,
      fontWeight: '600',
    },
  });
