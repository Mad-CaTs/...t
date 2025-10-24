import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Profile } from '../interfaces/guest-components.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = environment.URL_API_TicketApi;

  private _http: HttpClient = inject(HttpClient);

  updateProfile(data: Profile, id:number): Observable<Profile> {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );
    
    return this._http.patch<Profile>(`${this.url}/users/${id}/profile`, cleanData);
  }

  getProfileData(id: number): Observable<Profile> {
    return this._http.get<Profile>(`${this.url}/users/${id}`);
  }
}