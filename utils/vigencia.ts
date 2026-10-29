// Los términos de uso de la API de Discogs no permiten mostrar datos con más de 6 horas de antigüedad.
// El backend guarda cada edición como mucho ese tiempo (backend/src/ediciones.ts) y la app, que guarda
// copias para verlas sin conexión, descarta las que pasaron ese tiempo desde la consulta a Discogs.
export const VIGENCIA_MS = 6 * 60 * 60 * 1000;

// true si la edición se consultó a Discogs hace menos de 6 horas. Una copia sin fecha (guardada antes de
// este cambio) no se puede saber cuándo se consultó, así que no se muestra.
export function vigente(release: { consultadaEn?: string }, ahora = Date.now()): boolean {
  if (!release.consultadaEn) return false;
  const consultada = new Date(release.consultadaEn).getTime();
  return !Number.isNaN(consultada) && ahora - consultada < VIGENCIA_MS;
}
