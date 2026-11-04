import Constants from 'expo-constants';

import { conTimeout } from '@/utils/timeout';

// Puerto de backend/.env (PORT).
const PUERTO = 3000;
// Si el backend no responde en este tiempo, la app sigue con lo que tenga guardado.
const TIMEOUT_MS = 10000;

// hostUri es la dirección de la PC donde corre Metro ("192.168.100.92:8081"). El backend corre en la
// misma PC, así que se usa esa IP con el puerto del backend. No hay que escribir la IP a mano y anda
// en cualquier PC del equipo. Solo existe en desarrollo (Expo Go), que es como se usa la app.
const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_URL = host ? `http://${host}:${PUERTO}` : null;

// El backend respondió con un status de error. Con el status, la pantalla distingue
// "datos incorrectos" (400, 401, 409) de "no hay conexión" (cualquier otro error).
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Token de la sesión actual. Lo pone AuthProvider al entrar o al abrir la app y lo saca al cerrar sesión.
// Vive acá, y no en el contexto, para que cualquier pedido lo mande sin que cada pantalla tenga que pasarlo.
let token: string | null = null;
// Lo que hay que hacer cuando el backend dice que la sesión ya no sirve (401). Lo registra AuthProvider.
let alPerderSesion: (() => void) | null = null;

export function setToken(nuevo: string | null) {
  token = nuevo;
}

// Registra qué hacer ante un 401 con el token actual. Devuelve la función que lo desregistra (para el useEffect).
export function onSesionPerdida(accion: () => void) {
  alPerderSesion = accion;
  return () => {
    if (alPerderSesion === accion) alPerderSesion = null;
  };
}

async function pedir<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('No se conoce la dirección del backend');
  // Se lee antes del primer await: es el token con el que sale este pedido, aunque la sesión cambie mientras espera.
  const enviado = token;
  // Con sesión, cada pedido lleva "Authorization: Bearer <token>". El backend saca de ahí quién llama.
  const headers = { ...(init?.headers as Record<string, string> | undefined), ...(enviado && { Authorization: `Bearer ${enviado}` }) };
  const response = await conTimeout(fetch(`${API_URL}${path}`, { ...init, headers }), TIMEOUT_MS);
  // 401 con el token actual: la sesión venció o se cerró desde el backend. Se cierra también en la app.
  // Si el token ya cambió (por ejemplo, se volvió a entrar mientras el pedido viajaba), el 401 es de una sesión vieja y no se toca nada.
  if (response.status === 401 && enviado !== null && enviado === token) alPerderSesion?.();
  if (!response.ok) throw new ApiError(`El backend respondió ${response.status}`, response.status);
  // 204 (DELETE) no trae body.
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

// GET al backend. Tira error si no hay backend, si tarda o si responde con un status de error.
export function apiGet<T>(path: string): Promise<T> {
  return pedir<T>(path);
}

function conBody(method: 'POST' | 'PUT', body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

// POST con body JSON. Mismos errores que apiGet.
export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return pedir<T>(path, conBody('POST', body));
}

// PUT con body JSON (crear o reemplazar). Mismos errores que apiGet.
export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return pedir<T>(path, conBody('PUT', body));
}

// DELETE. Mismos errores que apiGet.
export function apiDelete(path: string): Promise<void> {
  return pedir<void>(path, { method: 'DELETE' });
}
