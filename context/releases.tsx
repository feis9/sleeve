import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DEMO_RELEASE_IDS } from '@/data/mock';
import type { Release } from '@/types';
import { apiGet } from '@/utils/api';
import { normalizeBarcode } from '@/utils/validation';

// 'cargando': todavía no respondió el backend. 'listo': hay datos de Discogs de esta sesión.
// 'sin-conexion': el backend no respondió; se muestra lo último guardado, si hay.
export type CatalogStatus = 'cargando' | 'listo' | 'sin-conexion';

type ReleasesContextValue = {
  releases: Release[];
  status: CatalogStatus;
  getRelease: (id: string) => Release | undefined;
  // Todas las ediciones con ese código (puede haber varias, como Back In Black).
  releasesByBarcode: (barcode: string) => Release[];
};

// Última copia de los discos, para abrir la app sin conexión o con el backend apagado.
const STORAGE_KEY = 'sleeve-catalog';

const ReleasesContext = createContext<ReleasesContextValue | undefined>(undefined);

// Única puerta de la app a los discos. Los datos vienen de Discogs a través del backend:
// las pantallas no saben de dónde salen.
export function ReleasesProvider({ children }: { children: ReactNode }) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [status, setStatus] = useState<CatalogStatus>('cargando');

  useEffect(() => {
    let cancelado = false;
    async function cargar() {
      // 1. Lo último guardado, para mostrar algo al instante aunque el backend tarde o no esté.
      let guardados: Release[] = [];
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) guardados = JSON.parse(raw) as Release[];
      } catch {
        // Lectura best-effort.
      }
      if (!cancelado && guardados.length > 0) setReleases(guardados);

      // 2. Los 10 discos de la demo, en paralelo. allSettled: si falla uno, los demás se muestran igual.
      const nuevos = new Map<string, Release>();
      async function pedir(ids: number[]) {
        const resultados = await Promise.allSettled(ids.map((id) => apiGet<Release>(`/api/discogs/releases/${id}`)));
        const fallidos: { id: number; motivo: unknown }[] = [];
        resultados.forEach((r, i) => {
          if (r.status === 'fulfilled') nuevos.set(r.value.id, r.value);
          else fallidos.push({ id: ids[i], motivo: r.reason });
        });
        return fallidos;
      }
      let fallidos = await pedir(DEMO_RELEASE_IDS);
      // Un reintento para los que fallaron: en una prueba, la primera carga perdió un disco sin motivo visible
      // y al recargar apareció. Si hay backend, el segundo intento casi siempre alcanza.
      if (!cancelado && fallidos.length > 0 && fallidos.length < DEMO_RELEASE_IDS.length) {
        fallidos = await pedir(fallidos.map((f) => f.id));
      }
      if (cancelado) return;
      // Aviso en la consola de Metro: sin esto, un disco que no carga desaparece sin explicación.
      fallidos.forEach((f) => console.warn(`No se pudo cargar el disco ${f.id}: ${String(f.motivo)}`));
      if (nuevos.size === 0) {
        setStatus('sin-conexion');
        return;
      }
      // Si alguno falló, se completa con su copia guardada. Se respeta el orden de la demo.
      const anteriores = new Map(guardados.map((r) => [r.id, r]));
      const catalogo = DEMO_RELEASE_IDS.map((id) => nuevos.get(String(id)) ?? anteriores.get(String(id))).filter(
        (r): r is Release => r !== undefined,
      );
      setReleases(catalogo);
      setStatus('listo');
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo)).catch(() => {
        // Guardado best-effort.
      });
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  const value = useMemo<ReleasesContextValue>(() => {
    const porId = new Map(releases.map((r) => [r.id, r]));
    return {
      releases,
      status,
      getRelease: (id) => porId.get(id),
      releasesByBarcode: (barcode) => {
        const codigo = normalizeBarcode(barcode);
        return releases.filter((r) => r.barcode !== null && normalizeBarcode(r.barcode) === codigo);
      },
    };
  }, [releases, status]);

  return <ReleasesContext.Provider value={value}>{children}</ReleasesContext.Provider>;
}

export function useReleases(): ReleasesContextValue {
  const context = useContext(ReleasesContext);
  if (!context) throw new Error('useReleases debe usarse dentro de <ReleasesProvider>');
  return context;
}
