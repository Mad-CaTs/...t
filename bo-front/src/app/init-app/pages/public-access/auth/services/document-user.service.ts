import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentType, DocTypeOption } from '../models/document-type.model';

@Injectable({ providedIn: 'root' })
export class DocumentUserService {
  private readonly apiUrl = `${environment.URL_API_TicketApi}/document-types`;
  private cache$?: Observable<ReadonlyArray<DocTypeOption>>;

  constructor(private http: HttpClient) {}

  getDocumentTypes(force = false): Observable<ReadonlyArray<DocTypeOption>> {
    if (!this.cache$ || force) {
      this.cache$ = this.http.get<DocumentType[]>(this.apiUrl).pipe(
        map(list => list.map(d => ({ id: d.id, name: d.name }))),
        shareReplay(1)
      );
    }
    return this.cache$;
  }
}
