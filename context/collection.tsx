import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth';
import { useReleases } from '@/context/releases';
import type { Find, User } from '@/types';
import { apiDelete, apiGet, apiPut } from '@/utils/api';

type RankingEntry = { user: User; count: number };

type CollectionContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  // Agrega al instante y guarda en el backend. false si el backend no lo guardó (se deshace).
  add: (id: string) => Promise<boolean>;
  // Al quitar un disco también se borra dónde lo encontraste. false si el backend no lo borró (se deshace).
  remove: (id: string) => Promise<boolean>;
  findFor: (id: string) => Find | undefined;
  // Se llama cuando llega la ubicación (después de agregar). false si no se pudo guardar.
  saveFind: (id: string, find: Find) => Promise<boolean>;
  isHydrated: boolean;
  // Todos los usuarios con su cantidad de discos (GET /api/ranking), sin tu cantidad actualizada.
  rankingBase: RankingEntry[];
};

const CollectionContext = createContext<CollectionContextValue | null>(null);

// Copia de la colección de cada usuario, para verla sin conexión. La fuente es el backend.
// v3: desde la tarea 13b la colección está en el backend; lo guardado antes (v2) era solo de este teléfono.
const collectionKey = (userId: string) => `sleeve-collection-v3-${userId}`;
const RANKING_KEY = 'sleeve-ranking';

type Finds = Record<string, Find>;
type Stored = { userId: string; ids: string[]; finds: Finds };

// Un disco de la colección como lo devuelve el backend.
type BackendItem = { releaseId: string; find: Find | null };
type BackendRanking = { usuario: User; discos: number }[];

const EMPTY_IDS: string[] = [];
const EMPTY_FINDS: Finds = {};

function desdeBackend(userId: string, items: BackendItem[]): Stored {
  const finds: Finds = {};
  items.forEach((i) => {
    if (i.find) finds[i.releaseId] = i.find;
  });
  return { userId, ids: items.map((i) => i.releaseId), finds };
}

const ruta = (userId: string, releaseId?: string) =>
  `/api/usuarios/${encodeURIComponent(userId)}/coleccion${releaseId ? `/${releaseId}` : ''}`;

