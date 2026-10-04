// Validaciones del Sprint 1, sin librerías (Zod/Yup no se vieron en clase).
// Cada función devuelve el mensaje de error, o null si el valor es válido.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-z0-9._]{3,30}$/i;

export const PASSWORD_MIN = 6;
export const REVIEW_MIN = 10;
export const REVIEW_MAX = 500;

// Login: acepta email o nombre de usuario.
export function validateIdentifier(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Ingresá tu email o tu usuario.';
  if (v.includes('@')) return EMAIL_RE.test(v) ? null : 'El email no tiene un formato válido (ej.: nombre@dominio.com).';
  return USERNAME_RE.test(v) ? null : 'El usuario lleva de 3 a 30 caracteres: letras, números, punto o guion bajo.';
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Ingresá tu contraseña.';
  if (value.length < PASSWORD_MIN) return `La contraseña tiene al menos ${PASSWORD_MIN} caracteres.`;
  return null;
}

// Código de barras de la funda: UPC-A (12 dígitos) o EAN-13 (13 dígitos).
// Se aceptan espacios y guiones porque así viene impreso ("6 96998 02071 9").
export function barcodeDigits(value: string) {
  return value.replace(/[\s-]/g, '');
}

// Dígito verificador GTIN: desde la derecha (sin contar el verificador), pesos 3, 1, 3, 1…
export function hasValidCheckDigit(digits: string) {
  const body = digits.slice(0, -1);
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    const weight = i % 2 === 0 ? 3 : 1;
    sum += Number(body[body.length - 1 - i]) * weight;
  }
  return (10 - (sum % 10)) % 10 === Number(digits[digits.length - 1]);
}

export function validateBarcode(value: string): string | null {
  const digits = barcodeDigits(value);
  if (!digits) return 'Ingresá el código de barras.';
  if (!/^\d+$/.test(digits)) return 'El código lleva solo números.';
  if (digits.length < 12) {
    return `Tiene ${digits.length} dígitos y lleva 12 o 13. Revisá el primero y el último: suelen estar impresos más chicos, a los costados de las barras.`;
  }
  if (digits.length > 13) return `Tiene ${digits.length} dígitos y lleva 12 (UPC-A) o 13 (EAN-13).`;
  if (!hasValidCheckDigit(digits)) return 'El último dígito no coincide con el resto: revisá que esté bien copiado.';
  return null;
}

export function validateRating(rating: number): string | null {
  return rating >= 1 && rating <= 5 ? null : 'Elegí de 1 a 5 estrellas.';
}

export function validateReviewBody(value: string): string | null {
  const v = value.trim();
  if (v.length < REVIEW_MIN) return `Escribí al menos ${REVIEW_MIN} caracteres (llevás ${v.length}).`;
  if (v.length > REVIEW_MAX) return `Máximo ${REVIEW_MAX} caracteres.`;
  return null;
}
