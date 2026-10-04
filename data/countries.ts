// País de cada edición (el campo `country` de Discogs). Única fuente de verdad para banderas y mapa.
// Las coordenadas son el centro aproximado del país; `delta` es el zoom inicial del mapa (grados visibles).
export type Country = {
  latitude: number;
  longitude: number;
  delta: number;
  flag: string;
  nameEs: string;
  nameEn: string;
  // Discogs usa "Europe" para ediciones de toda la UE: no es un país, se muestra como región.
  isRegion?: boolean;
};

export const countries: Record<string, Country> = {
  Argentina: { latitude: -38.4, longitude: -63.6, delta: 32, flag: '🇦🇷', nameEs: 'Argentina', nameEn: 'Argentina' },
  UK: { latitude: 54.0, longitude: -2.5, delta: 12, flag: '🇬🇧', nameEs: 'Reino Unido', nameEn: 'United Kingdom' },
  US: { latitude: 39.8, longitude: -98.6, delta: 40, flag: '🇺🇸', nameEs: 'Estados Unidos', nameEn: 'United States' },
  Europe: {
    latitude: 50.0,
    longitude: 10.0,
    delta: 35,
    flag: '🇪🇺',
    nameEs: 'Edición europea',
    nameEn: 'European release',
    isRegion: true,
  },
  France: { latitude: 46.6, longitude: 2.4, delta: 12, flag: '🇫🇷', nameEs: 'Francia', nameEn: 'France' },
  Germany: { latitude: 51.2, longitude: 10.4, delta: 10, flag: '🇩🇪', nameEs: 'Alemania', nameEn: 'Germany' },
  Japan: { latitude: 36.2, longitude: 138.3, delta: 16, flag: '🇯🇵', nameEs: 'Japón', nameEn: 'Japan' },
};

export function getCountry(country: string): Country | undefined {
  return countries[country];
}
