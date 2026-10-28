import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getUser } from '@/data/mock';
import type { User } from '@/types';
import { ApiError, apiPost } from '@/utils/api';

// 'ok': entró. 'invalid': el backend rechazó los datos. 'offline': no se pudo hablar con el backend.
export type LoginResult = 'ok' | 'invalid' | 'offline';

type AuthContextValue = {
  user: User | null;
  // Valida contra el backend (POST /api/login). Acepta email o nombre de usuario.
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isHydrated: boolean;
};

// El usuario como lo devuelve el backend: nunca trae la contraseña.
type BackendUser = { id: string; username: string; email: string; name: string; avatarColor: string };

// Se guarda el usuario logueado (sin contraseña), no solo su id: las cuentas creadas con el registro
// no están en data/mock.ts. v2 porque antes se guardaba solo el id.
const STORAGE_KEY = 'sleeve-session-v2';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Las cuentas de prueba arrancan con su colección de ejemplo; las nuevas, vacías.
function toUser(u: BackendUser): User {
  return { id: u.id, username: u.username, name: u.name, avatarColor: u.avatarColor, collection: getUser(u.id)?.collection ?? [] };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Al abrir la app recuperamos la sesión guardada, si existe.
  useEffect(() => {
    async function loadSession() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<User>;
          if (parsed.id && parsed.username) setUser(parsed as User);
        }
      } catch {
        // Si falla la lectura, se pide login otra vez.
      } finally {
        setIsHydrated(true);
      }
    }
    loadSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    async function login(identifier: string, password: string): Promise<LoginResult> {
      try {
        const nuevo = toUser(await apiPost<BackendUser>('/api/login', { identifier, password }));
        setUser(nuevo);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo)).catch(() => {});
        return 'ok';
      } catch (e) {
        // 400 o 401: el backend respondió y los datos no sirven. Cualquier otra cosa: no hubo conexión
        // (backend apagado, otra Wi-Fi, timeout) o falló el servidor.
        if (e instanceof ApiError && (e.status === 400 || e.status === 401)) return 'invalid';
        return 'offline';
      }
    }

    function logout() {
      setUser(null);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }

    return { user, login, logout, isHydrated };
  }, [user, isHydrated]);

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

// Un usuario por id: el logueado sale de la sesión (puede no estar en el mock) y los demás, del mock.
export function useUserById(id: string): User | undefined {
  const { user } = useAuth();
  return user && user.id === id ? user : getUser(id);
}
