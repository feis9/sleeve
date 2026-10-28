// Une los datos que existen con " · ". Discogs puede no tener año, país o sello, y no queremos
// mostrar "null" ni separadores sueltos.
export function joinMeta(...partes: (string | number | null | undefined)[]) {
  return partes.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');
}
