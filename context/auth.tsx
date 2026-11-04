import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { User } from '@/types';
import { ApiError, apiDelete, apiGet, apiPost, onSesionPerdida, setToken } from '@/utils/api';

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
// Respuesta de login y registro: el usuario y el token de su sesión.
type BackendSesion = { usuario: BackendUser; token: string };

// Se guarda el usuario logueado (sin contraseña) y el token de su sesión, que va en cada pedido al backend.
// v3 porque la v2 no tenía token: una sesión v2 no sirve para escribir, así que se descarta y se pide login.
const STORAGE_KEY = 'sleeve-session-v3';
const STORAGE_KEY_VIEJA = 'sleeve-session-v2';
type Guardada = { usuario: User; token: string };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Lo que la app guarda del usuario: el email no se muestra en ningún lado.
function toUser(u: BackendUser): User {
  return { id: u.id, username: u.username, name: u.name, avatarColor: u.avatarColor };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cierra la sesión solo en este teléfono: sin token, sin usuario y sin copia guardada. La usan logout()
  // y el caso en que el backend responde 401 (la sesión venció o se cerró).
  const cerrarLocal = useCallback(() => {
    setToken(null);
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  // Cualquier pedido que reciba 401 con el token actual llama a cerrarLocal: la app vuelve al login.
  useEffect(() => onSesionPerdida(cerrarLocal), [cerrarLocal]);

  // Al abrir la app recuperamos la sesión guardada, si existe.
  useEffect(() => {
    async function loadSession() {
      AsyncStorage.removeItem(STORAGE_KEY_VIEJA).catch(() => {});
      let guardada: Guardada | null = null;
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Guardada>;
          if (parsed.token && parsed.usuario?.id) guardada = parsed as Guardada;
        }
      } catch {
        // Si falla la lectura, se pide login otra vez.
      }
      if (guardada) {
        setToken(guardada.token);
        setUser(guardada.usuario);
      }
      setIsHydrated(true);
      if (!guardada) return;
      // Se confirma con el backend que la sesión sigue valiendo, y de paso se actualizan los datos del usuario.
      // Si responde 401, onSesionPerdida ya cerró la sesión. Sin conexión se sigue con la guardada (solo lectura).
      try {
        const usuario = toUser(await apiGet<BackendUser>('/api/yo'));
        setUser(usuario);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ usuario, token: guardada.token })).catch(() => {});
      } catch {
        // 401 (ya manejado) o sin conexión.
      }
    }
    loadSession();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    // El token se carga antes que el usuario: los contextos que reaccionan al usuario ya piden con el token nuevo.
    function iniciarSesion({ usuario, token }: BackendSesion) {
      const nuevo = toUser(usuario);
      setToken(token);
      setUser(nuevo);
      const guardada: Guardada = { usuario: nuevo, token };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(guardada)).catch(() => {});
    }

    async function login(identifier: string, password: string): Promise<LoginResult> {
      try {
        iniciarSesion(await apiPost<BackendSesion>('/api/login', { identifier, password }));
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
        iniciarSesion(await apiPost<BackendSesion>('/api/registro', data));
        return 'ok';
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) return 'taken';
        if (e instanceof ApiError && e.status === 400) return 'invalid';
        return 'offline';
      }
    }

    // Avisa al backend para que borre la sesión (así el token deja de servir aunque alguien lo haya copiado)
    // y cierra en el teléfono sin esperar la respuesta: sin conexión, cerrar sesión tiene que andar igual.
    // apiDelete lee el token antes de su primer await, así que sale con el token que se está cerrando.
    function logout() {
      apiDelete('/api/sesion').catch(() => {});
      cerrarLocal();
    }

    return { user, login, register, logout, isHydrated };
  }, [user, isHydrated, cerrarLocal]);

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
