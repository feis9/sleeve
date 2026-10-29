import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { DEMO_RELEASE_IDS } from '@/data/mock';
import type { Release } from '@/types';
import { apiGet } from '@/utils/api';
import { normalizeBarcode } from '@/utils/validation';

// 'cargando': todavía no respondió el backend. 'listo': hay datos de Discogs de esta sesión.
// 'sin-conexion': el backend no respondió; se muestra lo último guardado, si hay.
export type CatalogStatus = 'cargando' | 'listo' | 'sin-conexion';

// Resultado de buscar un código en Discogs. sinConexion: el backend no respondió y las ediciones
// salen de las que ya están guardadas en el teléfono.
export type BarcodeSearch = { releases: Release[]; sinConexion: boolean };

type ReleasesContextValue = {
  releases: Release[];
  status: CatalogStatus;
  getRelease: (id: string) => Release | undefined;
  // Todas las ediciones con ese código (puede haber varias, como Back In Black).
  releasesByBarcode: (barcode: string) => Release[];
  // Busca el código en Discogs (a través del backend) y suma al catálogo las ediciones que encuentre.
  searchBarcode: (barcode: string) => Promise<BarcodeSearch>;
};

// Última copia de los discos (los de la demo y los escaneados), para abrir la app sin conexión
// o con el backend apagado.
const STORAGE_KEY = 'sleeve-catalog';

const DEMO_IDS = DEMO_RELEASE_IDS.map(String);

const ReleasesContext = createContext<ReleasesContextValue | undefined>(undefined);

function conCodigo(releases: Iterable<Release>, barcode: string) {
  const codigo = normalizeBarcode(barcode);
  return [...releases].filter((r) => r.barcode !== null && normalizeBarcode(r.barcode) === codigo);
}

// Pide varias ediciones en paralelo. allSettled: si falla una, las demás llegan igual.
async function pedirEdiciones(ids: string[]) {
  const resultados = await Promise.allSettled(ids.map((id) => apiGet<Release>(`/api/discogs/releases/${id}`)));
  const traidas: Release[] = [];
  const fallidas: { id: string; motivo: unknown }[] = [];
  resultados.forEach((r, i) => {
    if (r.status === 'fulfilled') traidas.push(r.value);
    else fallidas.push({ id: ids[i], motivo: r.reason });
  });
  return { traidas, fallidas };
}

// Aviso en la consola de Metro: sin esto, un disco que no carga desaparece sin explicación.
function avisarFallidas(fallidas: { id: string; motivo: unknown }[]) {
  fallidas.forEach((f) => console.warn(`No se pudo cargar el disco ${f.id}: ${String(f.motivo)}`));
}

// Une el catálogo: primero la demo, en su orden, y después los escaneados. Lo más nuevo pisa lo guardado.
function unir(...listas: Release[][]) {
  const porId = new Map(listas.flat().map((r) => [r.id, r]));
  const demo = DEMO_IDS.map((id) => porId.get(id)).filter((r): r is Release => r !== undefined);
  const escaneados = [...porId.values()].filter((r) => !DEMO_IDS.includes(r.id));
  return [...demo, ...escaneados];
}

// Única puerta de la app a los discos. Los datos vienen de Discogs a través del backend:
// las pantallas no saben de dónde salen.
export function ReleasesProvider({ children }: { children: ReactNode }) {
  const [releases, setReleases] = useState<Release[]>([]);
  const [status, setStatus] = useState<CatalogStatus>('cargando');
  // Copia del catálogo para searchBarcode: así la función no cambia con cada disco nuevo
  // y la pantalla de Buscar no repite la búsqueda.
  const conocidos = useRef<Release[]>([]);

  useEffect(() => {
    conocidos.current = releases;
    // Se guarda cada vez que cambia el catálogo (carga inicial o disco escaneado).
    if (releases.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(releases)).catch(() => {
        // Guardado best-effort.
      });
    }
  }, [releases]);

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
      if (!cancelado && guardados.length > 0) setReleases((actuales) => unir(guardados, actuales));

      // 2. Los discos de la demo, en paralelo. Los escaneados no se vuelven a pedir: queda su copia guardada.
      let { traidas, fallidas } = await pedirEdiciones(DEMO_IDS);
      // Un reintento para los que fallaron: en una prueba, la primera carga perdió un disco sin motivo visible
      // y al recargar apareció. Si hay backend, el segundo intento casi siempre alcanza.
      if (!cancelado && fallidas.length > 0 && fallidas.length < DEMO_IDS.length) {
        const reintento = await pedirEdiciones(fallidas.map((f) => f.id));
        traidas = [...traidas, ...reintento.traidas];
        fallidas = reintento.fallidas;
      }
      if (cancelado) return;
      avisarFallidas(fallidas);
      if (traidas.length === 0) {
        setStatus('sin-conexion');
        return;
      }
      // Si alguno falló, queda su copia guardada.
      setReleases((actuales) => unir(guardados, actuales, traidas));
      setStatus('listo');
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  const searchBarcode = useCallback(async (barcode: string): Promise<BarcodeSearch> => {
    const codigo = normalizeBarcode(barcode);
    let ids: string[];
    try {
      const encontradas = await apiGet<{ id: number }[]>(`/api/discogs/barcode/${codigo}`);
      ids = encontradas.map((e) => String(e.id));
    } catch {
      // Sin backend o sin Discogs: se busca entre los discos guardados en el teléfono.
      return { releases: conCodigo(conocidos.current, codigo), sinConexion: true };
    }
    // La búsqueda trae un resumen de cada edición. Para mostrar tapa, país y sello como en el resto
    // de la app se pide el detalle de las que todavía no están en el catálogo.
    const porId = new Map(conocidos.current.map((r) => [r.id, r]));
    const { traidas, fallidas } = await pedirEdiciones(ids.filter((id) => !porId.has(id)));
    avisarFallidas(fallidas);
    if (traidas.length > 0) setReleases((actuales) => unir(actuales, traidas));
    traidas.forEach((r) => porId.set(r.id, r));
    return {
      releases: ids.map((id) => porId.get(id)).filter((r): r is Release => r !== undefined),
      sinConexion: false,
    };
  }, []);

  const value = useMemo<ReleasesContextValue>(() => {
    const porId = new Map(releases.map((r) => [r.id, r]));
    return {
      releases,
      status,
      getRelease: (id) => porId.get(id),
      releasesByBarcode: (barcode) => conCodigo(releases, barcode),
      searchBarcode,
    };
  }, [releases, status, searchBarcode]);

  return <ReleasesContext.Provider value={value}>{children}</ReleasesContext.Provider>;
}

export function useReleases(): ReleasesContextValue {
  const context = useContext(ReleasesContext);
  if (!context) throw new Error('useReleases debe usarse dentro de <ReleasesProvider>');
  return context;
}
