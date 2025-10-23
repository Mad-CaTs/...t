import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITableUsers } from '@interfaces/users.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  private readonly apiUrl = 'https://adminpanelapi.inclub.world/api/v1/users/';

  public getUsers(): Observable<ITableUsers[]> {
    return this.http.get<ITableUsers[]>(this.apiUrl);
  }

  public createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}crear`, data);
  }



    public getUserById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}${id}`);
    }

    public updateUser(id: number, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}editar/${id}`, data);
    }

    public getRoles(): Observable<any> {
      const url = 'https://adminpanelapi.inclub.world/api/v1/roles';
      return this.http.get<any>(url); // Observa que usamos `any` para manejar estructuras dinámicas
    }
    
    
  
}
