import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapBoxService {
  private URI = 'https://nominatim.openstreetmap.org/';

  constructor() {}

  async getAddressByLoc(lngLat: Array<number>) {
    const URI = `${this.URI}/reverse?format=jsonv2&lat=${lngLat[1]}&lon=${lngLat[0]}`;
    const res = await fetch(URI);
    const data = await res.json();
    return data.display_name;
  }

  async getCoordinates(address: string) {
    const URI = `${this.URI}/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(URI);
    const data = await res.json();

    if (!data || !data[0]) return null;
    const place = data[0];
    return [place.lon, place.lat];
  }

  async getLocByAddress(address: string) {
    const data = await this.getCoordinates(address);

    if (!data) return [-77.029707, -12.1213526];

    return data;
  }
}
