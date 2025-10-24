import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ISelect } from '@shared/interfaces/forms-control';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentMessageService {
  private readonly baseUrl = environment.URL_API_LEGAL;

  constructor(private http: HttpClient) { }

  getAllMessages() {
    return this.http.get<Record<string, string>>(`${this.baseUrl}/document/messages/front-info`);
  }

  getMessageByCode(code: string) {
    return this.http.get<string>(`${this.baseUrl}/document/messages/${code}`);
  }



  getApostillaOptions(): Observable<ISelect[]> {
    return this.http.get<any[]>(`${this.baseUrl}/document/options/APOSTILLA_OPCIONES`).pipe(
      map((options) =>
        options.map((opt) => ({
          value: opt.code,
          content: opt.description
        }))
      )
    );
  }
  
  

  
}
