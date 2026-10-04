import type { Release, Review, User } from '@/types';

// Datos de ejemplo hasta que exista la API (Express + Prisma).
export const ME_ID = 'u-luca';
export const DEMO_BARCODE = '5099902894119';

const dsotmTracks = [
  { position: 'A1', title: 'Speak To Me', duration: '1:30' },
  { position: 'A2', title: 'Breathe', duration: '2:43' },
  { position: 'A3', title: 'On The Run', duration: '3:30' },
  { position: 'A4', title: 'Time', duration: '6:53' },
  { position: 'A5', title: 'The Great Gig In The Sky', duration: '4:15' },
  { position: 'B1', title: 'Money', duration: '6:30' },
  { position: 'B2', title: 'Us And Them', duration: '7:40' },
  { position: 'B3', title: 'Any Colour You Like', duration: '3:25' },
  { position: 'B4', title: 'Brain Damage', duration: '3:50' },
  { position: 'B5', title: 'Eclipse', duration: '2:04' },
];

export const releases: Release[] = [
  {
    id: 'r-dsotm-eu',
    title: 'The Dark Side Of The Moon',
    artist: 'Pink Floyd',
    year: 2016,
    country: 'Europe',
    label: 'Pink Floyd Records',
    format: 'LP, Reissue',
    genre: 'Rock',
    barcode: DEMO_BARCODE,
    coverColor: '#1B1B2F',
    discogsRating: 4.7,
    tracklist: dsotmTracks,
  },
  {
    id: 'r-dsotm-us',
    title: 'The Dark Side Of The Moon',
    artist: 'Pink Floyd',
    year: 2016,
    country: 'US',
    label: 'Pink Floyd Records',
    format: 'LP, Reissue',
    genre: 'Rock',
    barcode: DEMO_BARCODE,
    coverColor: '#2B2D42',
    discogsRating: 4.6,
    tracklist: dsotmTracks,
  },
  {
    id: 'r-abbey',
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: 1969,
    country: 'UK',
    label: 'Apple Records',
    format: 'LP, Album',
    genre: 'Rock',
    coverColor: '#3A6B35',
    discogsRating: 4.8,
    tracklist: [
      { position: 'A1', title: 'Come Together', duration: '4:20' },
      { position: 'A2', title: 'Something', duration: '3:03' },
      { position: 'A3', title: "Maxwell's Silver Hammer", duration: '3:27' },
      { position: 'A4', title: 'Oh! Darling', duration: '3:26' },
    ],
  },
  {
    id: 'r-kind-of-blue',
    title: 'Kind Of Blue',
    artist: 'Miles Davis',
    year: 1959,
    country: 'US',
    label: 'Columbia',
    format: 'LP, Album, Mono',
    genre: 'Jazz',
    coverColor: '#1F4E79',
    discogsRating: 4.8,
    tracklist: [
      { position: 'A1', title: 'So What', duration: '9:22' },
      { position: 'A2', title: 'Freddie Freeloader', duration: '9:46' },
      { position: 'A3', title: 'Blue In Green', duration: '5:37' },
      { position: 'B1', title: 'All Blues', duration: '11:33' },
      { position: 'B2', title: 'Flamenco Sketches', duration: '9:26' },
    ],
  },
  {
    id: 'r-rumours',
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    year: 1977,
    country: 'US',
    label: 'Warner Bros. Records',
    format: 'LP, Album',
    genre: 'Rock',
    coverColor: '#8C6A4F',
    discogsRating: 4.6,
    tracklist: [
      { position: 'A1', title: 'Second Hand News', duration: '2:56' },
      { position: 'A2', title: 'Dreams', duration: '4:14' },
      { position: 'A3', title: 'Never Going Back Again', duration: '2:02' },
      { position: 'A4', title: "Don't Stop", duration: '3:11' },
      { position: 'A5', title: 'Go Your Own Way', duration: '3:38' },
    ],
  },
  {
    id: 'r-ram',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    year: 2013,
    country: 'Europe',
    label: 'Columbia',
    format: '2xLP, Album',
    genre: 'Electronic',
    coverColor: '#4A4A4A',
    discogsRating: 4.4,
    tracklist: [
      { position: 'A1', title: 'Give Life Back To Music', duration: '4:34' },
      { position: 'A2', title: 'The Game Of Love', duration: '5:21' },
      { position: 'A3', title: 'Giorgio By Moroder', duration: '9:04' },
      { position: 'D2', title: 'Get Lucky', duration: '6:09' },
    ],
  },
  {
    id: 'r-cancion-animal',
    title: 'Canción Animal',
    artist: 'Soda Stereo',
    year: 1990,
    country: 'Argentina',
    label: 'CBS',
    format: 'LP, Album',
    genre: 'Rock',
    coverColor: '#A23B2A',
    discogsRating: 4.7,
    tracklist: [
      { position: 'A1', title: '(En) El Séptimo Día' },
      { position: 'A2', title: 'Un Millón De Años Luz' },
      { position: 'A3', title: 'Té Para Tres' },
      { position: 'B1', title: 'De Música Ligera' },
    ],
  },
  {
    id: 'r-kid-a',
    title: 'Kid A',
    artist: 'Radiohead',
    year: 2000,
    country: 'UK',
    label: 'Parlophone',
    format: '2x10", Album',
    genre: 'Electronic',
    coverColor: '#6B7F99',
    discogsRating: 4.5,
    tracklist: [
      { position: 'A1', title: 'Everything In Its Right Place', duration: '4:11' },
      { position: 'A2', title: 'Kid A', duration: '4:44' },
      { position: 'B1', title: 'The National Anthem', duration: '5:51' },
      { position: 'B2', title: 'How To Disappear Completely', duration: '5:56' },
    ],
  },
];

