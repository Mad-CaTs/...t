import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, catchError, of } from 'rxjs';
import { 
  AscendingLineUser, 
  GodfatherValidationResponse, 
  GodfatherUser 
} from '../interfaces/godfather.interface';

@Injectable({
  providedIn: 'root'
})
export class GodfatherService {
  private urlTree = environment.URL_GATEWEY; // Usamos el gateway
  private urlAdmin = environment.URL_ADMIN;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la línea ascendente del patrocinador (hasta 15 niveles)
   * @param sponsorId ID del patrocinador
   * @returns Observable con la lista de usuarios en la línea ascendente
   */
  getAscendingLine(sponsorId: number): Observable<AscendingLineUser[]> {
    return this.http.get<any>(`${this.urlTree}/three/ascending-line/${sponsorId}`)
      .pipe(
        map((response) => {
          if (response && response.data) {
            return response.data;
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error al obtener línea ascendente:', error);
          return of([]);
        })
      );
  }


  /**
   * Busca un usuario por username o código
   * @param searchTerm Término de búsqueda (username o código)
   * @returns Observable con el usuario encontrado
   */
  searchUserByUsername(searchTerm: string): Observable<GodfatherUser | null> {
    return this.http.get<any>(`${this.urlAdmin}/user/username/${searchTerm}`)
      .pipe(
        map((response) => {
          if (response && response.idUser) {
            return {
              idUser: response.idUser,
              name: response.name,
              lastName: response.lastName,
              username: response.userName,
              email: response.email,
              nroDocument: response.nroDocument
            };
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error al buscar usuario:', error);
          return of(null);
        })
      );
  }

  /**
   * Busca usuarios por nombre o username
   * @param searchTerm Término de búsqueda
   * @returns Observable con lista de usuarios
   */
  searchUsers(searchTerm: string): Observable<GodfatherUser[]> {
    const params = new HttpParams().set('search', searchTerm);
    
    return this.http.get<any>(`${this.urlAdmin}/user/search`, { params })
      .pipe(
        map((response) => {
          if (response && response.data && Array.isArray(response.data)) {
            return response.data.map((user: any) => ({
              idUser: user.idUser,
              name: user.name,
              lastName: user.lastName,
              username: user.userName,
              email: user.email,
              nroDocument: user.nroDocument
            }));
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error al buscar usuarios:', error);
          return of([]);
        })
      );
  }

  /**
   * Busca usuarios en todo el árbol de patrocinio
   * @param searchTerm Término de búsqueda
   * @returns Observable con lista de usuarios del árbol
   */
  searchUsersInTree(searchTerm: string): Observable<AscendingLineUser[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    
    return this.http.get<any>(`${this.urlTree}/three/search-users`, { params })
      .pipe(
        map((response) => {
          if (response && response.data) {
            return response.data;
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error al buscar usuarios en el árbol:', error);
          return of([]);
        })
      );
  }
}

