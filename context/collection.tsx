import { createContext, useContext, useState, type ReactNode } from 'react';

import { getUser, ME_ID, users } from '@/data/mock';

type CollectionContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
};

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(getUser(ME_ID)?.collection ?? []);

  function has(id: string) {
    return ids.includes(id);
  }

  function toggle(id: string) {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }

  return (
    <CollectionContext.Provider value={{ ids, has, toggle }}>{children}</CollectionContext.Provider>
  );
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection tiene que usarse dentro de CollectionProvider');
  return ctx;
}

// Ranking por cantidad de discos. Tu cantidad sale del estado, así sube si agregás discos.
export function useRanking() {
  const { ids } = useCollection();
  return users
    .map((user) => ({ user, count: user.id === ME_ID ? ids.length : user.collection.length }))
    .sort((a, b) => b.count - a.count);
}