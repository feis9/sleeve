import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Cover } from '@/components/cover';
import { Stat } from '@/components/stat';
import { fontSize, spacing, type Palette } from '@/constants/theme';
import { useReleases } from '@/context/releases';
import { useTexts, useTheme } from '@/context/settings';
import { useRanking, useUserById, useUserCollection } from '@/context/collection';
import { useReviews } from '@/context/reviews';
import type { Release, Review, User } from '@/types';
import { apiGet } from '@/utils/api';

// Un disco del perfil con la reseña de esa persona, si la escribió.
type Fila = { release: Release; review: Review | undefined; enColeccion: boolean };

// Se usa en la tab Perfil (tu perfil) y en usuario/[id] (perfil público).
// Una sola lista: cada disco de la colección con su reseña al lado, y después los discos que reseñó
// sin tenerlos en la colección.
export function ProfileView({ userId }: { userId: string }) {
  const { colors } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { reviewsBy } = useReviews();
  const { getRelease, ensureReleases } = useReleases();
  const ranking = useRanking();
  const userIds = useUserCollection(userId);
  const conocido = useUserById(userId);
  const user = usePerfil(userId, conocido);

  const userReviews = reviewsBy(userId);
  // Los discos resenados pueden no estar en este teléfono todavía.
  const resenados = userReviews.map((r) => r.releaseId).join(',');
  useEffect(() => {
    if (resenados) ensureReleases(resenados.split(','));
  }, [resenados, ensureReleases]);

  if (!user) {
    return <Text style={styles.empty}>{user === undefined ? texts.catalog.loading : texts.profile.notFound}</Text>;
  }

  const resenaDe = new Map(userReviews.map((r) => [r.releaseId, r]));
  const coleccion = userIds ?? [];
  const filas: Fila[] = [
    ...coleccion.map((id) => ({ id, enColeccion: true })),
    ...userReviews.filter((r) => !coleccion.includes(r.releaseId)).map((r) => ({ id: r.releaseId, enColeccion: false })),
  ].flatMap(({ id, enColeccion }) => {
    const release = getRelease(id);
    return release ? [{ release, review: resenaDe.get(id), enColeccion }] : [];
  });
  const position = ranking.findIndex((r) => r.user.id === userId) + 1;

  const header = (
    <View style={styles.header}>
      <Avatar user={user} size={88} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      <View style={styles.stats}>
        <Stat value={coleccion.length} label={texts.profile.records} />
        <Stat value={userReviews.length} label={texts.profile.reviews} />
        <Stat value={position > 0 ? `#${position}` : '-'} label={texts.profile.ranking} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={filas}
      keyExtractor={(f) => f.release.id}
      ListHeaderComponent={header}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <FilaDisco fila={item} />}
      ListEmptyComponent={
        <Text style={styles.empty}>{userIds === null ? texts.catalog.loading : texts.profile.noRecords}</Text>
      }
    />
  );
}

// El perfil: el que ya conoce la app (sesión o ranking) o, si no, el del backend.
// undefined mientras carga; null si el backend dice que no existe o no responde.
function usePerfil(userId: string, conocido: User | undefined): User | null | undefined {
  const [pedido, setPedido] = useState<{ userId: string; user: User | null } | null>(null);

  useEffect(() => {
    if (conocido) return;
    let cancelado = false;
    apiGet<User>(`/api/usuarios/${encodeURIComponent(userId)}`)
      .then((u) => !cancelado && setPedido({ userId, user: u }))
      .catch(() => !cancelado && setPedido({ userId, user: null }));
    return () => {
      cancelado = true;
    };
  }, [userId, conocido]);

  if (conocido) return conocido;
  return pedido?.userId === userId ? pedido.user : undefined;
}

function FilaDisco({ fila }: { fila: Fila }) {
  const { colors } = useTheme();
  const texts = useTexts();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { release, review, enColeccion } = fila;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/release/[id]', params: { id: release.id } })}>
      <Cover release={release} size={56} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {release.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {release.artist}
        </Text>
        {review ? (
          <Text style={styles.review} numberOfLines={2}>
            <Text style={styles.stars}>{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</Text> {review.body}
          </Text>
        ) : (
          <Text style={styles.muted}>{texts.profile.noReview}</Text>
        )}
        {!enColeccion && <Text style={styles.muted}>{texts.profile.notInCollection}</Text>}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    list: {
      padding: spacing.lg,
      gap: spacing.sm,
    },
    header: {
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    name: {
      marginTop: spacing.sm,
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
    },
    username: {
      color: colors.muted,
      fontSize: fontSize.sm,
    },
    stats: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      marginVertical: spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    pressed: {
      opacity: 0.7,
    },
    info: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.base,
      fontWeight: '600',
    },
    artist: {
      color: colors.text,
      fontSize: fontSize.sm,
    },
    review: {
      color: colors.text,
      fontSize: fontSize.sm,
      marginTop: 2,
    },
    stars: {
      color: colors.primary,
    },
    muted: {
      color: colors.muted,
      fontSize: fontSize.xs,
      marginTop: 2,
    },
    empty: {
      color: colors.muted,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });
