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

// GET al backend. Tira error si no hay backend, si tarda o si responde con un status de error.
export async function apiGet<T>(path: string): Promise<T> {
  if (!API_URL) throw new Error('No se conoce la dirección del backend');
  const response = await conTimeout(fetch(`${API_URL}${path}`), TIMEOUT_MS);
  if (!response.ok) throw new Error(`El backend respondió ${response.status}`);
  return (await response.json()) as T;
}
