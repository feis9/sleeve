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

async function pedir<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('No se conoce la dirección del backend');
  const response = await conTimeout(fetch(`${API_URL}${path}`, init), TIMEOUT_MS);
  if (!response.ok) throw new ApiError(`El backend respondió ${response.status}`, response.status);
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