export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { ensureReleases } = useReleases();
  const userId = user?.id ?? null;
  const [stored, setStored] = useState<Stored | null>(null);
  const [rankingBase, setRankingBase] = useState<RankingEntry[]>([]);

  // Al cambiar de usuario (login, logout, otra cuenta) cargamos su colección: primero la copia guardada,
  // después la del backend. Los discos que este teléfono no tiene (agregados desde otro) se piden.
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;
    async function loadCollection(id: string) {
      try {
        const raw = await AsyncStorage.getItem(collectionKey(id));
        if (raw && !cancelado) setStored((prev) => (prev?.userId === id ? prev : (JSON.parse(raw) as Stored)));
      } catch {
        // Lectura best-effort.
      }
      try {
        const nuevo = desdeBackend(id, await apiGet<BackendItem[]>(ruta(id)));
        if (cancelado) return;
        setStored(nuevo);
        ensureReleases(nuevo.ids);
      } catch {
        // Sin backend se queda la copia guardada. Si no había, la colección arranca vacía.
        if (!cancelado) setStored((prev) => (prev?.userId === id ? prev : { userId: id, ids: [], finds: {} }));
      }
    }
    loadCollection(userId);
    return () => {
      cancelado = true;
    };
  }, [userId, ensureReleases]);

  // Ranking: copia guardada y después el backend. Se vuelve a pedir al cambiar de usuario
  // (una cuenta recién creada tiene que aparecer).
  useEffect(() => {
    let cancelado = false;
    async function loadRanking() {
      try {
        const raw = await AsyncStorage.getItem(RANKING_KEY);
        if (raw && !cancelado) setRankingBase((prev) => (prev.length > 0 ? prev : (JSON.parse(raw) as RankingEntry[])));
        const nuevo = (await apiGet<BackendRanking>('/api/ranking')).map((r) => ({ user: r.usuario, count: r.discos }));
        if (cancelado) return;
        setRankingBase(nuevo);
        AsyncStorage.setItem(RANKING_KEY, JSON.stringify(nuevo)).catch(() => {});
      } catch {
        // Sin backend queda la copia guardada.
      }
    }
    loadRanking();
    return () => {
      cancelado = true;
    };
  }, [userId]);

  // Guardamos la copia de cada cambio. Solo cuando lo cargado es del usuario actual, para no pisar otra cuenta.
  useEffect(() => {
    if (!stored || stored.userId !== userId) return;
    AsyncStorage.setItem(collectionKey(stored.userId), JSON.stringify(stored)).catch(() => {
      // Guardado best-effort.
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

    // El cambio se ve al instante y, si el backend no lo guarda, se deshace.
    async function conRespaldo(cambio: (prev: Stored) => Stored, deshacer: (prev: Stored) => Stored, pedido: () => Promise<unknown>) {
      update(cambio);
      try {
        await pedido();
        return true;
      } catch {
        update(deshacer);
        return false;
      }
    }

    function sinDisco(prev: Stored, id: string): Stored {
      const { [id]: _borrado, ...resto } = prev.finds;
      return { ...prev, ids: prev.ids.filter((x) => x !== id), finds: resto };
    }

    async function add(id: string) {
      if (!userId) return false;
      if (ids.includes(id)) return true;
      return conRespaldo(
        (prev) => (prev.ids.includes(id) ? prev : { ...prev, ids: [id, ...prev.ids] }),
        (prev) => sinDisco(prev, id),
        () => apiPut(ruta(userId, id), {}),
      );
    }

    async function remove(id: string) {
      if (!userId) return false;
      const indice = ids.indexOf(id);
      const find = finds[id];
      return conRespaldo(
        (prev) => sinDisco(prev, id),
        // Vuelve a su lugar, con su hallazgo.
        (prev) => {
          const restaurados = [...prev.ids];
          restaurados.splice(Math.max(indice, 0), 0, id);
          return { ...prev, ids: restaurados, finds: find ? { ...prev.finds, [id]: find } : prev.finds };
        },
        () => apiDelete(ruta(userId, id)),
      );
    }

    async function saveFind(id: string, find: Find) {
      if (!userId) return false;
      return conRespaldo(
        (prev) => (prev.ids.includes(id) ? { ...prev, finds: { ...prev.finds, [id]: find } } : prev),
        (prev) => {
          const { [id]: _borrado, ...resto } = prev.finds;
          return { ...prev, finds: resto };
        },
        () => apiPut(`${ruta(userId, id)}/hallazgo`, find),
      );
    }

    return {
      ids,
      has: (id) => ids.includes(id),
      add,
      remove,
      findFor: (id) => finds[id],
      saveFind,
      isHydrated,
      rankingBase,
    };
  }, [ids, finds, userId, isHydrated, rankingBase]);

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection tiene que usarse dentro de CollectionProvider');
  return ctx;
}

// Ranking por cantidad de discos. Tu cantidad sale del estado, así sube al instante si agregás discos.
// Si el ranking todavía no llegó (o sos una cuenta nueva), aparecés igual.
export function useRanking(): RankingEntry[] {
  const { user } = useAuth();
  const { ids, rankingBase } = useCollection();
  const otros = rankingBase.filter((r) => r.user.id !== user?.id);
  const todos = user ? [...otros, { user, count: ids.length }] : otros;
  return todos.sort((a, b) => b.count - a.count);
}

// Un usuario por id: el logueado sale de la sesión y los demás, del ranking (trae a todos los usuarios).
export function useUserById(id: string): User | undefined {
  const { user } = useAuth();
  const { rankingBase } = useCollection();
  if (user && user.id === id) return user;
  return rankingBase.find((r) => r.user.id === id)?.user;
}

// Los discos de cualquier usuario: los tuyos del estado; los de otro, del backend. null mientras carga
// o si no se pudo cargar (sin conexión).
export function useUserCollection(userId: string): string[] | null {
  const { user } = useAuth();
  const { ids } = useCollection();
  const { ensureReleases } = useReleases();
  const esMio = user?.id === userId;
  const [ajena, setAjena] = useState<{ userId: string; ids: string[] } | null>(null);

  useEffect(() => {
    if (esMio) return;
    let cancelado = false;
    apiGet<BackendItem[]>(ruta(userId))
      .then((items) => {
        if (cancelado) return;
        setAjena({ userId, ids: items.map((i) => i.releaseId) });
        ensureReleases(items.map((i) => i.releaseId));
      })
      .catch(() => {
        // Queda en null: el perfil muestra que no se pudo cargar.
      });
    return () => {
      cancelado = true;
    };
  }, [esMio, userId, ensureReleases]);

  if (esMio) return ids;
  return ajena?.userId === userId ? ajena.ids : null;
}
