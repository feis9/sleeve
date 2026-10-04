import * as Location from 'expo-location';

import type { Find } from '@/types';

// Resultado de intentar registrar dónde encontraste un disco. Ninguno bloquea agregarlo a la colección.
export type FindResult =
  | { status: 'ok'; find: Find }
  // canAskAgain === false: el sistema ya no muestra el diálogo, solo queda abrir Ajustes.
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'services-off' }
  | { status: 'error' };

// Si el GPS no responde en este tiempo, el disco queda sin ubicación.
const TIMEOUT_MS = 15000;

// Patrón de Sensores_ReactNative_Expo.pdf: consultar el permiso, pedirlo si se puede, y recién ahí leer.
export async function getCurrentFind(): Promise<FindResult> {
  try {
    let permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted && permiso.canAskAgain) {
      permiso = await Location.requestForegroundPermissionsAsync();
    }
    if (!permiso.granted) return { status: 'denied', canAskAgain: permiso.canAskAgain };

    if (!(await Location.hasServicesEnabledAsync())) return { status: 'services-off' };

    // Lectura puntual (no watchPositionAsync) y precisión Balanced: alcanza para ubicar una disquería
    // y gasta menos batería que High.
    const posicion = await conTimeout(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      TIMEOUT_MS,
    );
    const { latitude, longitude } = posicion.coords;

    return {
      status: 'ok',
      find: { latitude, longitude, place: await placeFor(latitude, longitude), date: new Date().toISOString() },
    };
  } catch {
    return { status: 'error' };
  }
}

// "San Telmo, Buenos Aires". Si el geocoding falla (por ejemplo, sin internet) se guarda solo la coordenada.
async function placeFor(latitude: number, longitude: number): Promise<string | null> {
  try {
    const [direccion] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!direccion) return null;
    const barrio = direccion.district;
    const ciudad = direccion.city ?? direccion.subregion ?? direccion.region;
    const partes = [barrio, ciudad].filter((p, i, todas): p is string => !!p && todas.indexOf(p) === i);
    return partes.length > 0 ? partes.join(', ') : direccion.name;
  } catch {
    return null;
  }
}

function conTimeout<T>(promesa: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promesa.then(
      (valor) => {
        clearTimeout(timer);
        resolve(valor);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// "05/10/2026"
export function formatFindDate(iso: string) {
  const fecha = new Date(iso);
  const dd = String(fecha.getDate()).padStart(2, '0');
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${fecha.getFullYear()}`;
}

// Texto para mostrar: el lugar si lo tenemos, si no la coordenada.
export function findPlaceLabel(find: Find) {
  return find.place ?? `${find.latitude.toFixed(4)}, ${find.longitude.toFixed(4)}`;
}
