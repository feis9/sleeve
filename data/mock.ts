import { getCountry } from '@/data/countries';
import type { Credential, Release, Review, User } from '@/types';

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

const backInBlackTracks = [
  { position: 'A1', title: 'Hells Bells', duration: '5:09' },
  { position: 'A2', title: 'Shoot To Thrill', duration: '5:14' },
  { position: 'A3', title: 'What Do You Do For Money Honey', duration: '3:33' },
  { position: 'A4', title: 'Givin The Dog A Bone', duration: '3:30' },
  { position: 'A5', title: 'Let Me Put My Love Into You', duration: '4:12' },
  { position: 'B1', title: 'Back In Black', duration: '4:13' },
  { position: 'B2', title: 'You Shook Me All Night Long', duration: '3:28' },
  { position: 'B3', title: 'Have A Drink On Me', duration: '3:57' },
  { position: 'B4', title: 'Shake A Leg', duration: '4:03' },
  { position: 'B5', title: "Rock And Roll Ain't Noise Pollution", duration: '4:12' },
];

const jarOfFliesTracks = [
  { position: 'A1', title: 'Rotten Apple', duration: '6:56' },
  { position: 'A2', title: 'Nutshell', duration: '4:16' },
  { position: 'A3', title: 'I Stay Away', duration: '4:13' },
  { position: 'A4', title: 'No Excuses', duration: '4:15' },
  { position: 'B1', title: 'Whale & Wasp', duration: '2:35' },
  { position: 'B2', title: "Don't Follow", duration: '4:21' },
  { position: 'B3', title: 'Swing On This', duration: '4:01' },
];

