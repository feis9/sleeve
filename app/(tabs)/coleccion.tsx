import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/chip';
import {
  GRID_COLUMNS,
  GRID_GAP,
  GRID_PADDING,
  GridCover,
  useGridItemSize,
} from '@/components/grid-cover';
import { PrimaryButton } from '@/components/primary-button';
import { fontSize, spacing, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';
import { useCollection } from '@/context/collection';
import { getRelease } from '@/data/mock';
import type { Release } from '@/types';

export default function ColeccionScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { ids } = useCollection();
  const itemSize = useGridItemSize();
  const [genero, setGenero] = useState('Todos');

  const discos = ids.map((id) => getRelease(id)).filter((r): r is Release => r !== undefined);
  const generos = ['Todos', ...new Set(discos.map((d) => d.genre))];
  const visibles = genero === 'Todos' ? discos : discos.filter((d) => d.genre === genero);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi colección</Text>
        <Text style={styles.count}>
          {discos.length} {discos.length === 1 ? 'disco' : 'discos'}
        </Text>
      </View>

      {discos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chips}>
          {generos.map((g) => (
            <Chip key={g} label={g} active={genero === g} onPress={() => setGenero(g)} />
          ))}
        </ScrollView>
      )}

      <FlatList
        data={visibles}
        keyExtractor={(r) => r.id}
        numColumns={GRID_COLUMNS}
        columnWrapperStyle={{ gap: GRID_GAP }}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <GridCover release={item} size={itemSize} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="albums-outline" size={56} color={colors.muted} />
            <Text style={styles.emptyText}>Tu colección está vacía. Escaneá tu primer disco.</Text>
            <PrimaryButton
              label="Escanear"
              icon="barcode-outline"
              onPress={() => router.push('/escanear')}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: '800',
    },
    count: {
      color: colors.muted,
      fontSize: fontSize.sm,
    },
    chipsScroll: {
      flexGrow: 0,
    },
    chips: {
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    grid: {
      padding: GRID_PADDING,
      paddingTop: spacing.sm,
      gap: spacing.lg,
    },
    empty: {
      alignItems: 'center',
      gap: spacing.lg,
      marginTop: spacing.xxl,
    },
    emptyText: {
      color: colors.muted,
      fontSize: fontSize.base,
      textAlign: 'center',
    },
  });
