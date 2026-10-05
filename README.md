# Sleeve

Red social para coleccionistas de vinilos: escaneás el código de barras de un disco, identificás la edición exacta, registrás dónde lo encontraste y compartís reseñas de ese prensado con otros coleccionistas.

Proyecto de la materia **Programación de Aplicaciones Móviles** (GCO0423), Facultad de Ingeniería y Ciencias Agrarias, UCA. Entrega: Sprint 1, front-end.

## Mockup

Prototipo interactivo navegable, con las mismas pantallas, datos y paleta de la app: https://claude.ai/artifact/Xow9zKfk1fsyjavm31WGfc

## Funcionalidades

- **Escaneo real del código de barras** con la cámara (EAN-13 y UPC-A). Si un código corresponde a varias ediciones, la app muestra todas para elegir la propia.
- **Registro del hallazgo con GPS**: al agregar un disco se guarda dónde y cuándo lo encontraste ("Encontrado en San Telmo, CABA").
- **Mapa por edición**: el detalle de cada disco muestra el país de esa edición.
- **Colección personal** guardada en el teléfono, separada por usuario.
- **Reseñas por prensado**, de 1 a 5 estrellas, y **ranking** de coleccionistas.
- **Login** con email o usuario y contraseña, con la sesión guardada en el dispositivo.
- **Validaciones** en el login, en la carga manual de códigos (incluye el dígito verificador) y en las reseñas.
- **Idioma** castellano / inglés y **tema** claro / oscuro / según el sistema, desde Ajustes.

## Componentes nativos

| Componente | Librería | Uso en la app |
| --- | --- | --- |
| Cámara | `expo-camera` | Lectura del código de barras de la funda para identificar la edición. |
| GPS / geolocalización | `expo-location` | Registro de dónde se encontró cada disco al agregarlo a la colección. |

## Tecnologías

Expo SDK 57 · React Native · TypeScript · Expo Router · React Context · AsyncStorage · react-native-maps.

En este sprint no hay backend: los discos, usuarios y reseñas de ejemplo están en `data/mock.ts`. En la versión final los datos de cada edición se obtendrán de la Discogs API.

## Cómo correrla

Requisitos: Node.js y la app **Expo Go** en el teléfono (la cámara y el GPS necesitan un dispositivo físico).

```bash
npm install
npx expo start
```

Escaneá el QR con Expo Go (el teléfono y la computadora tienen que estar en la misma red Wi-Fi).

### Cuentas de prueba

Todas usan la contraseña `vinilo123`:

| Usuario | Email |
| --- | --- |
| `lucaf` | luca@sleeve.app |
| `mica.spins` | mica@sleeve.app |
| `tomas_crate` | tomas@sleeve.app |
| `sofi33rpm` | sofi@sleeve.app |
| `juanjazz` | juan@sleeve.app |

### Códigos de barras para probar

También se pueden ingresar a mano desde Buscar → Código.

| Disco | Código | Ediciones |
| --- | --- | --- |
| The Rolling Stones · Sticky Fingers | `0602508773143` | 1 |
| AC/DC · Back In Black | `696998020719` | 3 |
| Art Blakey & The Jazz Messengers · Moanin' | `8436542011112` | 1 |
| Alice In Chains · Jar Of Flies | `196588003714` | 2 |
| Pink Floyd · The Dark Side Of The Moon | `5099902894119` | 2 |

## Estructura

```
app/            Pantallas y navegación (Expo Router): tabs, escáner, detalle, perfil, ajustes
components/     Componentes reutilizables (mapa, tarjetas, botones, login, modal de reseña)
context/        Estado global: ajustes (idioma y tema), sesión, colección y reseñas
constants/      Paleta de colores, espaciados y textos en castellano e inglés
data/           Datos de ejemplo y tabla de países
utils/          Ubicación (GPS) y validaciones
```

## Equipo

- Luca Faccennini
- Juan Cruz Gonzalez Montes
