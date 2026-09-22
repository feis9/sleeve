import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Chip } from '@/components/chip';
import { GRID_COLUMNS, GRID_GAP, GRID_PADDING, GridCover, useGridItemSize } from '@/components/grid-cover';
import { ReviewCard } from '@/components/review-card';
import { Stat } from '@/components/stat';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useCollection, useRanking } from '@/context/collection';
import { getRelease, getUser, ME_ID, reviewsBy } from '@/data/mock';
import type { Release } from '@/types';

type Tab = 'coleccion' | 'resenas';

// Se usa en la tab Perfil (tu perfil) y en usuario/[id] (perfil público).
export function ProfileView({ userId }: { userId: string }) {
  const { ids } = useCollection();
  const ranking = useRanking();
  const itemSize = useGridItemSize();
  const [tab, setTab] = useState<Tab>('coleccion');

  const user = getUser(userId);
  if (!user) {
    return <Text style={styles.empty}>No encontramos este usuario.</Text>;
  }

  const isMe = userId === ME_ID;
  const collection = (isMe ? ids : user.collection)
    .map((id) => getRelease(id))
    .filter((r): r is Release => r !== undefined);
  const userReviews = reviewsBy(userId);
  const position = ranking.findIndex((r) => r.user.id === userId) + 1;

  const header = (
    <View style={styles.header}>
      <Avatar user={user} size={88} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      <View style={styles.stats}>
        <Stat value={collection.length} label="Discos" />
        <Stat value={userReviews.length} label="Reseñas" />
        <Stat value={`#${position}`} label="Ranking" />
      </View>

      <View style={styles.tabs}>
        <Chip label="Colección" active={tab === 'coleccion'} onPress={() => setTab('coleccion')} />
        <Chip label="Reseñas" active={tab === 'resenas'} onPress={() => setTab('resenas')} />
      </View>
    </View>
  );

  if (tab === 'coleccion') {
    return (
      <FlatList
        key="coleccion"
        data={collection}
        keyExtractor={(r) => r.id}
        numColumns={GRID_COLUMNS}
        ListHeaderComponent={header}
        columnWrapperStyle={{ gap: GRID_GAP }}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <GridCover release={item} size={itemSize} />}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no hay discos.</Text>}
      />
    );
  }

  return (
    <FlatList
      key="resenas"
      data={userReviews}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={header}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <ReviewCard review={item} showRelease />}
      ListEmptyComponent={<Text style={styles.empty}>Todavía no hay reseñas.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: GRID_PADDING,
    gap: spacing.lg,
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
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
