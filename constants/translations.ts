// Textos de la app en castellano e inglés. Mismo patrón que el ejemplo Context-Local de clase:
// un objeto por idioma y t(language) para elegir. Las claves que dependen de un número o de un dato
// son funciones (plurales y parámetros).
import type { Language } from '@/context/settings';

const ES = {
  tabs: { home: 'Inicio', search: 'Buscar', collection: 'Colección', profile: 'Perfil' },
  settingsTitle: 'Ajustes',

  home: {
    scanTitle: 'Escaneá un disco',
    scanSubtitle: 'Identificá el prensado exacto con el código de barras',
    recent: 'Agregados recientemente',
    topCollectors: 'Top coleccionistas',
    seeMyProfile: 'Ver mi perfil',
  },

  search: {
    title: 'Buscar',
    filters: { todo: 'Todo', artista: 'Artista', album: 'Álbum', sello: 'Sello', codigo: 'Código' },
    placeholder: 'Artista, álbum o sello',
    placeholderCode: 'Código de barras (12 o 13 dígitos)',
    noCodeResults: 'No encontramos ediciones con ese código.',
    noResults: (q: string) => `Sin resultados para “${q}”.`,
    emptyHint: 'Buscá por artista, álbum o sello. Si tenés el disco en la mano, escanealo.',
    scanButton: 'Escanear código',
  },

  collection: {
    title: 'Mi colección',
    count: (n: number) => `${n} ${n === 1 ? 'disco' : 'discos'}`,
    allGenres: 'Todos',
    empty: 'Tu colección está vacía. Escaneá tu primer disco.',
    scanButton: 'Escanear',
  },

  scanner: {
    checkingPermission: 'Consultando permiso de la cámara…',
    permissionTitle: 'Necesitamos la cámara',
    permissionText: 'Sleeve lee el código de barras de la funda para identificar la edición exacta de tu disco.',
    grantPermission: 'Dar permiso',
    openSettings: 'Abrir ajustes',
    searchManually: 'Buscar manualmente',
    aimHint: 'Apuntá al código de barras del disco',
    found: (n: number) => `Encontramos ${n} ${n === 1 ? 'edición' : 'ediciones'}`,
    pickYours: 'Elegí la que coincide con tu copia',
    notFound: 'No encontramos esta edición',
    codeRead: (code: string) => `Código leído: ${code}`,
    scanAnother: 'Escanear otro',
  },

  release: {
    notFound: 'No encontramos este disco.',
    community: 'comunidad',
    reviewsCount: (n: number) => `${n} ${n === 1 ? 'reseña' : 'reseñas'}`,
    inCollection: 'En tu colección',
    addToCollection: 'Agregar a mi colección',
    locating: 'Registrando dónde lo encontraste…',
    foundAt: (place: string, date: string) => `Encontrado en ${place} · ${date}`,
    findWarnings: {
      denied: 'Lo agregamos sin ubicación porque no diste permiso.',
      'services-off': 'Lo agregamos sin ubicación: la ubicación del teléfono está apagada.',
      error: 'Lo agregamos sin ubicación: no pudimos leer el GPS.',
    },
    openSettings: 'Abrir ajustes',
    countrySection: 'País de la edición',
    tracklist: 'Tracklist',
    reviews: 'Reseñas',
    writeReview: 'Escribir reseña',
    editReview: 'Editar mi reseña',
    noReviews: 'Nadie reseñó este prensado todavía.',
  },

  map: {
    unknownTitle: 'Origen no disponible',
    unknownText: 'No sabemos de qué país es esta edición.',
  },

  profile: {
    notFound: 'No encontramos este usuario.',
    records: 'Discos',
    reviews: 'Reseñas',
    ranking: 'Ranking',
    collectionTab: 'Colección',
    reviewsTab: 'Reseñas',
    noRecords: 'Todavía no hay discos.',
    noReviews: 'Todavía no hay reseñas.',
    you: 'Vos',
    recordsCount: (n: number) => `${n} ${n === 1 ? 'disco' : 'discos'}`,
  },

  settings: {
    language: 'Idioma',
    languageHelp: 'El idioma de toda la app.',
    theme: 'Tema',
    themeHelp: '“Sistema” sigue el modo claro u oscuro del teléfono.',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    account: 'Cuenta',
    loggedInAs: (username: string) => `Sesión iniciada como @${username}`,
    logout: 'Cerrar sesión',
  },

  login: {
    tagline: 'Tu colección de vinilos, edición por edición.',
    identifier: 'Email o usuario',
    identifierPlaceholder: 'luca@sleeve.app o lucaf',
    password: 'Contraseña',
    passwordPlaceholder: 'Tu contraseña',
    submit: 'Ingresar',
    failedTitle: 'No pudimos ingresar',
    failedText: 'El usuario o la contraseña no son correctos.',
    demo: 'Cuenta de prueba: lucaf · vinilo123',
  },

  reviewForm: {
    title: 'Tu reseña',
    stars: (n: number) => `${n} ${n === 1 ? 'estrella' : 'estrellas'}`,
    placeholder: '¿Cómo suena tu copia? Prensado, ruido de superficie, edición…',
    publish: 'Publicar',
    cancel: 'Cancelar',
  },

  validation: {
    identifierRequired: 'Ingresá tu email o tu usuario.',
    emailInvalid: 'El email no tiene un formato válido (ej.: nombre@dominio.com).',
    usernameInvalid: 'El usuario lleva de 3 a 30 caracteres: letras, números, punto o guion bajo.',
    passwordRequired: 'Ingresá tu contraseña.',
    passwordShort: (min: number) => `La contraseña tiene al menos ${min} caracteres.`,
    barcodeRequired: 'Ingresá el código de barras.',
    barcodeDigitsOnly: 'El código lleva solo números.',
    barcodeTooShort: (n: number) =>
      `Tiene ${n} dígitos y lleva 12 o 13. Revisá el primero y el último: suelen estar impresos más chicos, a los costados de las barras.`,
    barcodeTooLong: (n: number) => `Tiene ${n} dígitos y lleva 12 (UPC-A) o 13 (EAN-13).`,
    barcodeCheckDigit: 'El último dígito no coincide con el resto: revisá que esté bien copiado.',
    ratingRequired: 'Elegí de 1 a 5 estrellas.',
    reviewShort: (min: number, current: number) => `Escribí al menos ${min} caracteres (llevás ${current}).`,
    reviewLong: (max: number) => `Máximo ${max} caracteres.`,
  },
};

