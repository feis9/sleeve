// Los discos de la demo. Usuarios, colecciones y reseñas están en el backend (backend/src/seed.ts).
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
