import { Injectable } from '@angular/core';

export type GeoCoord = [number, number];
export type PlaceSuggestion = { label: string; lon: number; lat: number };

@Injectable({ providedIn: 'root' })
export class MapBoxService {
  private readonly BASE = 'https://nominatim.openstreetmap.org';

  private headers() {
    return {
      'Accept-Language': 'es',
      'User-Agent': 'ModalMapPicker/1.0 (contacto@tu-dominio.com)'
    };
  }

  /** Reverse geocoding: [lon, lat] -> texto */
  async reverse([lon, lat]: GeoCoord): Promise<string> {
    const url = `${this.BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: this.headers() });
    const data = await res.json();
    return data?.display_name ?? '';
  }

  /** Geocoding: dirección -> [lon, lat] (primer resultado) */
  async getCoordinates(address: string): Promise<GeoCoord | null> {
    const url = `${this.BASE}/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: this.headers() });
    const data = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;
    const p = data[0];
    return [parseFloat(p.lon), parseFloat(p.lat)];
  }

  /** Sugerencias: lista de posibles lugares */
  async searchPlaces(query: string, limit = 8): Promise<PlaceSuggestion[]> {
    const url = `${this.BASE}/search?format=jsonv2&q=${encodeURIComponent(query)}&addressdetails=0&limit=${limit}`;
    const res = await fetch(url, { headers: this.headers() });
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((d: any) => ({
      label: d.display_name as string,
      lon: parseFloat(d.lon),
      lat: parseFloat(d.lat),
    }));
  }

  /** Alias compat: address -> coords con fallback Lima */
  async getLocByAddress(address: string): Promise<GeoCoord> {
    const coord = await this.getCoordinates(address);
    return coord ?? [-77.029707, -12.1213526];
  }

  /** Alias compat: coords -> address */
  async getAddressByLoc(lngLat: GeoCoord): Promise<string> {
    return this.reverse(lngLat);
  }
}
