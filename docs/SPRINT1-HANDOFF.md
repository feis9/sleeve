# Sleeve · Sprint 1 · Traspaso de trabajo

Estado al 04/10/2026 (actualizado tras T7 y T8). Rama de trabajo: `front-entrega-1`. Entrega: **15/10/2026 18:00 (UTC-3)**, un único PDF con la URL pública del mockup y la URL pública del repositorio. Para aprobar hay que sacar **Bueno o más en cada criterio 3.1 a 3.5** de `Sprint 1 - Consignas.pdf`.

## 1. Reglas de trabajo (no negociables)

1. **Todo respaldado por la teoría de clase.** Cada librería o técnica nueva se etiqueta "Visto en clase: [archivo o página]" o "NO visto en clase". Si algo no se vio, se dice y se prefiere la alternativa vista. Material: PDFs de teoría (Sensores, Más allá de expo-sensors, Context, AsyncStorage, Styles y Layout, Navigators, Práctica Prisma), los proyectos de ejemplo (Sensores_para_alumnos, Context-Local, Ejercicio de Navegación) y EVA Clases 3, 4 y 6.
2. **Sin backend propio en este sprint.** Todo sale de `data/mock.ts` (datos estáticos o simulados).
3. **No eliminar funcionalidades.** Se puede cambiar la estética, no sacar features.
4. **No inventar versiones.** Las versiones de paquetes nativos salen de `node_modules/expo/bundledNativeModules.json` (es lo que usa `npx expo install`). Si `npx expo install` falla por red, instalar con npm ese mismo rango.
5. **Una tarea por vez**: terminar, probar en el teléfono, commit, siguiente.
6. Antes de cada commit: `npx tsc --noEmit` y `npx expo lint` sin errores. Opcional: `npx expo export --platform android --output-dir /tmp/check` para verificar que el bundle compila.

## 2. Stack y cómo correrlo

- Expo SDK 57 (`expo` 57.0.x), React Native 0.86, Expo Router con `typedRoutes` y `reactCompiler`, TypeScript estricto.
- Correr: `npm install` y `npx expo start -c`. Probar en **dispositivo físico con Expo Go** (la cámara no anda en simulador).
- Si Expo Go dice "There was a problem running the requested app": PC y teléfono en **el mismo Wi-Fi**, sin VPN; en iPhone, Ajustes → Privacidad → Red local → Expo Go activado. Si la red aísla dispositivos: `npx expo start --tunnel`.
- **Cuentas de prueba** (todas con contraseña `vinilo123`): `lucaf` / `luca@sleeve.app`, `mica.spins`, `tomas_crate`, `sofi33rpm`, `juanjazz`.
- **Código de barras real cargado**: Sticky Fingers (2020), `0602508773143`. También `5099902894119` (Dark Side of the Moon, 2 ediciones: EU y US).

## 3. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Componentes nativos (consigna 1.4) | **1) Cámara** con escaneo real de código de barras (hecho). **2) GPS** al agregar un disco a la colección: "Encontrado en San Telmo, CABA" (hecho, T7). |
| Descartado | Biometría (el equipo usa login clásico). "Centrar en mi posición" en el mapa (se vería forzado: tu ubicación no tiene relación con dónde se prensó el disco). |
| Login | Clásico: email **o** username + contraseña, datos simulados, sesión guardada en AsyncStorage. *Supuesto pendiente de confirmar con los docentes: login y validaciones con datos simulados son válidos para el sprint.* |
| Colección | Una por usuario, persistida en el teléfono (`sleeve-collection-<userId>`). La primera vez arranca con la de `mock.ts`. |
| Mapa (T8) | Hecho con `react-native-maps` (NO visto en clase; elegido por el equipo sobre la alternativa de imagen + `position: 'absolute'`). Muestra **un solo prensado a la vez**: el país de la edición abierta, en el detalle `release/[id]`. Mismo componente desde escaneo, colección, colección ajena o búsqueda. **No** hay mapa global ni filtros por origen. En la versión final el país saldrá de la Discogs API v2. |
| País de Sticky Fingers | Discogs deja el país vacío; se usó **France** porque figura "Pressed By – MPO" (planta francesa). Aclararlo en el PDF como dato cargado a mano. |
| Discogs API | NO vista en clase: en este sprint el código escaneado se resuelve contra `mock.ts` (`releasesByBarcode`). |
| Paleta | "Etiqueta Roja" (abajo). Mismos HEX en PDF, mockup y app (si no coinciden, el criterio 3.2 cae a Bueno). |
| Tipografía | Fuente del sistema (Roboto / SF Pro) en mockup y app. Cargar fuentes propias con `expo-font` es NO visto en clase. |

