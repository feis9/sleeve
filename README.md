# Sleeve

Red social para coleccionistas de vinilos: escaneás el código de barras de un disco, identificás la edición exacta, registrás dónde lo encontraste y compartís reseñas de ese prensado con otros coleccionistas.

Proyecto de la materia **Programación de Aplicaciones Móviles** (GCO0423), Facultad de Ingeniería y Ciencias Agrarias, UCA. Sprint 1: front-end. Sprint 2: backend propio y conexión a Discogs. Después de la devolución del Sprint 2: contraseñas con hash, token de sesión y réplica de Discogs en la base.

## Mockup

Prototipo interactivo navegable, con las mismas pantallas, datos y paleta de la app: https://claude.ai/artifact/Xow9zKfk1fsyjavm31WGfc

## Funcionalidades

- **Escaneo real del código de barras** con la cámara (EAN-13, UPC-A, EAN-8 y UPC-E). La app busca el código en Discogs y muestra todas las ediciones en vinilo que lo tienen, para elegir la propia. Sirve para cualquier vinilo cargado en Discogs.
- **Datos y tapas originales de Discogs**: título, artista, país, sello, formato, tracklist, puntaje de la comunidad y la tapa de cada edición.
- **Registro del hallazgo con GPS**: al agregar un disco se guarda dónde y cuándo lo encontraste ("Encontrado en San Telmo, CABA").
- **Mapa por edición**: el detalle de cada disco muestra el país de esa edición.
- **Colección personal** guardada en el backend, con una copia en el teléfono para verla sin conexión.
- **Reseñas por prensado**, de 1 a 5 estrellas, compartidas entre teléfonos. En el perfil, cada disco aparece con su reseña.
- **Ranking** de coleccionistas y perfiles públicos.
- **Login y registro** contra el backend, con email o usuario y contraseña. Las contraseñas se guardan con hash y cada sesión tiene su token, que la app manda en cada pedido. La sesión queda guardada en el dispositivo.
- **Búsqueda** por artista, álbum o sello entre los discos que ya están en el teléfono, y por código de barras en Discogs.
- **Validaciones** en el login, el registro, la carga manual de códigos (incluye el dígito verificador) y las reseñas. El backend vuelve a validar todo lo que recibe: login, registro, reseñas, hallazgos, códigos e ids.
- **Idioma** castellano / inglés y **tema** claro / oscuro / según el sistema, desde Ajustes.

## Componentes nativos

| Componente | Librería | Uso en la app |
| --- | --- | --- |
| Cámara | `expo-camera` | Lectura del código de barras de la funda para identificar la edición. |
| GPS / geolocalización | `expo-location` | Registro de dónde se encontró cada disco al agregarlo a la colección. |

## Tecnologías

