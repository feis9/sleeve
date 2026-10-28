export type Track = {
  position: string;
  title: string;
  duration?: string;
};

// Una edición, tal como la devuelve el backend (GET /api/discogs/releases/:id).
// Lo que Discogs puede no tener llega como null.
export type Release = {
  // Número de release de Discogs como texto (las rutas de Expo Router usan texto).
  id: string;
  discogsId: number;
  title: string;
  artist: string;
  year: number | null;
  country: string | null;
  label: string | null;
  format: string | null;
  genre: string | null;
  barcode: string | null;
  discogsRating: number | null;
  // Tapa original de Discogs. Si es null, la app dibuja el placeholder.
  coverUrl: string | null;
  tracklist: Track[];
};

export type User = {
  id: string;
  username: string;
  name: string;
  avatarColor: string;
  collection: string[];
};

export type Review = {
  id: string;
  userId: string;
  releaseId: string;
  rating: number;
  body: string;
  createdAt: string;
};
// Dónde y cuándo agregaste un disco a tu colección (GPS del teléfono).
export type Find = {
  latitude: number;
  longitude: number;
  // "San Telmo, Buenos Aires". null si no se pudo traducir la coordenada a un lugar.
  place: string | null;
  // ISO 8601
  date: string;
};

export type Credential = {
  userId: string;
  email: string;
  password: string;
};