### Paleta Etiqueta Roja (fuente de verdad: `constants/theme.ts`)

| Token | Claro | Oscuro |
|---|---|---|
| primary | `#B3261E` | `#E5534B` |
| onPrimary | `#FFFFFF` | `#121010` |
| secondary | `#1F2A44` | `#8FA3C7` |
| accent (solo relleno, nunca texto) | `#F2B33D` | `#F2B33D` |
| bg | `#FAF6EF` | `#121010` |
| surface | `#FFFFFF` | `#1E1A18` |
| surfaceAlt | `#F1EBE1` | `#2A2421` |
| border | `#DDD3C5` | `#3A322E` |
| text | `#1A1714` | `#F3EEE6` |
| muted | `#6B6259` | `#A39A92` |

Contraste texto/fondo: 16.6:1 (claro) y 16.4:1 (oscuro). `muted`, `primary` y `onPrimary` superan 4.5:1 en ambos modos.

## 4. Arquitectura actual y convenciones

```
app/_layout.tsx          AppSettingsProvider > AuthProvider > CollectionProvider > (Login | Stack)
app/(tabs)/              Inicio, Buscar, Escanear (botón central, abre /escanear), Colección, Perfil
app/escanear.tsx         Cámara real (expo-camera), permisos, panel de ediciones, "sin resultado"
app/release/[id].tsx     Detalle de edición: "Encontrado en" (T7) y mapa del país (T8)
app/usuario/[id].tsx     Perfil público
app/ajustes.tsx          Tema (Claro/Oscuro/Sistema) y Cerrar sesión. Falta Idioma (T11)
components/login-screen  Login (no es una ruta: el layout lo muestra si no hay sesión)
context/settings.tsx     useAppSettings() / useTheme(): idioma, tema, colors (persistido)
context/auth.tsx         useAuth() / useCurrentUser(): login, logout, sesión (persistido)
context/collection.tsx   useCollection() / useRanking(): colección y hallazgos GPS por usuario (persistidos)
utils/location.ts        getCurrentFind(): permiso → GPS → "Barrio, Ciudad" (T7)
components/pressing-map  Tarjeta "País de la edición"; el MapView está en country-map(.web).tsx (T8)
data/countries.ts        Coordenadas, zoom, bandera y nombre ES/EN por país (fuente de flagFor)
constants/theme.ts       getColors(mode), spacing, radius, fontSize
data/mock.ts             releases, users, credentials, reviews, releasesByBarcode, flagFor
```

**Convenciones que hay que respetar:**
- **Colores siempre del tema**, nunca HEX sueltos. Patrón en cada componente:
  ```tsx
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // ...
  const createStyles = (colors: Palette) => StyleSheet.create({ ... });
  ```
  Excepciones intencionales: texto blanco sobre la cámara (`CAMERA_TEXT`) y sobre las tapas (`cover.tsx`).
- **Usuario actual**: `useCurrentUser()` (no existe más `ME_ID` fuera de `mock.ts`).
- **Persistencia**: AsyncStorage con guard `isHydrated`, como en el ejemplo Context-Local. Nunca guardar contraseñas.
- **Permisos de hardware**: el patrón de Sensores_ReactNative_Expo.pdf (consultar, pedir, y si `canAskAgain === false` ofrecer `Linking.openSettings()`), con el texto del permiso en el plugin de `app.json`.
- Navegación: Expo Router. Rutas protegidas de Expo Router = NO visto en clase; se usa render condicional (patrón del RootNavigator del ejercicio).

