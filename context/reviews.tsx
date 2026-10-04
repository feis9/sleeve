import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth';
import { reviews as mockReviews } from '@/data/mock';
import type { Review } from '@/types';

type ReviewsContextValue = {
  reviewsFor: (releaseId: string) => Review[];
  reviewsBy: (userId: string) => Review[];
  // La reseña del usuario logueado para esa edición (una por edición; escribir otra la reemplaza).
  myReviewFor: (releaseId: string) => Review | undefined;
  saveReview: (releaseId: string, rating: number, body: string) => void;
};

// Reseñas escritas en este teléfono. Sin backend no se comparten entre dispositivos.
const STORAGE_KEY = 'sleeve-reviews';

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

const key = (r: Pick<Review, 'userId' | 'releaseId'>) => `${r.userId}:${r.releaseId}`;

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [local, setLocal] = useState<Review[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setLocal(JSON.parse(raw) as Review[]);
      } catch {
        // Lectura best-effort.
      } finally {
        setIsHydrated(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(local)).catch(() => {});
  }, [local, isHydrated]);

  const value = useMemo<ReviewsContextValue>(() => {
    // Las reseñas locales pisan a las de ejemplo del mismo usuario y edición.
    const localKeys = new Set(local.map(key));
    const all = [...local, ...mockReviews.filter((r) => !localKeys.has(key(r)))];
    const byDate = (a: Review, b: Review) => b.createdAt.localeCompare(a.createdAt);

    function saveReview(releaseId: string, rating: number, body: string) {
      if (!user) return;
      const review: Review = {
        id: `rv-${user.id}-${releaseId}`,
        userId: user.id,
        releaseId,
        rating,
        body: body.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setLocal((prev) => [review, ...prev.filter((r) => key(r) !== key(review))]);
    }

    return {
      reviewsFor: (releaseId) => all.filter((r) => r.releaseId === releaseId).sort(byDate),
      reviewsBy: (userId) => all.filter((r) => r.userId === userId).sort(byDate),
      myReviewFor: (releaseId) => (user ? all.find((r) => r.userId === user.id && r.releaseId === releaseId) : undefined),
      saveReview,
    };
  }, [local, user]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews debe usarse dentro de <ReviewsProvider>');
  return context;
}
