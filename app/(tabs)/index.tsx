import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { GridCover } from '@/components/grid-cover';
import { RankingRow } from '@/components/ranking-row';
import { SectionHeader } from '@/components/section-header';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useRanking } from '@/context/collection';
import { getUser, ME_ID, releases } from '@/data/mock';

export default function InicioScreen() {
  const ranking = useRanking();
  const me = getUser(ME_ID)!;
  const recientes = releases.slice(0, 6);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Sleeve</Text>
          <Pressable onPress={() => router.navigate('/perfil')}>
            <Avatar user={me} size={36} />
          </Pressable>
        </View>

        <Pressable style={styles.scanCard} onPress={() => router.push('/escanear')}>
          <Ionicons name="barcode-outline" size={36} color={colors.onAccent} />
          <View style={styles.scanText}>
            <Text style={styles.scanTitle}>Escaneá un disco</Text>
            <Text style={styles.scanSubtitle}>Identificá el prensado exacto con el código de barras</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.onAccent} />
        </Pressable>

        <SectionHeader title="Agregados recientemente" />
        <FlatList
          horizontal
          data={recientes}
          keyExtractor={(r) => r.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          renderItem={({ item }) => <GridCover release={item} size={130} />}
        />

        <SectionHeader
          title="Top coleccionistas"
          actionLabel="Ver mi perfil"
          onAction={() => router.navigate('/perfil')}
        />
        <View style={styles.ranking}>
          {ranking.map((entry, index) => (
            <RankingRow
              key={entry.user.id}
              position={index + 1}
              user={entry.user}
              count={entry.count}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  scanText: {
    flex: 1,
  },
  scanTitle: {
    color: colors.onAccent,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
  scanSubtitle: {
    color: colors.onAccent,
    fontSize: fontSize.sm,
    opacity: 0.8,
  },
  carousel: {
    gap: spacing.md,
  },
  ranking: {
    gap: spacing.xs,
  },
});
