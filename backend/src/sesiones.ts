// Sesiones: al entrar o registrarse, el backend entrega un token y la app lo manda en cada pedido.
// Así el backend sabe quién llama sin que el usuario venga en la URL.

import { createHash, randomBytes } from "node:crypto";

// 30 días: la app no vuelve a pedir login cada vez que se abre, pero un token robado no sirve para siempre.
export const VIGENCIA_SESION_MS = 30 * 24 * 60 * 60 * 1000;

// En la base se guarda el SHA-256 del token, no el token. Si alguien se lleva dev.db, no puede usar
// esas sesiones: para entrar necesita el token, y del hash no se puede volver al token.
// Acá alcanza con SHA-256 (rápido) y no hace falta scrypt como con las contraseñas: el token son 32 bytes
// al azar (256 bits), así que no hay diccionario ni fuerza bruta posible. Una contraseña sí se puede adivinar.
export function hashDelToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Token nuevo y los datos de la fila de Sesion que le corresponde (sin el usuario, que lo pone quien la crea).
// randomBytes usa el generador criptográfico del sistema: Math.random() no sirve, porque se puede predecir.
export function nuevaSesion() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    fila: { tokenHash: hashDelToken(token), expiraEn: new Date(Date.now() + VIGENCIA_SESION_MS) },
  };
}
