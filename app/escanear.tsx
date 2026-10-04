import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Cover } from '@/components/cover';
import { PrimaryButton } from '@/components/primary-button';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { flagFor, releasesByBarcode } from '@/data/mock';
import type { Release } from '@/types';

// Códigos que traen las fundas: EAN-13 (Europa, Argentina) y UPC-A (EE. UU.), más sus versiones cortas.
const BARCODE_TYPES = ['ean13', 'upc_a', 'ean8', 'upc_e'] as const;

type Lectura = { codigo: string; candidatos: Release[] };

export default function EscanearScreen() {
  // [estado del permiso (null mientras se consulta), función para pedirlo]
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [lectura, setLectura] = useState<Lectura | null>(null);
  // La cámara puede reportar el mismo código varias veces antes de que React actualice el estado.
  // La ref cambia al instante y corta las lecturas repetidas.
  const yaLeyo = useRef(false);

  function alEscanear({ data }: BarcodeScanningResult) {
    if (yaLeyo.current) return;
    yaLeyo.current = true;
    setLectura({ codigo: data, candidatos: releasesByBarcode(data) });
  }

  function escanearOtro() {
    yaLeyo.current = false;
    setLectura(null);
  }

  function elegir(id: string) {
    router.replace({ pathname: '/release/[id]', params: { id } });
  }

  function buscarManualmente() {
    router.back();
    router.navigate('/buscar');
  }

  // Caso 1: todavía no sabemos si hay permiso.
  if (!permiso) {
    return (
      <Contenedor>
        <Text style={styles.hint}>Consultando permiso de la cámara…</Text>
      </Contenedor>
    );
  }

  // Caso 2: sin permiso. Si el sistema puede volver a preguntar, lo pedimos; si no, solo queda Ajustes.
  if (!permiso.granted) {
    return (
      <Contenedor>
        <Ionicons name="camera-outline" size={56} color={colors.muted} />
        <Text style={styles.permisoTitulo}>Necesitamos la cámara</Text>
        <Text style={styles.permisoTexto}>
          Sleeve lee el código de barras de la funda para identificar la edición exacta de tu disco.
        </Text>
        {permiso.canAskAgain ? (
          <PrimaryButton label="Dar permiso" icon="camera" onPress={pedirPermiso} />
        ) : (
          <PrimaryButton label="Abrir ajustes" icon="settings-outline" onPress={() => Linking.openSettings()} />
        )}
        <PrimaryButton label="Buscar manualmente" variant="outline" onPress={buscarManualmente} />
      </Contenedor>
    );
  }

  // Caso 3: hay permiso. La cámara solo existe mientras esta pantalla está montada.
  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
        onBarcodeScanned={lectura ? undefined : alEscanear}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={30} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.center}>
          <Marco />
          <Text style={styles.hint}>Apuntá al código de barras del disco</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Buscar manualmente" variant="outline" onPress={buscarManualmente} />
        </View>
      </SafeAreaView>

      {lectura && (
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            {lectura.candidatos.length > 0 ? (
              <>
                <Text style={styles.sheetTitle}>
                  Encontramos {lectura.candidatos.length}{' '}
                  {lectura.candidatos.length === 1 ? 'edición' : 'ediciones'}
                </Text>
                <Text style={styles.sheetSubtitle}>Elegí la que coincide con tu copia</Text>
                {lectura.candidatos.map((r) => (
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
              </>
            ) : (
              <>
                <Text style={styles.sheetTitle}>No encontramos esta edición</Text>
                <Text style={styles.sheetSubtitle}>Código leído: {lectura.codigo}</Text>
                <PrimaryButton label="Buscar manualmente" icon="search" onPress={buscarManualmente} />
              </>
            )}
            <PrimaryButton label="Escanear otro" variant="outline" onPress={escanearOtro} />
          </View>
        </View>
      )}
    </View>
  );
}

function Contenedor({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={30} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.permiso}>{children}</View>
    </SafeAreaView>
  );
}

// Marco guía con una línea que recorre el código de arriba abajo (Animated.loop).
function Marco() {
  // useState con inicializador: el Animated.Value se crea una sola vez y no se lee una ref durante el render.
  const [avance] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(avance, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(avance, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [avance]);

  const translateY = avance.interpolate({ inputRange: [0, 1], outputRange: [CORNER / 2, FRAME_HEIGHT - CORNER / 2] });

  return (
    <View style={styles.frame}>
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
      <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
    </View>
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
  overlay: {
    flex: 1,
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
    position: 'absolute',
    top: 0,
    left: spacing.md,
    right: spacing.md,
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.8,
  },
  hint: {
    color: colors.text,
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  actions: {
    padding: spacing.lg,
  },
  permiso: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
  },
  permisoTitulo: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  permisoTexto: {
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  sheetOverlay: {
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
