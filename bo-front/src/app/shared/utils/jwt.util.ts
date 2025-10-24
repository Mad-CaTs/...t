// src/app/shared/utils/jwt.util.ts
export interface JwtPayload {
  [key: string]: any;
}

export function decodeJwt(token: string): JwtPayload | null {
  if (!token || token.split('.').length < 2) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    console.warn('[JWT] No se pudo decodificar el token:', e);
    return null;
  }
}

export function extractUserId(payload: JwtPayload | null): string | number | null {
  if (!payload) return null;
  // Campos comunes: sub, userId, id, uid
  return (
    payload['userId'] ??
    payload['id'] ??
    payload['uid'] ??
    payload['sub'] ??
    null
  );
}