- **App**: Expo SDK 58 · React Native · TypeScript · Expo Router · React Context · AsyncStorage · react-native-maps.
- **Backend** (`backend/`): Node.js · Express · Prisma 6 · SQLite · TypeScript.
- **Datos de los discos**: [API de Discogs](https://www.discogs.com/developers), consultada desde el backend.

## Arquitectura

```
App (Expo Go)  ──HTTP──>  Backend (Express)  ──HTTPS──>  API de Discogs
                              │
                              └── SQLite (Prisma): usuarios, sesiones, colecciones, hallazgos, reseñas
                                                   y réplica de Discogs (ediciones y búsquedas)
```

- La app nunca le habla a Discogs: el token de Discogs vive solo en `backend/.env`, que no está en el repo.
- El backend guarda una réplica de lo que ya le pidió a Discogs (ediciones con su tracklist y búsquedas por código) durante 6 horas, el máximo que permiten los términos de uso de Discogs. Así no pide dos veces lo mismo ni gasta el límite de 60 pedidos por minuto. La app pide el catálogo y cada escaneo en un solo pedido.
- Las rutas que escriben (reseñas y colección) están en `/api/yo/...` y toman el usuario del token de sesión, nunca de la URL.
- La app encuentra sola al backend: usa la IP de la PC donde corre Expo y el puerto 3000.

### Endpoints

Las rutas marcadas "con token" piden el header `Authorization: Bearer <token>`, con el token que devuelven el login y el registro.

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/api/health` | Prueba de vida: `{"ok":true}` |
| GET | `/api/discogs/barcode/:code` | Ediciones en vinilo con ese código de barras |
| GET | `/api/discogs/releases/:id` | Una edición de Discogs, con su tapa |
| GET | `/api/ediciones?codigo=` | Las ediciones en vinilo con ese código de barras, completas, en una sola respuesta. La búsqueda y cada edición salen de la réplica si tienen menos de 6 horas |
| GET | `/api/ediciones?ids=` | Varias ediciones por número de release (`?ids=1517028,15527003`, hasta 50), en ese orden y en una sola respuesta. Las que no existen se omiten |
| POST | `/api/login` | `{ identifier, password }`: usuario o email. 200 con `{ usuario, token }` o 401 |
| POST | `/api/registro` | `{ username, email, name, password }`. Guarda el hash de la contraseña, nunca la contraseña. 201 con `{ usuario, token }`, 400 o 409 |
| GET | `/api/yo` | Con token: el usuario dueño de la sesión. 401 sin token, con uno inválido o vencido |
| DELETE | `/api/sesion` | Con token: cierra esa sesión (204). Después el token ya no sirve |
| GET | `/api/resenas` | Reseñas con su autor. Filtros opcionales `?releaseId=` y `?usuarioId=` |
| PUT | `/api/yo/resenas/:releaseId` | Con token. `{ rating, body }`: crea o reemplaza tu reseña para esa edición |
| GET | `/api/usuarios/:id` | Perfil público (sin email ni contraseña) |
| GET | `/api/usuarios/:id/coleccion` | Discos de la colección, con dónde se encontró cada uno |
| PUT | `/api/yo/coleccion/:releaseId` | Con token. Agrega el disco a tu colección |
| PUT | `/api/yo/coleccion/:releaseId/hallazgo` | Con token. `{ latitude, longitude, place, date }`: dónde lo encontraste |
| DELETE | `/api/yo/coleccion/:releaseId` | Con token. Saca el disco de tu colección (204) |
| GET | `/api/ranking` | Usuarios ordenados por cantidad de discos |

## Cómo correrla

Requisitos: Node.js, la app **Expo Go** (SDK 58) en el teléfono y un token personal de Discogs (https://www.discogs.com/settings/developers → "Generate new token"). La cámara y el GPS necesitan un dispositivo físico.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env      # y completar DISCOGS_TOKEN
npm run db:init           # crea la base SQLite y carga las cuentas y colecciones de prueba
npm run dev
```

Para comprobarlo: `curl localhost:3000/api/health` tiene que responder `{"ok":true}`.

Si `dev.db` es de una versión anterior y el login de las cuentas de prueba da 401 (por ejemplo, porque las contraseñas pasaron a guardarse con hash), borrar `backend/prisma/dev.db` y volver a correr `npm run db:init`.

`npm audit` en `backend/` da 0 vulnerabilidades. `backend/package.json` fuerza `deepmerge-ts` 8 con `overrides`: Prisma 6 trae la 7, que tiene la falla CVE-2026-40345. Esa dependencia solo la usa la CLI de Prisma para leer `prisma.config.ts`, que el backend no tiene, y la versión 8 se probó con `prisma validate`, `generate` y `db push`. La alternativa que propone `npm audit fix --force` es pasar a Prisma 7, una versión mayor que cambia la configuración.

**2. App**, desde la raíz del repo (no desde `backend/`):

```bash
npm install
npx expo start
```

Escaneá el QR con Expo Go. El teléfono y la computadora tienen que estar en la misma red Wi-Fi, y el firewall de la computadora tiene que dejar entrar conexiones al puerto 3000. Si la app no carga los discos, abrí `http://<IP de la computadora>:3000/api/health` en el navegador del teléfono.

### Cuentas de prueba

Todas usan la contraseña `vinilo123`. También se puede crear una cuenta nueva desde "¿No tenés cuenta? Creá una".

| Usuario | Email |
| --- | --- |
| `lucaf` | luca@sleeve.app |
| `mica.spins` | mica@sleeve.app |
| `tomas_crate` | tomas@sleeve.app |
| `sofi33rpm` | sofi@sleeve.app |
| `juanjazz` | juan@sleeve.app |

### Códigos de barras para probar

Se puede escanear cualquier vinilo que esté en Discogs. Estos son los de los discos de la demo, y también se pueden ingresar a mano desde Buscar → Código:

| Disco | Código |
| --- | --- |
| The Rolling Stones · Sticky Fingers | `0602508773143` |
| AC/DC · Back In Black | `696998020719` |
| Art Blakey & The Jazz Messengers · Moanin' | `8436542011112` |
| Alice In Chains · Jar Of Flies | `196588003714` |
| Guns N' Roses · Use Your Illusion II | `602445117314` |
| Lauryn Hill · The Miseducation Of Lauryn Hill | `888750215710` |

## Estructura

```
app/            Pantallas y navegación (Expo Router): tabs, escáner, detalle, perfil, ajustes
components/     Componentes reutilizables (mapa, tarjetas, botones, login, registro, modal de reseña)
context/        Estado global: ajustes (idioma y tema), discos, sesión, colección y reseñas
constants/      Paleta de colores, espaciados y textos en castellano e inglés
data/           Discos de la demo (ids de Discogs) y tabla de países
utils/          Conexión con el backend, ubicación (GPS), validaciones y formato
backend/        Servidor Express: rutas, cliente de Discogs, usuarios, colecciones, reseñas y base SQLite con Prisma
```

## Limitaciones conocidas

- **Sin HTTPS.** Las contraseñas se guardan con hash (scrypt, con una sal al azar por cuenta) y las rutas que escriben piden un token de sesión, pero la contraseña y el token viajan sin cifrar por la red local. En producción iría HTTPS.
- **Token sin cifrar en el teléfono.** La app guarda el token en AsyncStorage. En producción iría en el almacenamiento seguro del sistema (Keychain en iOS, Keystore en Android).
- **Backend local.** La app solo funciona con el backend corriendo en una computadora de la misma red Wi-Fi.
- **Sin conexión, solo lectura.** Sin backend se ven la colección, las reseñas y el ranking guardados en el teléfono, pero no se pueden agregar discos ni escribir reseñas.
- **Búsqueda por texto solo en el teléfono.** Por artista, álbum o sello se busca entre los discos ya cargados, no en Discogs. Para identificar un disco se usa el código de barras, que da la edición exacta.

## Discogs

Los datos y las tapas de los discos vienen de Discogs.

El backend guarda una réplica de lo que ya consultó (ediciones con su tracklist y búsquedas por código) para no pedir dos veces lo mismo. Los términos de uso de Discogs no permiten mostrar datos con más de 6 horas, así que lo que pasa ese tiempo se vuelve a pedir y el backend lo borra cada 15 minutos.

This application uses Discogs’ API but is not affiliated with, sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink Media, LLC.

## Equipo

- Luca Faccennini
- Juan Cruz Gonzalez Montes
