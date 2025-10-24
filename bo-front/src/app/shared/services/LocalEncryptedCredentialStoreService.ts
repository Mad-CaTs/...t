/**
 * LocalEncryptedCredentialStoreService.ts
 * =============================================================================
 * ¿QUÉ HACE?
 * -----------------------------------------------------------------------------
 * Servicio “temporal” para recordar credenciales en el FRONT:
 * - Cifra { docType, docNumber, password } con Web Crypto (AES-GCM 256).
 * - Persiste el blob cifrado en localStorage.
 * - Persiste la clave simétrica como JWK en localStorage (para poder descifrar).
 *
 * DÓNDE SE USA:
 * -----------------------------------------------------------------------------
 * En `PublicLoginComponent`:
 * =============================================================================
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalEncryptedCredentialStoreService {
  private KEY_NAME = 'creds_key_v1';   // almacena la clave simétrica como JWK (JSON)
  private DATA_NAME = 'creds_blob_v1'; // almacena el blob cifrado

  /**
   * Cifra y guarda { docType, docNumber, password } en localStorage.
   */
  async save(docType: string, docNumber: string, password: string): Promise<void> {
    const key = await this.ensureKey();

    // IV aleatorio de 96 bits (12 bytes) recomendado para AES-GCM
    const ivU8 = crypto.getRandomValues(new Uint8Array(12));

    const payload = { docType, docNumber, password };
    const plainU8 = new TextEncoder().encode(JSON.stringify(payload));

    // 👇 Convertimos a ArrayBuffer “real” para evitar conflictos de tipos TS (BufferSource)
    const cipherAb = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: this.toAb(ivU8) },
      key,
      this.toAb(plainU8)
    );

    const blob = {
      iv: this.bufToB64(ivU8),
      c: this.bufToB64(new Uint8Array(cipherAb)),
      v: 1
    };

    localStorage.setItem(this.DATA_NAME, JSON.stringify(blob));
  }

  /**
   * Lee, descifra y devuelve { docType, docNumber, password } o null si no hay/ falla.
   */
  async load(): Promise<{ docType: string; docNumber: string; password: string } | null> {
    const raw = localStorage.getItem(this.DATA_NAME);
    if (!raw) return null;

    try {
      const { iv, c } = JSON.parse(raw);
      const key = await this.ensureKey();

      const ivU8 = this.b64ToBuf(iv);
      const cipherU8 = this.b64ToBuf(c);

      const plainAb = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.toAb(ivU8) },
        key,
        this.toAb(cipherU8)
      );

      const obj = JSON.parse(new TextDecoder().decode(new Uint8Array(plainAb)));
      if (!obj?.docType || !obj?.docNumber || typeof obj?.password !== 'string') return null;
      return obj;
    } catch {
      return null;
    }
  }

  /**
   * Borra las credenciales cifradas del almacenamiento.
   * (No borra la clave JWK: así evitas regenerarla si el usuario vuelve a guardar.)
   */
  clear(): void {
    localStorage.removeItem(this.DATA_NAME);
  }

  // ---------------------------------------------------------------------------
  // Clave simétrica persistente (JWK en localStorage)
  // ---------------------------------------------------------------------------

  /**
   * Importa (si existe) o genera una clave AES-GCM 256 y la persiste como JWK.
   */
  private async ensureKey(): Promise<CryptoKey> {
    const jwkStr = localStorage.getItem(this.KEY_NAME);
    if (jwkStr) {
      try {
        const jwk = JSON.parse(jwkStr);
        return await crypto.subtle.importKey(
          'jwk',
          jwk,
          { name: 'AES-GCM' },
          true,
          ['encrypt', 'decrypt']
        );
      } catch {
        // JWK corrupto → regenerar
        localStorage.removeItem(this.KEY_NAME);
      }
    }

    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const jwk = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(this.KEY_NAME, JSON.stringify(jwk));
    return key;
  }

  // ---------------------------------------------------------------------------
  // Utilidades de compatibilidad/ serialización
  // ---------------------------------------------------------------------------

  /**
   * Fuerza un ArrayBuffer “puro” haciendo una copia del contenido del Uint8Array.
   * Esto evita el error de TS:
   *   "Uint8Array<ArrayBufferLike> is not assignable to BufferSource"
   */
  private toAb(u8: Uint8Array): ArrayBuffer {
    const copy = new Uint8Array(u8.length);
    copy.set(u8);
    return copy.buffer; // <- ArrayBuffer real
  }

  /** Convierte bytes → base64 */
  private bufToB64(buf: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i]);
    return btoa(binary);
  }

  /** Convierte base64 → bytes */
  private b64ToBuf(b64: string): Uint8Array {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
}
