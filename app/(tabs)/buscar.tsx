import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/chip';
import { PrimaryButton } from '@/components/primary-button';
import { ReleaseRow } from '@/components/release-row';
import { fontSize, radius, spacing, type Palette } from '@/constants/theme';
import { useTheme } from '@/context/settings';
import { releases } from '@/data/mock';
import type { Release } from '@/types';

type Filtro = 'todo' | 'artista' | 'album' | 'sello';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'artista', label: 'Artista' },
  { key: 'album', label: 'Álbum' },
  { key: 'sello', label: 'Sello' },
];

function coincide(release: Release, query: string, filtro: Filtro) {
  const campos = {
    todo: [release.artist, release.title, release.label],
    artista: [release.artist],
    album: [release.title],
    sello: [release.label],
  }[filtro];
  return campos.some((campo) => campo.toLowerCase().includes(query));
}

export default function BuscarScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todo');

  const q = query.trim().toLowerCase();
  const resultados = q ? releases.filter((r) => coincide(r, q, filtro)) : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Text style={styles.title}>Buscar</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Artista, álbum o sello"
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        <View style={styles.chips}>
          {FILTROS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              active={filtro === f.key}
              onPress={() => setFiltro(f.key)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReleaseRow release={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          q ? (
            <Text style={styles.emptyText}>Sin resultados para “{query}”.</Text>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="disc-outline" size={56} color={colors.muted} />
              <Text style={styles.emptyText}>
                Buscá por artista, álbum o sello. Si tenés el disco en la mano, escanealo.
              </Text>
              <PrimaryButton
                label="Escanear código"
                icon="barcode-outline"
                onPress={() => router.push('/escanear')}
              />
            </View>
          )
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
    top: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    title: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: '800',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      color: colors.text,
      fontSize: fontSize.base,
    },
    chips: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    list: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxl,
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
      marginTop: spacing.lg,
    },
  });
