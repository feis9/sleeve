import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { releases as mockReleases, releasesByBarcode as mockReleasesByBarcode } from '@/data/mock';
import type { Release } from '@/types';

type ReleasesContextValue = {
  releases: Release[];
  getRelease: (id: string) => Release | undefined;
  // Todas las ediciones con ese código (puede haber varias, como Back In Black).
  releasesByBarcode: (barcode: string) => Release[];
};

const ReleasesContext = createContext<ReleasesContextValue | undefined>(undefined);

// Única puerta de la app a los discos. Por ahora salen de data/mock.ts. Las pantallas no saben de dónde
// vienen, así que sumar los de Discogs (a través del backend) no obliga a tocarlas.
export function ReleasesProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ReleasesContextValue>(() => {
    const porId = new Map(mockReleases.map((r) => [r.id, r]));
    return {
      releases: mockReleases,
      getRelease: (id) => porId.get(id),
      releasesByBarcode: mockReleasesByBarcode,
    };
  }, []);

  return <ReleasesContext.Provider value={value}>{children}</ReleasesContext.Provider>;
}

export function useReleases(): ReleasesContextValue {
  const context = useContext(ReleasesContext);
  if (!context) throw new Error('useReleases debe usarse dentro de <ReleasesProvider>');
  return context;
}
