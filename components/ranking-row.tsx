import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { ME_ID } from '@/data/mock';
import type { User } from '@/types';

type Props = {
  position: number;
  user: User;
  count: number;
};

export function RankingRow({ position, user, count }: Props) {
  const isMe = user.id === ME_ID;

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
          {isMe ? 'Vos' : user.name}
        </Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      <Text style={styles.count}>{count} discos</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    borderColor: colors.accent,
  },
  position: {
    width: 20,
    color: colors.muted,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  podium: {
    color: colors.accent,
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
