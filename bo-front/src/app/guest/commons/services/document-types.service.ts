import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { DocumentTypeData } from '../interfaces/guest-components.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService {
  private url = environment.URL_API_TicketApi;
  private _http: HttpClient = inject(HttpClient);

  getDocumentType(): Observable<DocumentTypeData[]> {
    return this._http.get<DocumentTypeData[]>(`${this.url}/document-types`);
  }
}
