import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth';
import { getUser, users } from '@/data/mock';
import type { Find } from '@/types';

type CollectionContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  add: (id: string) => void;
  // Al quitar un disco también se borra dónde lo encontraste.
  remove: (id: string) => void;
  findFor: (id: string) => Find | undefined;
  // Se llama cuando llega la ubicación (después de agregar). Si el disco ya no está, se ignora.
  saveFind: (id: string, find: Find) => void;
  isHydrated: boolean;
};

const CollectionContext = createContext<CollectionContextValue | null>(null);

// Cada usuario tiene su propia colección y sus hallazgos guardados en el teléfono.
const collectionKey = (userId: string) => `sleeve-collection-${userId}`;
const findsKey = (userId: string) => `sleeve-finds-${userId}`;

type Finds = Record<string, Find>;
type Stored = { userId: string; ids: string[]; finds: Finds };

const EMPTY_IDS: string[] = [];
const EMPTY_FINDS: Finds = {};

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
      let finds: Finds = {};
      try {
        const [rawIds, rawFinds] = await Promise.all([
          AsyncStorage.getItem(collectionKey(id)),
          AsyncStorage.getItem(findsKey(id)),
        ]);
        if (rawIds) ids = JSON.parse(rawIds) as string[];
        if (rawFinds) finds = JSON.parse(rawFinds) as Finds;
      } catch {
        // Si falla la lectura, usamos la colección de ejemplo y sin hallazgos.
      }
      if (!cancelado) setStored({ userId: id, ids, finds });
    }
    loadCollection(userId);
    return () => {
      cancelado = true;
    };
  }, [userId]);

  // Guardamos cada cambio. Solo cuando lo cargado es del usuario actual, para no pisar otra cuenta.
  useEffect(() => {
    if (!stored || stored.userId !== userId) return;
    AsyncStorage.multiSet([
      [collectionKey(stored.userId), JSON.stringify(stored.ids)],
      [findsKey(stored.userId), JSON.stringify(stored.finds)],
    ]).catch(() => {
      // Guardado best-effort: si falla, el cambio sigue en memoria hasta cerrar la app.
    });
  }, [stored, userId]);

  // Solo mostramos la colección si corresponde al usuario actual (evita ver la del anterior).
  const isHydrated = userId !== null && stored?.userId === userId;
  const ids = isHydrated && stored ? stored.ids : EMPTY_IDS;
  const finds = isHydrated && stored ? stored.finds : EMPTY_FINDS;

  const value = useMemo<CollectionContextValue>(() => {
    // Actualización funcional: la ubicación llega async y el estado puede haber cambiado mientras tanto.
    function update(change: (prev: Stored) => Stored) {
      setStored((prev) => (prev && prev.userId === userId ? change(prev) : prev));
    }

    function add(id: string) {
      update((prev) => (prev.ids.includes(id) ? prev : { ...prev, ids: [id, ...prev.ids] }));
    }

    function remove(id: string) {
      update((prev) => {
        const { [id]: _borrado, ...resto } = prev.finds;
        return { ...prev, ids: prev.ids.filter((x) => x !== id), finds: resto };
      });
    }

    function saveFind(id: string, find: Find) {
      update((prev) => (prev.ids.includes(id) ? { ...prev, finds: { ...prev.finds, [id]: find } } : prev));
    }

    return {
      ids,
      has: (id) => ids.includes(id),
      add,
      remove,
      findFor: (id) => finds[id],
      saveFind,
      isHydrated,
    };
  }, [ids, finds, userId, isHydrated]);

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