export type Texts = typeof ES;

const EN: Texts = {
  tabs: { home: 'Home', search: 'Search', collection: 'Collection', profile: 'Profile' },
  settingsTitle: 'Settings',

  home: {
    scanTitle: 'Scan a record',
    scanSubtitle: 'Identify the exact pressing from its barcode',
    recent: 'Recently added',
    topCollectors: 'Top collectors',
    seeMyProfile: 'See my profile',
  },

  search: {
    title: 'Search',
    filters: { todo: 'All', artista: 'Artist', album: 'Album', sello: 'Label', codigo: 'Barcode' },
    placeholder: 'Artist, album or label',
    placeholderCode: 'Barcode (12 or 13 digits)',
    noCodeResults: 'No releases found with that barcode.',
    noResults: (q) => `No results for “${q}”.`,
    emptyHint: 'Search by artist, album or label. If you have the record at hand, scan it.',
    scanButton: 'Scan barcode',
  },

  collection: {
    title: 'My collection',
    count: (n) => `${n} ${n === 1 ? 'record' : 'records'}`,
    allGenres: 'All',
    empty: 'Your collection is empty. Scan your first record.',
    scanButton: 'Scan',
  },

  scanner: {
    checkingPermission: 'Checking camera permission…',
    permissionTitle: 'We need the camera',
    permissionText: 'Sleeve reads the barcode on the sleeve to identify the exact release of your record.',
    grantPermission: 'Grant permission',
    openSettings: 'Open settings',
    searchManually: 'Search manually',
    aimHint: 'Point at the barcode on the record',
    found: (n) => `We found ${n} ${n === 1 ? 'release' : 'releases'}`,
    pickYours: 'Pick the one that matches your copy',
    notFound: "We couldn't find this release",
    codeRead: (code) => `Barcode read: ${code}`,
    scanAnother: 'Scan another',
  },

  release: {
    notFound: "We couldn't find this record.",
    community: 'community',
    reviewsCount: (n) => `${n} ${n === 1 ? 'review' : 'reviews'}`,
    inCollection: 'In your collection',
    addToCollection: 'Add to my collection',
    locating: 'Saving where you found it…',
    foundAt: (place, date) => `Found in ${place} · ${date}`,
    findWarnings: {
      denied: "Added without location because permission wasn't granted.",
      'services-off': "Added without location: the phone's location is turned off.",
      error: "Added without location: we couldn't read the GPS.",
    },
    openSettings: 'Open settings',
    countrySection: 'Country of release',
    tracklist: 'Tracklist',
    reviews: 'Reviews',
    writeReview: 'Write a review',
    editReview: 'Edit my review',
    noReviews: 'Nobody has reviewed this pressing yet.',
  },

  map: {
    unknownTitle: 'Origin unavailable',
    unknownText: "We don't know which country this release is from.",
  },

  profile: {
    notFound: "We couldn't find this user.",
    records: 'Records',
    reviews: 'Reviews',
    ranking: 'Ranking',
    collectionTab: 'Collection',
    reviewsTab: 'Reviews',
    noRecords: 'No records yet.',
    noReviews: 'No reviews yet.',
    you: 'You',
    recordsCount: (n) => `${n} ${n === 1 ? 'record' : 'records'}`,
  },

  settings: {
    language: 'Language',
    languageHelp: 'The language of the whole app.',
    theme: 'Theme',
    themeHelp: '“System” follows the phone’s light or dark mode.',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    account: 'Account',
    loggedInAs: (username) => `Signed in as @${username}`,
    logout: 'Sign out',
  },

  login: {
    tagline: 'Your vinyl collection, release by release.',
    identifier: 'Email or username',
    identifierPlaceholder: 'luca@sleeve.app or lucaf',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    submit: 'Sign in',
    failedTitle: "We couldn't sign you in",
    failedText: 'The username or password is incorrect.',
    demo: 'Test account: lucaf · vinilo123',
  },

  reviewForm: {
    title: 'Your review',
    stars: (n) => `${n} ${n === 1 ? 'star' : 'stars'}`,
    placeholder: 'How does your copy sound? Pressing, surface noise, edition…',
    publish: 'Publish',
    cancel: 'Cancel',
  },

  validation: {
    identifierRequired: 'Enter your email or username.',
    emailInvalid: "The email format isn't valid (e.g. name@domain.com).",
    usernameInvalid: 'Usernames are 3 to 30 characters: letters, numbers, dot or underscore.',
    passwordRequired: 'Enter your password.',
    passwordShort: (min) => `Passwords are at least ${min} characters long.`,
    barcodeRequired: 'Enter the barcode.',
    barcodeDigitsOnly: 'Barcodes only contain numbers.',
    barcodeTooShort: (n) =>
      `It has ${n} digits and needs 12 or 13. Check the first and last ones: they are usually printed smaller, beside the bars.`,
    barcodeTooLong: (n) => `It has ${n} digits and needs 12 (UPC-A) or 13 (EAN-13).`,
    barcodeCheckDigit: "The last digit doesn't match the rest: check it was copied correctly.",
    ratingRequired: 'Pick 1 to 5 stars.',
    reviewShort: (min, current) => `Write at least ${min} characters (you have ${current}).`,
    reviewLong: (max) => `${max} characters maximum.`,
  },
};

const translations: Record<Language, Texts> = { ES, EN };

export function t(language: Language): Texts {
  return translations[language];
}
