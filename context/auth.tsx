import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { credentials, getUser, users } from '@/data/mock';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  // Devuelve true si las credenciales coinciden. Acepta email o nombre de usuario.
  login: (identifier: string, password: string) => boolean;
  logout: () => void;
  isHydrated: boolean;
};

// Solo se guarda el id del usuario logueado, nunca la contraseña.
const STORAGE_KEY = 'sleeve-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function findUserId(identifier: string): string | undefined {
  const id = identifier.trim().toLowerCase();
  if (id.includes('@')) return credentials.find((c) => c.email.toLowerCase() === id)?.userId;
  return users.find((u) => u.username.toLowerCase() === id)?.id;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Al abrir la app recuperamos la sesión guardada, si existe y el usuario sigue existiendo.
  useEffect(() => {
    async function loadSession() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && getUser(saved)) setUserId(saved);
      } catch {
        // Si falla la lectura, se pide login otra vez.
      } finally {
        setIsHydrated(true);
      }
    }
    loadSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    function login(identifier: string, password: string) {
      const id = findUserId(identifier);
      const credential = credentials.find((c) => c.userId === id);
      if (!id || !credential || credential.password !== password) return false;
      setUserId(id);
      AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
      return true;
    }

    function logout() {
      setUserId(null);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }

    return { user: userId ? (getUser(userId) ?? null) : null, login, logout, isHydrated };
  }, [userId, isHydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}

// Para las pantallas que solo existen con sesión iniciada (todo lo que está dentro del Stack).
export function useCurrentUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('useCurrentUser requiere una sesión iniciada');
  return user;
}
