export type Track = {
  position: string;
  title: string;
  duration?: string;
};

export type Release = {
  id: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  label: string;
  format: string;
  genre: string;
  barcode?: string;
  coverColor: string;
  discogsRating: number;
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
