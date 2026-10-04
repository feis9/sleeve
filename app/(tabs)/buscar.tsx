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
import { releases, releasesByBarcode } from '@/data/mock';
import type { Release } from '@/types';
import { barcodeDigits, validateBarcode } from '@/utils/validation';

type Filtro = 'todo' | 'artista' | 'album' | 'sello' | 'codigo';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'artista', label: 'Artista' },
  { key: 'album', label: 'Álbum' },
  { key: 'sello', label: 'Sello' },
  { key: 'codigo', label: 'Código' },
];

function coincide(release: Release, query: string, filtro: Exclude<Filtro, 'codigo'>) {
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
  // En modo código el error se muestra al enviar o cuando ya se tipearon 12 dígitos, no mientras se escribe.
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  const modoCodigo = filtro === 'codigo';
  const q = query.trim().toLowerCase();
  const errorCodigo = modoCodigo && q ? validateBarcode(query) : null;
  const mostrarErrorCodigo = errorCodigo !== null && (codigoEnviado || barcodeDigits(query).length >= 12);

  let resultados: Release[] = [];
  if (modoCodigo) resultados = q && !errorCodigo ? releasesByBarcode(barcodeDigits(query)) : [];
  else if (q) resultados = releases.filter((r) => coincide(r, q, filtro));

  function cambiarFiltro(f: Filtro) {
    // Al entrar o salir del modo código el texto anterior ya no sirve.
    if ((f === 'codigo') !== modoCodigo) setQuery('');
    setCodigoEnviado(false);
    setFiltro(f);
  }

  function cambiarQuery(texto: string) {
    setQuery(texto);
    setCodigoEnviado(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Text style={styles.title}>Buscar</Text>

        <View style={[styles.searchBar, mostrarErrorCodigo && styles.searchBarError]}>
          <Ionicons name={modoCodigo ? 'barcode-outline' : 'search'} size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={cambiarQuery}
            placeholder={modoCodigo ? 'Código de barras (12 o 13 dígitos)' : 'Artista, álbum o sello'}
            placeholderTextColor={colors.muted}
            autoCorrect={false}
            keyboardType={modoCodigo ? 'number-pad' : 'default'}
            returnKeyType="search"
            onSubmitEditing={() => setCodigoEnviado(true)}
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
              onPress={() => cambiarFiltro(f.key)}
            />
          ))}
        </View>

        {mostrarErrorCodigo && <Text style={styles.error}>{errorCodigo}</Text>}
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReleaseRow release={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          q ? (
            mostrarErrorCodigo || (modoCodigo && errorCodigo) ? null : (
              <Text style={styles.emptyText}>
                {modoCodigo ? 'No encontramos ediciones con ese código.' : `Sin resultados para “${query}”.`}
              </Text>
            )
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
    searchBarError: {
      borderColor: colors.primary,
    },
    error: {
      color: colors.primary,
      fontSize: fontSize.sm,
    },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      color: colors.text,
      fontSize: fontSize.base,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
