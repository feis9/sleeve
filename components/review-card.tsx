import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { getRelease, getUser, ME_ID } from '@/data/mock';
import type { Review } from '@/types';

type Props = {
  review: Review;
  // En el perfil mostramos el disco reseñado; en el detalle, quién la escribió.
  showRelease?: boolean;
};

export function ReviewCard({ review, showRelease = false }: Props) {
  const user = getUser(review.userId);
  const release = getRelease(review.releaseId);
  if (!user || !release) return null;

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  function abrir() {
    if (showRelease) router.push({ pathname: '/release/[id]', params: { id: release!.id } });
    else if (user!.id === ME_ID) router.navigate('/perfil');
    else router.push({ pathname: '/usuario/[id]', params: { id: user!.id } });
  }

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={abrir}>
        {!showRelease && <Avatar user={user} size={28} />}
        <Text style={styles.author} numberOfLines={1}>
          {showRelease ? `${release.title} · ${release.artist}` : user.name}
        </Text>
        <Text style={styles.stars}>{stars}</Text>
      </Pressable>
      <Text style={styles.body}>{review.body}</Text>
      <Text style={styles.date}>{review.createdAt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  stars: {
    color: colors.accent,
    fontSize: fontSize.sm,
  },
  body: {
    color: colors.text,
    fontSize: fontSize.base,
    lineHeight: 21,
  },
  date: {
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
