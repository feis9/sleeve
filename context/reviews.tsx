import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useAuth } from '@/context/auth';
import type { Review } from '@/types';
import { apiGet, apiPut } from '@/utils/api';

type ReviewsContextValue = {
  reviewsFor: (releaseId: string) => Review[];
  reviewsBy: (userId: string) => Review[];
  // La reseña del usuario logueado para esa edición (una por edición; escribir otra la reemplaza).
  myReviewFor: (releaseId: string) => Review | undefined;
  // Guarda en el backend. false si no se pudo (sin conexión o datos rechazados).
  saveReview: (releaseId: string, rating: number, body: string) => Promise<boolean>;
  // Vuelve a pedir las reseñas, para ver las que escribieron otros desde que se abrió la app.
  refresh: () => void;
};

// Reseña como la devuelve el backend (GET /api/resenas), con su autor sin contraseña.
type BackendReview = {
  id: string;
  usuarioId: string;
  releaseId: string;
  rating: number;
  body: string;
  updatedAt: string;
  usuario: { id: string; username: string; name: string; avatarColor: string };
};

// Copia de las reseñas del backend, para verlas sin conexión. v3: desde la tarea 13 las reseñas
// están en el backend y se comparten entre teléfonos; las de v2 eran solo de este teléfono.
const STORAGE_KEY = 'sleeve-reviews-v3';

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

function toReview(r: BackendReview): Review {
  return {
    id: r.id,
    userId: r.usuarioId,
    releaseId: r.releaseId,
    rating: r.rating,
    body: r.body,
    // Como antes en la app: la fecha que se muestra es la de la última vez que se escribió.
    createdAt: r.updatedAt.slice(0, 10),
    author: { ...r.usuario, collection: [] },
  };
}

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  const refresh = useCallback(async () => {
    try {
      const nuevas = (await apiGet<BackendReview[]>('/api/resenas')).map(toReview);
      setReviews(nuevas);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas)).catch(() => {});
    } catch {
      // Sin backend se quedan las que había (la copia guardada o las de la última carga).
    }
  }, []);

  // Al abrir la app: primero la copia guardada, después las del backend.
  useEffect(() => {
    async function cargar() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setReviews((actuales) => (actuales.length > 0 ? actuales : (JSON.parse(raw) as Review[])));
      } catch {
        // Lectura best-effort.
      }
      refresh();
    }
    cargar();
  }, [refresh]);

  const value = useMemo<ReviewsContextValue>(() => {
    // El backend ya las manda de la más reciente a la más vieja; se ordena igual por las que se agregan acá.
    const byDate = (a: Review, b: Review) => b.createdAt.localeCompare(a.createdAt);

    async function saveReview(releaseId: string, rating: number, body: string) {
      if (!user) return false;
      try {
        const guardada = toReview(
          await apiPut<BackendReview>(`/api/usuarios/${encodeURIComponent(user.id)}/resenas/${releaseId}`, { rating, body }),
        );
        setReviews((prev) => [guardada, ...prev.filter((r) => r.id !== guardada.id)]);
        return true;
      } catch {
        return false;
      }
    }

    return {
      reviewsFor: (releaseId) => reviews.filter((r) => r.releaseId === releaseId).sort(byDate),
      reviewsBy: (userId) => reviews.filter((r) => r.userId === userId).sort(byDate),
      myReviewFor: (releaseId) => (user ? reviews.find((r) => r.userId === user.id && r.releaseId === releaseId) : undefined),
      saveReview,
      refresh,
    };
  }, [reviews, user, refresh]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews debe usarse dentro de <ReviewsProvider>');
  return context;
}
