import { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useUserById } from '@/context/collection';
import { useTheme } from '@/context/settings';
import { useCurrentUser } from '@/context/auth';
import type { Review } from '@/types';

// Reseña en el detalle de un disco: quién la escribió, las estrellas y el texto. En el perfil, las
// reseñas se muestran al lado de cada disco (components/profile-view.tsx).
export function ReviewCard({ review }: { review: Review }) {
  const { colors } = useTheme();
  const me = useCurrentUser();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const user = useUserById(review.userId) ?? review.author;
  if (!user) return null;

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  function abrir() {
    if (user!.id === me.id) router.navigate('/perfil');
    else router.push({ pathname: '/usuario/[id]', params: { id: user!.id } });
  }

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={abrir}>
        <Avatar user={user} size={28} />
        <Text style={styles.author} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.stars}>{stars}</Text>
      </Pressable>
      <Text style={styles.body}>{review.body}</Text>
      <Text style={styles.date}>{review.createdAt}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
      color: colors.primary,
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
