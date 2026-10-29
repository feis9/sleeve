import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { User } from '@/types';
import { ApiError, apiPost } from '@/utils/api';

// 'ok': entró. 'invalid': el backend rechazó los datos. 'offline': no se pudo hablar con el backend.
export type LoginResult = 'ok' | 'invalid' | 'offline';
// Además, 'taken': el usuario o el email ya están registrados (409).
export type RegisterResult = LoginResult | 'taken';

export type RegisterData = { name: string; username: string; email: string; password: string };

type AuthContextValue = {
  user: User | null;
  // Valida contra el backend (POST /api/login). Acepta email o nombre de usuario.
  login: (identifier: string, password: string) => Promise<LoginResult>;
  // Crea la cuenta en el backend (POST /api/registro) y deja la sesión iniciada con ella.
  register: (data: RegisterData) => Promise<RegisterResult>;
  logout: () => void;
  isHydrated: boolean;
};

// El usuario como lo devuelve el backend: nunca trae la contraseña.
type BackendUser = { id: string; username: string; email: string; name: string; avatarColor: string };

// Se guarda el usuario logueado (sin contraseña), no solo su id: las cuentas creadas con el registro
// no están en data/mock.ts. v2 porque antes se guardaba solo el id.
const STORAGE_KEY = 'sleeve-session-v2';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Lo que la app guarda del usuario: el email no se muestra en ningún lado.
function toUser(u: BackendUser): User {
  return { id: u.id, username: u.username, name: u.name, avatarColor: u.avatarColor };
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
    function iniciarSesion(u: BackendUser) {
      const nuevo = toUser(u);
      setUser(nuevo);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo)).catch(() => {});
    }

    async function login(identifier: string, password: string): Promise<LoginResult> {
      try {
        iniciarSesion(await apiPost<BackendUser>('/api/login', { identifier, password }));
        return 'ok';
      } catch (e) {
        // 400 o 401: el backend respondió y los datos no sirven. Cualquier otra cosa: no hubo conexión
        // (backend apagado, otra Wi-Fi, timeout) o falló el servidor.
        if (e instanceof ApiError && (e.status === 400 || e.status === 401)) return 'invalid';
        return 'offline';
      }
    }

    async function register(data: RegisterData): Promise<RegisterResult> {
      try {
        iniciarSesion(await apiPost<BackendUser>('/api/registro', data));
        return 'ok';
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) return 'taken';
        if (e instanceof ApiError && e.status === 400) return 'invalid';
        return 'offline';
      }
    }

    function logout() {
      setUser(null);
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }

    return { user, login, register, logout, isHydrated };
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
