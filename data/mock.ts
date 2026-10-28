import type { Credential, Review, User } from '@/types';

// Datos de prueba de usuarios hasta que el backend los reemplace (Express + Prisma).
// Los discos ya no están acá: los datos de cada edición vienen de Discogs a través del backend.
export const ME_ID = 'u-luca';

// Ediciones de la demo, por número de release de Discogs. Título, tracklist, país y tapa los trae
// el backend (GET /api/discogs/releases/:id). En la app, el id de cada disco es este número como texto.
export const DEMO_RELEASE_IDS = [
  15527003, // Sticky Fingers. Discogs no indica país; Pressed By: MPO (Francia).
  // Back In Black: el mismo código (696998020719) está en varias ediciones. Van 3 de plantas distintas
  // para que el escáner muestre el panel "Elegí la que coincide con tu copia".
  1517028, // Pressed By: United Record Pressing (EE. UU.).
  8487517, // País en Discogs: US; Pressed By: MPO.
  35395852, // Discogs no indica país; Pressed By: Vantiva, Guadalajara (México).
  4345204, // Moanin'. Reedición europea de WaxTime (no es la edición de Blue Note).
  // Jar Of Flies: el código 196588003714 está en 2 ediciones (EE. UU. y la internacional).
  30106898, // Pressed By: United Record Pressing (EE. UU.).
  30170624, // País en Discogs: "Worldwide"; Pressed By: Pallas (Alemania).
  25128898, // Use Your Illusion II. Prensado por Optimal Media (Alemania).
  25146217, // Use Your Illusion II. Mismo código de barras que la edición europea.
  6546645, // The Miseducation Of Lauryn Hill. Discogs no publica las duraciones de este prensado.
];

export const users: User[] = [
  {
    id: ME_ID,
    username: 'lucaf',
    name: 'Luca Faccennini',
    avatarColor: '#E8A33D',
    collection: ['15527003', '4345204', '6546645'],
  },
  {
    id: 'u-mica',
    username: 'mica.spins',
    name: 'Micaela Ruiz',
    avatarColor: '#C0587E',
    collection: ['1517028', '25128898', '30106898', '6546645', '15527003', '4345204'],
  },
  {
    id: 'u-tomas',
    username: 'tomas_crate',
    name: 'Tomás Vidal',
    avatarColor: '#4F8A8B',
    collection: ['8487517', '25146217', '30170624', '4345204', '1517028'],
  },
  {
    id: 'u-sofi',
    username: 'sofi33rpm',
    name: 'Sofía Paz',
    avatarColor: '#7B6CF6',
    collection: ['35395852', '6546645', '15527003', '25128898'],
  },
  {
    id: 'u-juan',
    username: 'juanjazz',
    name: 'Juan Ortega',
    avatarColor: '#3E7CB1',
    collection: ['4345204', '30106898'],
  },
];

// Credenciales de prueba para el login local (Sprint 1, sin backend).
// Van en texto plano solo porque son datos simulados; con backend esto se valida en el servidor.
export const credentials: Credential[] = [
  { userId: ME_ID, email: 'luca@sleeve.app', password: 'vinilo123' },
  { userId: 'u-mica', email: 'mica@sleeve.app', password: 'vinilo123' },
  { userId: 'u-tomas', email: 'tomas@sleeve.app', password: 'vinilo123' },
  { userId: 'u-sofi', email: 'sofi@sleeve.app', password: 'vinilo123' },
  { userId: 'u-juan', email: 'juan@sleeve.app', password: 'vinilo123' },
];

// Las reseñas de ejemplo hablaban de discos que ya no están en la demo. Las nuevas se escriben desde la app.
export const reviews: Review[] = [];

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export function reviewsFor(releaseId: string) {
  return reviews.filter((r) => r.releaseId === releaseId);
}

export function reviewsBy(userId: string) {
  return reviews.filter((r) => r.userId === userId);
}
