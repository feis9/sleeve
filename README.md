# Sleeve

Red social para coleccionistas de vinilos: escaneás el código de barras de un disco, identificás la edición exacta, registrás dónde lo encontraste y compartís reseñas de ese prensado con otros coleccionistas.

Proyecto de la materia **Programación de Aplicaciones Móviles** (GCO0423), Facultad de Ingeniería y Ciencias Agrarias, UCA. Sprint 1: front-end. Sprint 2: backend propio y conexión a Discogs.

## Mockup

Prototipo interactivo navegable, con las mismas pantallas, datos y paleta de la app: https://claude.ai/artifact/Xow9zKfk1fsyjavm31WGfc

## Funcionalidades

- **Escaneo real del código de barras** con la cámara (EAN-13 y UPC-A). La app busca el código en Discogs y muestra todas las ediciones en vinilo que lo tienen, para elegir la propia. Sirve para cualquier vinilo cargado en Discogs.
- **Datos y tapas originales de Discogs**: título, artista, país, sello, formato, tracklist, puntaje de la comunidad y la tapa de cada edición.
- **Registro del hallazgo con GPS**: al agregar un disco se guarda dónde y cuándo lo encontraste ("Encontrado en San Telmo, CABA").
- **Mapa por edición**: el detalle de cada disco muestra el país de esa edición.
- **Colección personal** guardada en el teléfono, separada por usuario.
- **Reseñas por prensado**, de 1 a 5 estrellas, y **ranking** de coleccionistas.
- **Login y registro** contra el backend, con email o usuario y contraseña. La sesión queda guardada en el dispositivo.
- **Validaciones** en el login, el registro, la carga manual de códigos (incluye el dígito verificador) y las reseñas. El backend repite las del login y el registro.
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
                              └── SQLite (Prisma): usuarios y caché de ediciones
```

- La app nunca le habla a Discogs: el token de Discogs vive solo en `backend/.env`, que no está en el repo.
- El backend guarda cada edición consultada durante 6 horas (el máximo que permiten los términos de uso de Discogs), para no gastar el límite de 60 pedidos por minuto.
- La app encuentra sola al backend: usa la IP de la PC donde corre Expo y el puerto 3000.

### Endpoints

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/api/health` | Prueba de vida: `{"ok":true}` |
| GET | `/api/discogs/barcode/:code` | Ediciones en vinilo con ese código de barras |
| GET | `/api/discogs/releases/:id` | Una edición de Discogs, con su tapa |
| POST | `/api/login` | `{ identifier, password }`: usuario o email. 200 o 401 |
| POST | `/api/registro` | `{ username, email, name, password }`. 201, 400 o 409 |

## Cómo correrla

Requisitos: Node.js, la app **Expo Go** (SDK 58) en el teléfono y un token personal de Discogs (https://www.discogs.com/settings/developers → "Generate new token"). La cámara y el GPS necesitan un dispositivo físico.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env      # y completar DISCOGS_TOKEN
npm run db:init           # crea la base SQLite y carga las cuentas de prueba
npm run dev
```

Para comprobarlo: `curl localhost:3000/api/health` tiene que responder `{"ok":true}`.

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
data/           Discos de la demo (ids de Discogs), perfiles de prueba y tabla de países
utils/          Conexión con el backend, ubicación (GPS), validaciones y formato
backend/        Servidor Express: rutas, cliente de Discogs, usuarios y base SQLite con Prisma
```

## Limitaciones conocidas

- **Contraseñas en texto plano.** El login compara la contraseña de forma directa y no hay token de sesión: es una decisión de alcance del Sprint 2. En producción iría con hash (bcrypt o argon2), token de sesión y HTTPS.
- **Backend local.** La app solo funciona con el backend corriendo en una computadora de la misma red Wi-Fi.
- **Colección y reseñas en el teléfono.** Todavía no se guardan en el backend, así que no se comparten entre dispositivos.

## Discogs

Los datos y las tapas de los discos vienen de Discogs.

This application uses Discogs’ API but is not affiliated with, sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink Media, LLC.

## Equipo

- Luca Faccennini
- Juan Cruz Gonzalez Montes
