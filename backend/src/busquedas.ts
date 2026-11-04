// Búsquedas por código de barras con réplica en la base. Discogs se consulta una vez por código cada 6 horas.

import { normalizeBarcode, searchByBarcode } from "./discogs";
import { VIGENCIA_MS, edicionConCache } from "./ediciones";
import { prisma } from "./prisma";

// Los números de release de las ediciones en vinilo con ese código, en el orden de Discogs.
// Si se buscó hace menos de 6 horas, salen de la base; si no, se le pregunta a Discogs y se guarda.
async function idsPorCodigo(codigo: string): Promise<number[]> {
  // La clave es el código normalizado: escanear con o sin el 0 adelante cae en la misma fila.
  const clave = normalizeBarcode(codigo);
  try {
    const guardada = await prisma.busquedaCodigo.findUnique({
      where: { codigo: clave },
      include: { resultados: { orderBy: { orden: "asc" } } },
    });
    if (guardada) {
      const antiguedad = Date.now() - guardada.consultadaEn.getTime();
      if (antiguedad < VIGENCIA_MS) {
        console.log(`Búsqueda ${clave} desde la base (consultada hace ${Math.round(antiguedad / 60000)} min)`);
        return guardada.resultados.map((r) => r.edicionId);
      }
    }
  } catch (e) {
    console.error(`No se pudo leer la búsqueda ${clave} de la base:`, e);
  }

  // Si Discogs falla, el error sube a la ruta.
  const ids = (await searchByBarcode(codigo)).map((r) => r.id);
  const resultados = ids.map((edicionId, orden) => ({ orden, edicionId }));
  const consultadaEn = new Date();
  try {
    // Mismo patrón que guardarEdicion: si ya estaba (vencida), se reemplazan sus resultados en una transacción.
    await prisma.busquedaCodigo.upsert({
      where: { codigo: clave },
      create: { codigo: clave, consultadaEn, resultados: { create: resultados } },
      update: { consultadaEn, resultados: { deleteMany: {}, create: resultados } },
    });
  } catch (e) {
    console.error(`No se pudo guardar la búsqueda ${clave} en la base:`, e);
  }
  return ids;
}

// Las ediciones completas (con tapa, país y tracklist) que tienen ese código, en una sola respuesta.
// Antes la app hacía dos idas y vueltas: buscaba el código y después pedía el detalle de cada edición.
// Cada detalle sale de la réplica si está vigente. Si falla el detalle de alguna, se devuelven las demás;
// si fallan todas, se tira el error de la primera para que la ruta responda 502 (o 500 si falta el token).
export async function edicionesPorCodigo(codigo: string) {
  const ids = await idsPorCodigo(codigo);
  const resultados = await Promise.allSettled(ids.map((id) => edicionConCache(id)));
  const ediciones = resultados.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const primerError = resultados.find((r) => r.status === "rejected");
  if (ediciones.length === 0 && primerError) throw primerError.reason;
  return ediciones;
}
