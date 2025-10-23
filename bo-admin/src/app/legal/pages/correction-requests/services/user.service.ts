import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.interface';
import { PortfolioResponse } from '../models/portfolio.interface';

export interface SubscriptionData {
  nombreCompleto: string;
  nacionalidad: string;
  tipoDocumento: string;
  nrodocument: string;
  distrito: string;
  pais: string;
  nombrePaquete: string;
  nombreFamilypackage: string;
  acciones: number;
  idsuscription: number;
  escalaPago: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.api;
  private readonly LEGAL_API_URL = 'http://localhost:8081';
  //private readonly LEGAL_API_URL = environment.apiLegal;
  private selectedUser: User | null = null;

  setSelectedUser(user: User) {
    this.selectedUser = user;
  };

  // private readonly PDF_API_URL = 'https://pdfapi-dev.inclub.world/api/v1';

  constructor(private http: HttpClient) {}

  searchUsers(searchTerm: string): Observable<User[]> {
    const formattedTerm = searchTerm.toLowerCase().trim();
    const body = { username: formattedTerm, typeUser: 1 };

    return this.http.post<User[]>(`${this.API_URL}/api/user/getListUsersOfAdmin/search`, body)
      .pipe(
        tap(response => console.log('Respuesta de la API de búsqueda:', response)),
        catchError(error => {
          console.error('Error en la API de búsqueda:', error);
          return of([]);
        })
      );
  }

  getUserPortfolios(userId: number): Observable<PortfolioResponse[]> {
    if (!userId) {
      console.error('No se proporcionó ID del usuario');
      return throwError(() => new Error('No se proporcionó ID del usuario'));
    }

    return this.http.get<PortfolioResponse[]>(`${this.API_URL}/api/suscription/user/${userId}`).pipe(
      tap(response => {
        if (Array.isArray(response) && response.length > 0) {
          console.log('IDs de portafolios:', response.map(p => p.id));
        }
      }),
      catchError(error => {
        console.error('Error en API de portafolios:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Sesión expirada. Por favor ingrese nuevamente.'));
        }
        return throwError(() => error);
      })
    );
  }

  getSubscriptionData(subscriptionId: number): Observable<SubscriptionData> {
    if (!subscriptionId) {
      console.error('No se proporcionó ID de suscripción');
      return throwError(() => new Error('No se proporcionó ID de suscripción'));
    }

    if (!this.selectedUser?.idUser) {
      console.error('No se encontró ID del usuario');
      return throwError(() => new Error('No se encontró ID del usuario'));
    }

    console.log('Obteniendo datos de suscripción:', {
      customerId: this.selectedUser.idUser,
      subscriptionId: subscriptionId
    });

    return this.http.get<SubscriptionData>(
      `${this.LEGAL_API_URL}/api/v1/legal/user-data/complete?customerId=${this.selectedUser.idUser}&suscriptionId=${subscriptionId}`,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
    ).pipe(
      tap(response => console.log('Datos de suscripción obtenidos:', response)),
      catchError(error => {
        console.error('Error al obtener datos de suscripción:', error);
        return throwError(() => error);
      })
    );
  }

  generateDocument(subscriptionId: number, userId: number, isContract: boolean = false): Observable<any> {
    return of({
      success: true,
      pdfBlob: new Blob(['Mock PDF content'], { type: 'application/pdf' })
    });

    /*
    return this.getUserPortfolios(userId).pipe(
      map(portfolios => {
        const portfolio = portfolios.find(p => p.id === subscriptionId);
        if (!portfolio) {
          throw new Error('Portafolio no encontrado');
        }

        const familyId = portfolio.pack.idFamilyPackage;
        const documentType = isContract ? '2' : '1';
        
        return this.http.get(`${this.PDF_API_URL}/legal-document/${subscriptionId}/${documentType}/${familyId}/true`, {
          responseType: 'blob'
        });
      }),
      catchError(error => {
        console.error('Error al generar documento:', error);
        return of({ 
          success: false, 
          error: error.message
        });
      })
    );
    */
  }
}