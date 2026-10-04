import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth';
import { getUser, users } from '@/data/mock';

type CollectionContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  isHydrated: boolean;
};

const CollectionContext = createContext<CollectionContextValue | null>(null);

// Cada usuario tiene su propia colección guardada en el teléfono.
const storageKey = (userId: string) => `sleeve-collection-${userId}`;

type Stored = { userId: string; ids: string[] };

const EMPTY: string[] = [];

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [stored, setStored] = useState<Stored | null>(null);

  // Al cambiar de usuario (login, logout, otra cuenta) cargamos su colección.
  // Si nunca guardó nada, arranca con la de los datos de ejemplo.
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;
    async function loadCollection(id: string) {
      let ids = getUser(id)?.collection ?? [];
      try {
        const raw = await AsyncStorage.getItem(storageKey(id));
        if (raw) ids = JSON.parse(raw) as string[];
      } catch {
        // Si falla la lectura, usamos la colección de ejemplo.
      }
      if (!cancelado) setStored({ userId: id, ids });
    }
    loadCollection(userId);
    return () => {
      cancelado = true;
    };
  }, [userId]);

  // Solo mostramos la colección si corresponde al usuario actual (evita ver la del anterior).
  const isHydrated = userId !== null && stored?.userId === userId;
  const ids = isHydrated && stored ? stored.ids : EMPTY;

  const value = useMemo<CollectionContextValue>(() => {
    function has(id: string) {
      return ids.includes(id);
    }

    function toggle(id: string) {
      if (!userId) return;
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
      setStored({ userId, ids: next });
      AsyncStorage.setItem(storageKey(userId), JSON.stringify(next)).catch(() => {
        // Guardado best-effort: si falla, el cambio sigue en memoria hasta cerrar la app.
      });
    }

    return { ids, has, toggle, isHydrated };
  }, [ids, userId, isHydrated]);

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection tiene que usarse dentro de CollectionProvider');
  return ctx;
}

// Ranking por cantidad de discos. Tu cantidad sale del estado, así sube si agregás discos.
export function useRanking() {
  const { user } = useAuth();
  const { ids } = useCollection();
  return users
    .map((u) => ({ user: u, count: u.id === user?.id ? ids.length : u.collection.length }))
    .sort((a, b) => b.count - a.count);
}
