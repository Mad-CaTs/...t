// services/geo-location.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeoLocationService {
	private nominatimUrl = 'https://nominatim.openstreetmap.org';
	private overpassUrl = 'https://overpass-api.de/api/interpreter';

	constructor() {}

	async getCoordinates(address: string): Promise<{ lat: number; lon: number } | null> {
		const url = `${this.nominatimUrl}/search?format=json&q=${encodeURIComponent(address)}`;
		const res = await fetch(url);
		const data = await res.json();
		if (!data.length) return null;
		return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
	}

	async getNearbySucursales(lat: number, lon: number, radius = 5000) {
		const query = `
    [out:json][timeout:25];
    node(around:${radius},${lat},${lon})["name"~"Serpost", i];
    out;
  `;
		const res = await fetch(this.overpassUrl, {
			method: 'POST' /*  */,
			body: query
		});
		const data = await res.json();

		return data.elements;
	}


  }
