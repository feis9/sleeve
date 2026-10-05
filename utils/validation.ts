// Validaciones del Sprint 1, sin librerías (Zod/Yup no se vieron en clase).
// Cada función devuelve el mensaje de error en el idioma activo, o null si el valor es válido.
import type { Texts } from '@/constants/translations';

type Messages = Texts['validation'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-z0-9._]{3,30}$/i;

export const PASSWORD_MIN = 6;
export const REVIEW_MIN = 10;
export const REVIEW_MAX = 500;

// Login: acepta email o nombre de usuario.
export function validateIdentifier(value: string, m: Messages): string | null {
  const v = value.trim();
  if (!v) return m.identifierRequired;
  if (v.includes('@')) return EMAIL_RE.test(v) ? null : m.emailInvalid;
  return USERNAME_RE.test(v) ? null : m.usernameInvalid;
}

export function validatePassword(value: string, m: Messages): string | null {
  if (!value) return m.passwordRequired;
  if (value.length < PASSWORD_MIN) return m.passwordShort(PASSWORD_MIN);
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

export function validateBarcode(value: string, m: Messages): string | null {
  const digits = barcodeDigits(value);
  if (!digits) return m.barcodeRequired;
  if (!/^\d+$/.test(digits)) return m.barcodeDigitsOnly;
  if (digits.length < 12) return m.barcodeTooShort(digits.length);
  if (digits.length > 13) return m.barcodeTooLong(digits.length);
  if (!hasValidCheckDigit(digits)) return m.barcodeCheckDigit;
  return null;
}

export function validateRating(rating: number, m: Messages): string | null {
  return rating >= 1 && rating <= 5 ? null : m.ratingRequired;
}

export function validateReviewBody(value: string, m: Messages): string | null {
  const v = value.trim();
  if (v.length < REVIEW_MIN) return m.reviewShort(REVIEW_MIN, v.length);
  if (v.length > REVIEW_MAX) return m.reviewLong(REVIEW_MAX);
  return null;
}