## 5. Backlog: hecho y pendiente

| P | Tarea | Estado | Criterio |
|---|---|---|---|
| 1 | T1 Que la URL del repo muestre la app: hoy `main` es la plantilla de create-expo-app (SDK 54). Merge de `front-entrega-1` a `main` (PR) o cambiar la rama por defecto en GitHub | **Pendiente (decisión del equipo)** | 3.5, 1.5 |
| 2 | T2 Branding: paleta (hecha), tipografía (sistema), **isologo** | Falta isologo | 3.2 |
| 3 | T3 Texto 1.1: problema, 2 arquetipos de usuario, diferencial vs Discogs, monetización (freemium/suscripción) | Pendiente | 3.1 |
| 4 | T4 Escaneo real con cámara | ✅ commit `856d1dc` | 3.4 |
| 5 | T5 Paleta, modo claro/oscuro, AppSettingsContext | ✅ `f91770e` | 3.2 |
| 6 | T6 Login local + colección por usuario | ✅ `238cd23` | oral |
| 7 | T7 GPS al agregar un disco ("Encontrado en…") | ✅ `038a5ab` | 3.4 |
| 8 | T8 Mapa por edición | ✅ `cf29303` | oral |
| 9 | T9 Mockup en Figma con URL pública | Pendiente (lo arma el compañero) | 3.3, 3.2, 3.5 |
| 10 | T10 Validaciones | **Siguiente** | oral, 3.3 |
| 11 | T11 Idioma ES/EN | Pendiente | oral |
| 12 | T12 Ícono y splash con el isologo; `AGENTS.md` dice v54 y el proyecto es v57 | Pendiente | 3.2 |
| 13 | T13 Prueba completa en el teléfono + capturas (cámara, GPS, claro/oscuro, ES/EN) | Pendiente | 3.5 |
| 14 | T14 PDF final | Pendiente | todos |
| 15 | T15 Probar las 2 URLs en ventana de incógnito | Pendiente | 3.5 |

### Calendario propuesto
| Fecha | Tareas |
|---|---|
| 5/10 | T7 GPS · T1, T2, T3 |
| 6 al 7/10 | T8 Mapa · Figma (T9) en paralelo |
| 8/10 | T10 Validaciones |
| 9 al 10/10 | T11 Idioma · Figma con variantes claro/oscuro y EN |
| 11/10 | T12 · ajustes para que app y mockup coincidan |
| 12 al 13/10 | T13 capturas · T14 borrador PDF · push + merge |
| **14/10** | **Margen**: revisar PDF, ortografía, URLs en incógnito |
| 15/10 | Entregar antes de las 12:00 |

## 6. Pasos detallados de lo que sigue

### T7 · GPS al agregar un disco (segundo componente nativo) · ✅ hecho
Respaldo: Visto en clase, Sensores_ReactNative_Expo.pdf (expo-location: `requestForegroundPermissionsAsync`, `getCurrentPositionAsync`, `reverseGeocodeAsync`; permisos en `app.json`) y `Sensores_para_alumnos/screens/Antipodas.tsx`.
1. `npm install expo-location@~57.0.20` (rango de `bundledNativeModules.json`).
2. `app.json`, en `plugins`: `["expo-location", { "locationWhenInUsePermission": "Sleeve guarda dónde encontraste cada disco de tu colección." }]`.
3. Datos: guardar por usuario `{ [releaseId]: { lat, lng, lugar, fecha } }` en AsyncStorage (por ejemplo `sleeve-finds-<userId>`), siguiendo el patrón de `context/collection.tsx` (se puede extender ese mismo context).
4. Flujo: en `release/[id].tsx`, al tocar "Agregar a mi colección": pedir permiso → `getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })` → `reverseGeocodeAsync` → armar "Barrio, Ciudad". Si el permiso se niega o falla, **el disco se agrega igual, sin ubicación** (la ubicación es un plus, no puede bloquear la colección). Chequear `hasServicesEnabledAsync` como en Antipodas.
5. Mostrar debajo del botón: "Encontrado en San Telmo, CABA · 05/10/2026". Al quitar el disco, borrar el hallazgo.
6. Para el PDF (justificación técnica): lectura puntual (no `watchPositionAsync`) para cuidar batería; precisión `Balanced` alcanza para identificar una disquería; permiso solo en primer plano; cámara + GPS en un mismo flujo (escanear → identificar → registrar dónde).

