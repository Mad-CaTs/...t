import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class CheckService {
	private readonly API = environment.api;
	private apiUrl = `${this.API}/api/`;

	constructor(private http: HttpClient) {}

    // Agregar Servicios
}
