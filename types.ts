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
export type Credential = {
  userId: string;
  email: string;
  password: string;
};