### T8 · Mapa por edición (`components/pressing-map.tsx`) · ✅ hecho
Implementado con `react-native-maps` 1.27.2. En Expo Go no necesita API key; un build propio de Android requiere `androidGoogleMapsApiKey` en el plugin de `app.json` (iOS usa Apple Maps sin key). En web el mapa no existe (`country-map.web.tsx` devuelve `null`) porque la librería no lo soporta.

- Recibe `release: Release`; usa `country`, `label`, `year`, `format`.
- `data/countries.ts`: `{ [country]: { lat, lng, delta, flag, nombreES, nombreEN } }` con los países del mock (Argentina, UK, US, Europe, Germany, Japan, France). Reemplaza al `flags` de `mock.ts` (una sola fuente de verdad; `flagFor` pasa a leer de ahí).
- Marcador en el centroide aproximado del país; `"Europe"` se trata como región ("Edición europea"). Zoom inicial por país (`delta` de la tabla). Sin gestos de scroll para no pelear con el `ScrollView` del detalle.
- Al tocar el marcador: "🇫🇷 France · Rolling Stones Records · 2020 · LP".
- País desconocido: tarjeta "Origen no disponible".
- Va en `release/[id].tsx` reemplazando la tarjeta "Origen del prensado".
- Librería: `react-native-maps` (bundled `1.27.2`) es **NO visto en clase**; compatibilidad con Expo Go en SDK 57 y API key de Android a verificar. Probarla máximo medio día. **Alternativa vista en clase**: `Image` de un mapa del mundo + marcador con `position: 'absolute'` por proyección equirectangular (Clase 3, Styles y Layout). Las props del componente no cambian.
- En el PDF: decir "país de la edición" (en Discogs `country` es el país de lanzamiento; la planta figura en los créditos).

### T10 · Validaciones (sin librerías: Zod/Yup NO vistos)
Respaldo: Ejercicio de Navegación - Consigna.pdf (campos vacíos + `Alert.alert`) y validaciones de `enanos-backend`.
- Login: si el identificador tiene `@`, validar formato de email; errores inline bajo cada campo; `Alert.alert` si las credenciales fallan (ya existe).
- Buscar: modo "Ingresar código" manual: solo dígitos, 12 (UPC-A) o 13 (EAN-13), con dígito verificador; usar `normalizeBarcode` y `releasesByBarcode` de `mock.ts`.
- Reseña (modal nuevo desde el detalle): estrellas 1 a 5 obligatorias y texto mínimo; guardar local por usuario.

### T11 · Idioma ES/EN
Respaldo: React Native - Context.pdf y Context-Local (`translations` + `t(language)` con `useMemo`; i18next es NO visto).
- `language` ya existe y persiste en `context/settings.tsx`. Falta: `constants/translations.ts`, exponer `texts` desde el context, pasar **todos** los textos (incluidos títulos de tabs y del Stack) y agregar la sección Idioma en `app/ajustes.tsx`.

## 7. Riesgos que pueden dejarnos debajo de Bueno
1. **Branding inconsistente o incompleto (3.2)**: falta isologo; los HEX del PDF y del mockup tienen que ser exactamente los de arriba.
2. **Propuesta de negocio ausente (3.1)**: sin público segmentado ni monetización cae a Insuficiente.
3. **Componente nativo no demostrable (3.4)**: GPS y cámara probados en dispositivo físico, con capturas en el PDF.
4. **URL del repo mostrando la plantilla (3.5)**: resolver T1 antes de entregar y probar en incógnito.
