// Ediciones de Discogs con una réplica en la base, para no gastar el límite de 60 pedidos por minuto
// ni pedir dos veces lo mismo.

import { getRelease } from "./discogs";
import { prisma } from "./prisma";

// La edición con la forma que usa la app (la que arma getRelease en discogs.ts).
type Release = Awaited<ReturnType<typeof getRelease>>;
// La edición más cuándo se consultó a Discogs (ISO 8601). La app lo usa para no mostrar copias de más de 6 horas:
// si una edición sale de la réplica, su antigüedad empieza a contar desde la consulta, no desde que la recibe la app.
type Edicion = Release & { consultadaEn: string };

// Los términos de uso de la API de Discogs no permiten mostrar datos con más de 6 horas de antigüedad.
export const VIGENCIA_MS = 6 * 60 * 60 * 1000;

// Lo que trae prisma.edicion con sus temas y plantas, en orden.
const CON_DETALLE = {
  temas: { orderBy: { orden: "asc" } },
  plantas: { orderBy: { orden: "asc" } },
} as const;

// Guarda la edición en la réplica: la fila de Edicion, sus temas y sus plantas.
// Si ya estaba, reemplaza todo: deleteMany borra los temas y plantas viejos antes de crear los nuevos,
// así no quedan sobrantes si Discogs cambió el tracklist. Prisma lo hace en una sola transacción.
export async function guardarEdicion(r: Release, consultadaEn: Date) {
  const datos = {
    title: r.title,
    artist: r.artist,
    year: r.year,
    country: r.country,
    label: r.label,
    format: r.format,
    genre: r.genre,
    barcode: r.barcode,
    discogsRating: r.discogsRating,
    coverUrl: r.coverUrl,
    consultadaEn,
  };
  // "duration" no existe en los temas sin duración: en la base queda null.
  const temas = r.tracklist.map((t, orden) => ({
    orden,
    position: t.position,
    title: t.title,
    duration: "duration" in t ? t.duration : null,
  }));
  const plantas = r.pressedBy.map((nombre, orden) => ({ orden, nombre }));
  await prisma.edicion.upsert({
    where: { id: r.discogsId },
    create: { id: r.discogsId, ...datos, temas: { create: temas }, plantas: { create: plantas } },
    update: {
      ...datos,
      temas: { deleteMany: {}, create: temas },
      plantas: { deleteMany: {}, create: plantas },
    },
  });
}

type EdicionGuardada = NonNullable<Awaited<ReturnType<typeof leerFila>>>;

function leerFila(id: number) {
  return prisma.edicion.findUnique({ where: { id }, include: CON_DETALLE });
}

// De la fila de la base a la forma que usa la app. Mismas claves y en el mismo orden que getRelease,
// así la app recibe exactamente lo mismo venga de Discogs o de la réplica.
function paraApp(e: EdicionGuardada): Edicion {
  return {
    id: String(e.id),
    discogsId: e.id,
    title: e.title,
    artist: e.artist,
    year: e.year,
    country: e.country,
    pressedBy: e.plantas.map((p) => p.nombre),
    label: e.label,
    format: e.format,
    genre: e.genre,
    barcode: e.barcode,
    discogsRating: e.discogsRating,
    coverUrl: e.coverUrl,
    // Igual que getRelease: un tema sin duración no lleva la clave "duration".
    tracklist: e.temas.map((t) =>
      t.duration !== null
        ? { position: t.position, title: t.title, duration: t.duration }
        : { position: t.position, title: t.title },
    ),
    consultadaEn: e.consultadaEn.toISOString(),
  };
}

// La edición desde la réplica si se consultó hace menos de 6 horas. null si no está o ya venció.
export async function leerVigente(id: number): Promise<Edicion | null> {
  const guardada = await leerFila(id);
  if (!guardada) return null;
  const antiguedad = Date.now() - guardada.consultadaEn.getTime();
  if (antiguedad >= VIGENCIA_MS) return null;
  console.log(`Edición ${id} desde la base (consultada hace ${Math.round(antiguedad / 60000)} min)`);
  return paraApp(guardada);
}

// La edición desde la réplica si está vigente; si no, desde Discogs, y se guarda.
// La réplica es best-effort: si la base falla, se sigue directo contra Discogs.
export async function edicionConCache(id: number): Promise<Edicion> {
  try {
    const vigente = await leerVigente(id);
    if (vigente) return vigente;
  } catch (e) {
    console.error(`No se pudo leer la edición ${id} de la base:`, e);
  }

  // Si Discogs falla, el error sube a la ruta: no se muestra una copia vencida.
  const edicion = await getRelease(id);
  const consultadaEn = new Date();
  try {
    await guardarEdicion(edicion, consultadaEn);
  } catch (e) {
    console.error(`No se pudo guardar la edición ${id} en la base:`, e);
  }
  return { ...edicion, consultadaEn: consultadaEn.toISOString() };
}
