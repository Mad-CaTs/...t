import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TutorialRequest {
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/tutorial`;

  constructor(private http: HttpClient) { }

  // POST - Crear tutorial
  createTutorial(tutorial: TutorialRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, tutorial);
  }

  // GET - Obtener por ID
  getTutorialById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // GET - Obtener todos
  getAllTutorials(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // DELETE - Eliminar por ID
  deleteTutorial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
