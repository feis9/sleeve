import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cover } from '@/components/cover';
import { PrimaryButton } from '@/components/primary-button';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { DEMO_BARCODE, flagFor, releasesByBarcode } from '@/data/mock';
import type { Release } from '@/types';

// Primera entrega: solo UI. La cámara (expo-camera) se conecta en la próxima iteración.
export default function EscanearScreen() {
  const [candidatos, setCandidatos] = useState<Release[] | null>(null);

  function simularEscaneo() {
    setCandidatos(releasesByBarcode(DEMO_BARCODE));
  }

  function elegir(id: string) {
    router.replace({ pathname: '/release/[id]', params: { id } });
  }

  function buscarManualmente() {
    router.back();
    router.navigate('/buscar');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <View style={styles.laser} />
        </View>
        <Text style={styles.hint}>Apuntá al código de barras del disco</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Simular escaneo" icon="scan" onPress={simularEscaneo} />
        <PrimaryButton label="Buscar manualmente" variant="outline" onPress={buscarManualmente} />
      </View>

      {candidatos && (
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              Encontramos {candidatos.length} {candidatos.length === 1 ? 'edición' : 'ediciones'}
            </Text>
            <Text style={styles.sheetSubtitle}>Elegí la que coincide con tu copia</Text>

            {candidatos.map((r) => (
              <Pressable key={r.id} style={styles.candidate} onPress={() => elegir(r.id)}>
                <Cover release={r} size={48} />
                <View style={styles.candidateInfo}>
                  <Text style={styles.candidateTitle} numberOfLines={1}>
                    {flagFor(r.country)} {r.country} · {r.year}
                  </Text>
                  <Text style={styles.candidateMeta} numberOfLines={1}>
                    {r.label} · {r.format}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}

            <PrimaryButton label="Cancelar" variant="outline" onPress={() => setCandidatos(null)} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 170;
const CORNER = 28;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.accent,
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  laser: {
    height: 2,
    marginHorizontal: spacing.md,
    backgroundColor: colors.accent,
    opacity: 0.8,
  },
  hint: {
    color: colors.text,
    fontSize: fontSize.base,
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sheetSubtitle: {
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: -spacing.sm,
  },
  candidate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateTitle: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  candidateMeta: {
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