const useYourIllusionIITracks = [
  { position: 'A1', title: 'Civil War', duration: '7:36' },
  { position: 'A2', title: '14 Years', duration: '4:17' },
  { position: 'A3', title: 'Yesterdays', duration: '3:13' },
  { position: 'A4', title: "Knockin' On Heaven's Door", duration: '5:36' },
  { position: 'B1', title: 'Get In The Ring', duration: '5:29' },
  { position: 'B2', title: 'Shotgun Blues', duration: '3:23' },
  { position: 'B3', title: 'Breakdown', duration: '6:58' },
  { position: 'C1', title: 'Pretty Tied Up', duration: '4:46' },
  { position: 'C2', title: 'Locomotive', duration: '8:42' },
  { position: 'C3', title: 'So Fine', duration: '4:09' },
  { position: 'D1', title: 'Estranged', duration: '9:20' },
  { position: 'D2', title: 'You Could Be Mine', duration: '5:48' },
  { position: 'D3', title: "Don't Cry (Alt. Lyrics)", duration: '4:42' },
  { position: 'D4', title: 'My World', duration: '1:22' },
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
  {
    // Discogs r15527003. Discogs no indica país; figura "Pressed By – MPO" (planta en Francia).
    id: 'r-sticky-fingers',
    title: 'Sticky Fingers',
    artist: 'The Rolling Stones',
    year: 2020,
    country: 'France',
    label: 'Rolling Stones Records',
    format: 'LP, Album, Reissue, 180g',
    genre: 'Rock',
    barcode: '0602508773143',
    coverColor: '#3E5C7A',
    discogsRating: 4.5,
    tracklist: [
      { position: 'A1', title: 'Brown Sugar', duration: '3:49' },
      { position: 'A2', title: 'Sway', duration: '3:51' },
      { position: 'A3', title: 'Wild Horses', duration: '5:42' },
      { position: 'A4', title: "Can't You Hear Me Knocking", duration: '7:14' },
      { position: 'A5', title: 'You Gotta Move', duration: '2:32' },
      { position: 'B1', title: 'Bitch', duration: '3:36' },
      { position: 'B2', title: 'I Got The Blues', duration: '3:52' },
      { position: 'B3', title: 'Sister Morphine', duration: '5:31' },
      { position: 'B4', title: 'Dead Flowers', duration: '4:03' },
      { position: 'B5', title: 'Moonlight Mile', duration: '5:56' },
    ],
  },
  // Back In Black: el mismo código (696998020719) está en 6 ediciones en Discogs. Cargamos 3 de plantas
  // distintas para que el escáner muestre el panel "Elegí la que coincide con tu copia".
  {
    // Discogs r1517028. Pressed By: United Record Pressing (EE. UU.).
    id: 'r-bib-2003-us',
    title: 'Back In Black',
    artist: 'AC/DC',
    year: 2003,
    country: 'US',
    label: 'Columbia',
    format: 'LP, Album, Reissue, 180g',
    genre: 'Rock',
    barcode: '696998020719',
    coverColor: '#1C1C1C',
    discogsRating: 4.6,
    tracklist: backInBlackTracks,
  },
  {
    // Discogs r8487517. País en Discogs: US; Pressed By: MPO.
    id: 'r-bib-2015-mpo',
    title: 'Back In Black',
    artist: 'AC/DC',
    year: 2015,
    country: 'US',
    label: 'Columbia',
    format: 'LP, Album, Reissue, 180g (MPO)',
    genre: 'Rock',
    barcode: '696998020719',
    coverColor: '#262626',
    discogsRating: 4.6,
    tracklist: backInBlackTracks,
  },
  {
    // Discogs r35395852. Discogs no indica país; Pressed By: Vantiva, Guadalajara (México).
    id: 'r-bib-2023-mx',
    title: 'Back In Black',
    artist: 'AC/DC',
    year: 2023,
    country: 'Mexico',
    label: 'Columbia',
    format: 'LP, Album, Reissue',
    genre: 'Rock',
    barcode: '696998020719',
    coverColor: '#303030',
    discogsRating: 4.4,
    tracklist: backInBlackTracks,
  },
  {
    // Discogs r4345204. Reedición europea de WaxTime (no es la edición de Blue Note).
    id: 'r-moanin-2012-eu',
    title: "Moanin'",
    artist: 'Art Blakey & The Jazz Messengers',
    year: 2012,
    country: 'Europe',
    label: 'WaxTime',
    format: 'LP, Album, Reissue, 180g',
    genre: 'Jazz',
    barcode: '8436542011112',
    coverColor: '#2E4A62',
    discogsRating: 4.6,
    tracklist: [
      { position: 'A1', title: "Moanin'", duration: '9:34' },
      { position: 'A2', title: 'Are You Real', duration: '4:50' },
      { position: 'A3', title: 'Along Came Betty', duration: '6:11' },
      { position: 'B1', title: 'The Drum Thunder Suite', duration: '7:35' },
      { position: 'B2', title: 'Blues March', duration: '6:17' },
      { position: 'B3', title: 'Come Rain Or Come Shine', duration: '5:47' },
    ],
  },
  // Jar Of Flies: el código 196588003714 está en 2 ediciones (EE. UU. y la internacional).
  {
    // Discogs r30106898. Pressed By: United Record Pressing (EE. UU.).
    id: 'r-jof-2024-us',
    title: 'Jar Of Flies',
    artist: 'Alice In Chains',
    year: 2024,
    country: 'US',
    label: 'Columbia',
    format: 'LP, EP, Reissue',
    genre: 'Rock',
    barcode: '196588003714',
    coverColor: '#7A5C2A',
    discogsRating: 4.7,
    tracklist: jarOfFliesTracks,
  },
  {
    // Discogs r30170624. País en Discogs: "Worldwide" (no ubicable en el mapa);
    // Pressed By: Schallplattenfabrik Pallas (Alemania), así que usamos Germany.
    id: 'r-jof-2024-de',
    title: 'Jar Of Flies',
    artist: 'Alice In Chains',
    year: 2024,
    country: 'Germany',
    label: 'Columbia',
    format: 'LP, EP, Reissue',
    genre: 'Rock',
    barcode: '196588003714',
    coverColor: '#6B5226',
    discogsRating: 4.8,
    tracklist: jarOfFliesTracks,
  },
  {
    // Discogs r25128898. Prensado por Optimal Media (Alemania).
    id: 'r-uyi2-2022-eu',
    title: 'Use Your Illusion II',
    artist: "Guns N' Roses",
    year: 2022,
    country: 'Europe',
    label: 'Geffen Records',
    format: '2xLP, Album, Reissue, Remastered, 180g',
    genre: 'Rock',
    barcode: '602445117314',
    coverColor: '#2F3E8C',
    discogsRating: 4.72,
    tracklist: useYourIllusionIITracks,
  },
  {
    // Discogs r25146217. Mismo código de barras que la edición europea.
    id: 'r-uyi2-2022-us',
    title: 'Use Your Illusion II',
    artist: "Guns N' Roses",
    year: 2022,
    country: 'US',
    label: 'Geffen Records',
    format: '2xLP, Album, Reissue, Remastered, 180g',
    genre: 'Rock',
    barcode: '602445117314',
    coverColor: '#3A4A99',
    discogsRating: 4.66,
    tracklist: useYourIllusionIITracks,
  },
  {
    // Discogs r6546645. Discogs no publica las duraciones de este prensado.
    id: 'r-miseducation-2014-us',
    title: 'The Miseducation Of Lauryn Hill',
    artist: 'Lauryn Hill',
    year: 2014,
    country: 'US',
    label: 'Ruffhouse Records / Columbia',
    format: '2xLP, Album, Reissue',
    genre: 'Hip Hop',
    barcode: '888750215710',
    coverColor: '#7A5A3A',
    discogsRating: 4.75,
    tracklist: [
      { position: 'A1', title: 'Intro' },
      { position: 'A2', title: 'Lost Ones' },
      { position: 'A3', title: 'Ex-Factor' },
      { position: 'A4', title: 'To Zion' },
      { position: 'A5', title: 'Doo Wop (That Thing)' },
      { position: 'B1', title: 'Superstar' },
      { position: 'B2', title: 'Final Hour' },
      { position: 'B3', title: 'When It Hurts So Bad' },
      { position: 'B4', title: 'I Used To Love Him' },
      { position: 'C1', title: 'Forgive Them Father' },
      { position: 'C2', title: 'Every Ghetto, Every City' },
      { position: 'C3', title: 'Nothing Even Matters' },
      { position: 'D1', title: 'Everything Is Everything' },
      { position: 'D2', title: 'The Miseducation Of Lauryn Hill' },
      { position: 'D3', title: "Can't Take My Eyes Off Of You" },
      { position: 'D4', title: 'Tell Him' },
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

// Credenciales de prueba para el login local (Sprint 1, sin backend).
// Van en texto plano solo porque son datos simulados; con backend esto se valida en el servidor.
export const credentials: Credential[] = [
  { userId: ME_ID, email: 'luca@sleeve.app', password: 'vinilo123' },
  { userId: 'u-mica', email: 'mica@sleeve.app', password: 'vinilo123' },
  { userId: 'u-tomas', email: 'tomas@sleeve.app', password: 'vinilo123' },
  { userId: 'u-sofi', email: 'sofi@sleeve.app', password: 'vinilo123' },
  { userId: 'u-juan', email: 'juan@sleeve.app', password: 'vinilo123' },
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
  return getCountry(country)?.flag ?? '🏳️';
}