export const users: User[] = [
  {
    id: ME_ID,
    username: 'lucaf',
    name: 'Luca Faccennini',
    avatarColor: '#E8A33D',
    collection: ['r-dsotm-eu', 'r-abbey', 'r-cancion-animal'],
  },
  {
    id: 'u-mica',
    username: 'mica.spins',
    name: 'Micaela Ruiz',
    avatarColor: '#C0587E',
    collection: ['r-abbey', 'r-rumours', 'r-kind-of-blue', 'r-ram', 'r-kid-a', 'r-cancion-animal'],
  },
  {
    id: 'u-tomas',
    username: 'tomas_crate',
    name: 'Tomás Vidal',
    avatarColor: '#4F8A8B',
    collection: ['r-dsotm-us', 'r-kind-of-blue', 'r-ram', 'r-kid-a', 'r-rumours'],
  },
  {
    id: 'u-sofi',
    username: 'sofi33rpm',
    name: 'Sofía Paz',
    avatarColor: '#7B6CF6',
    collection: ['r-cancion-animal', 'r-rumours', 'r-abbey', 'r-dsotm-eu'],
  },
  {
    id: 'u-juan',
    username: 'juanjazz',
    name: 'Juan Ortega',
    avatarColor: '#3E7CB1',
    collection: ['r-kind-of-blue', 'r-ram'],
  },
];

export const reviews: Review[] = [
  {
    id: 'rv-1',
    userId: 'u-mica',
    releaseId: 'r-abbey',
    rating: 5,
    body: 'El lado B es una obra maestra. Mi copia suena impecable.',
    createdAt: '2026-09-10',
  },
  {
    id: 'rv-2',
    userId: 'u-tomas',
    releaseId: 'r-kind-of-blue',
    rating: 5,
    body: 'El mono tiene una presencia que el estéreo no tiene.',
    createdAt: '2026-09-12',
  },
  {
    id: 'rv-3',
    userId: 'u-sofi',
    releaseId: 'r-dsotm-eu',
    rating: 4,
    body: 'Buen prensado, silencioso. Le falta un poco de graves.',
    createdAt: '2026-09-14',
  },
  {
    id: 'rv-4',
    userId: ME_ID,
    releaseId: 'r-cancion-animal',
    rating: 5,
    body: 'Clásico absoluto del rock argentino.',
    createdAt: '2026-09-18',
  },
  {
    id: 'rv-5',
    userId: 'u-juan',
    releaseId: 'r-ram',
    rating: 4,
    body: 'Producción enorme, en vinilo se disfruta el doble.',
    createdAt: '2026-09-19',
  },
];

const flags: Record<string, string> = {
  Argentina: '🇦🇷',
  UK: '🇬🇧',
  US: '🇺🇸',
  Europe: '🇪🇺',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
};

export function getRelease(id: string) {
  return releases.find((r) => r.id === id);
}

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export function reviewsFor(releaseId: string) {
  return reviews.filter((r) => r.releaseId === releaseId);
}

export function reviewsBy(userId: string) {
  return reviews.filter((r) => r.userId === userId);
}

// Deja solo dígitos y unifica UPC-A con EAN-13: iOS suele leer un UPC-A (12 dígitos)
// como EAN-13 con un 0 adelante, así que '0' + 12 dígitos y los 12 dígitos son el mismo código.
export function normalizeBarcode(code: string) {
  const digits = code.replace(/\D/g, '');
  return digits.length === 13 && digits.startsWith('0') ? digits.slice(1) : digits;
}

export function releasesByBarcode(barcode: string) {
  const code = normalizeBarcode(barcode);
  return releases.filter((r) => r.barcode !== undefined && normalizeBarcode(r.barcode) === code);
}

export function flagFor(country: string) {
  return flags[country] ?? '🏳️';
}